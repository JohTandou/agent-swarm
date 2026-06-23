#!/usr/bin/env tsx
// ---------------------------------------------------------------------------
// finish.ts — Test gate → Git push → GitHub PR → Cleanup
//
// Usage :  npx tsx finish.ts "Add auth" "Implement OAuth2 flow"
//          (run from the project root)
//
// Exit :   0 = success (PR created or skipped), 1 = test gate blocked
// ---------------------------------------------------------------------------

import { execSync } from 'node:child_process';
import { chdir } from 'node:process';
import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { getWorkflow, getBool } from './config.js';
import { createPR } from './github.js';
import {
  getCurrentBranch,
  extractIssueFromBranch,
  getRepoRoot,
  hasGitHubRemote,
} from './utils.js';
import { runDetectStack } from './detect-stack.js';

const title = process.argv[2] || 'Development update';
const body = process.argv[3] || '';
const route = (process.argv[4] || 'SIMPLE').toUpperCase();

const repoRoot = getRepoRoot();
chdir(repoRoot);

if (!hasGitHubRemote()) {
  console.log('No GitHub remote detected. Skipping.');
  process.exit(0);
}

const wf = getWorkflow();
const blockOnFailure = getBool('swarm.testing.block_on_e2e_failure', true);
const interactive = getBool('swarm.testing.e2e_interactive_mode', false);
let testsPassed = false;

// 0. Test gate
console.log('=== Swarm Test Gate ===');
testsPassed = await runDetectStack({ interactive });

if (!testsPassed && blockOnFailure) {
  console.error('🚫 Test gate failed. block_on_e2e_failure=true — aborting.');
  process.exit(1);
}
if (!testsPassed) {
  console.warn('⚠️  Tests failed but block_on_e2e_failure=false — proceeding.');
}

// 1. Current branch
const branch = getCurrentBranch();
if (!branch) {
  console.error('No current branch detected.');
  process.exit(1);
}

// Try to recover issue number from branch name
const issueNum = extractIssueFromBranch(branch);

// 2. Push
if (wf.auto_create_branch) {
  const hasChanges = (() => {
    try {
      execSync('git diff --quiet HEAD', { stdio: 'ignore' });
      // No unstaged changes — check unpushed commits
      try {
        const log = execSync(`git log origin/${branch}..${branch} --oneline`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
        return log.trim().length > 0;
      } catch {
        return true; // upstream not set — needs push
      }
    } catch {
      return true; // has unstaged changes
    }
  })();

  if (hasChanges) {
    execSync('git add -A');
    execSync(`git commit -m "${title}"`);
    execSync(`git push -u origin ${branch}`, { stdio: 'inherit' });
    console.log(`Committed and pushed branch ${branch}`);
  } else {
    console.log('No new changes to push.');
  }
}

// 2.5 — Swarm gate check
const memoryPath = join(repoRoot, '.agent-memory.json');
if (!existsSync(memoryPath)) {
  console.error('🚫 Gate blocked: .agent-memory.json not found');
  process.exit(1);
}
const memory = JSON.parse(readFileSync(memoryPath, 'utf-8'));
const metrics = memory.metrics;
if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
  console.error('🚫 Gate blocked: .agent-memory.json has no metrics entries');
  process.exit(1);
}
const lastRun = metrics[metrics.length - 1];

function checkGates(lastRun: any, route: string): string | null {
  if (route === 'DIRECT') return null;
  if (route === 'SIMPLE' || route === 'ADAPT') {
    if (lastRun.tester_pass !== true) return 'tester_pass must be true';
    return null;
  }
  if (route === 'MEDIUM' || route === 'FULL') {
    if (lastRun.tester_pass !== true) return 'tester_pass must be true';
    if (lastRun.reviewer_approved !== true) return 'reviewer_approved must be true';
    return null;
  }
  if (lastRun.tester_pass !== true) return 'tester_pass must be true';
  return null;
}

console.log('=== Swarm Quality Gate ===');
const gateError = checkGates(lastRun, route);
if (gateError) {
  console.error(`🚫 Gate blocked: ${gateError}`);
  console.error('The tester must validate the task before creating a PR.');
  console.error(`Route: ${route}, tester_pass: ${lastRun.tester_pass ?? 'MISSING'}, reviewer_approved: ${lastRun.reviewer_approved ?? 'N/A'}`);
  process.exit(1);
}
console.log(`✅ Gates passed — tester ${route === 'DIRECT' ? 'N/A' : 'PASS'}, reviewer ${route === 'MEDIUM' || route === 'FULL' ? 'APPROVE' : 'N/A'}`);

// 3. Pull Request
let prNumber: number | null = null;
if (wf.auto_create_pr && issueNum) {
  const prBody = `Closes #${issueNum}\n\n${body}`;
  prNumber = createPR(title, prBody, branch, wf.pr_draft_by_default);
  if (prNumber) {
    console.log(`PR #${prNumber} created.`);
  }
} else if (!issueNum) {
  console.log('Skipping PR creation (no issue number in branch name).');
}

// 4. Cleanup dev processes
if (wf.cleanup_processes_after_run && !interactive) {
  try { execSync('pkill -f "next dev"', { stdio: 'ignore' }); } catch { /* fine */ }
  try { execSync('pkill -f "vite"', { stdio: 'ignore' }); } catch { /* fine */ }
  console.log('Cleaned up dev processes.');
}

// Interactive mode: open browser for manual testing
if (interactive) {
  try { execSync('open http://localhost:3000', { stdio: 'ignore' }); } catch { /* skip */ }
  console.log('Browser opened at http://localhost:3000 — close when done, Ctrl+C to stop servers');
}

// Output JSON result
console.log(JSON.stringify({
  pr: prNumber,
  branch,
  tests: testsPassed ? 'pass' : 'fail',
}));
