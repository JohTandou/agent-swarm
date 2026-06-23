#!/usr/bin/env tsx
// ---------------------------------------------------------------------------
// setup.ts — Creates GitHub issue + feature branch
//
// Usage :  npx tsx setup.ts "Add auth" "Implement OAuth2 flow"
//          (run from the project root)
//
// Exit :   JSON result on stdout, 0 = success, 1 = failure
// ---------------------------------------------------------------------------

import { execSync } from 'node:child_process';
import { chdir } from 'node:process';
import { getWorkflow, getGithub } from './config.js';
import { createIssue } from './github.js';
import { slugify, getRepoRoot, hasGitHubRemote } from './utils.js';

const title = process.argv[2] || 'Development update';
const body = process.argv[3] || 'Automated branch created by development session.';

// cd to repo root
const repoRoot = getRepoRoot();
chdir(repoRoot);

if (!hasGitHubRemote()) {
  console.log('No GitHub remote detected. Skipping.');
  process.exit(0);
}

const wf = getWorkflow();
const gh = getGithub();
let issueNum: number | null = null;
let branch: string | null = null;

// 1. Create GitHub Issue
if (wf.auto_create_github_issue) {
  const issue = createIssue(title, body);
  issueNum = issue.number;
  console.log(`Created issue #${issueNum}`);
} else {
  console.log('Skipping issue creation (disabled in config).');
}

// 2. Checkout base branch + pull latest
try { execSync('git stash push -m "swarm-queue-stash"', { stdio: 'ignore' }); } catch { /* fine */ }
execSync(`git checkout ${gh.default_base_branch}`, { stdio: 'inherit' });
try { execSync(`git pull origin ${gh.default_base_branch}`, { stdio: 'inherit' }); } catch { /* offline? */ }

// 3. Create / checkout feature branch
if (wf.auto_create_branch) {
  const slug = slugify(title);
  branch = issueNum
    ? `${gh.branch_prefix}issue-${issueNum}-${slug}`
    : `${gh.branch_prefix}${slug}`;

  const branchExists = (() => {
    try { execSync(`git show-ref --verify --quiet refs/heads/${branch}`, { stdio: 'ignore' }); return true; }
    catch { return false; }
  })();

  if (branchExists) {
    execSync(`git checkout ${branch}`, { stdio: 'inherit' });
    console.log(`Checked out existing branch ${branch}`);
  } else {
    execSync(`git checkout -b ${branch}`, { stdio: 'inherit' });
    console.log(`Created and checked out branch ${branch}`);
  }
} else {
  console.log('Skipping branch creation (disabled in config).');
}

// Output JSON result for the orchestrator
console.log(JSON.stringify({
  issue: issueNum,
  branch,
  base_branch: gh.default_base_branch,
}));
