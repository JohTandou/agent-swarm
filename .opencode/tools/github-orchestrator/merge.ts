#!/usr/bin/env tsx
// ---------------------------------------------------------------------------
// merge.ts — Squash-merge PR, close issue, delete feature branch
//
// Usage :  npx tsx merge.ts "Add auth"
//          (run from the project root)
//
// Exit :   0 = merged, 1 = failed (no branch / no PR / merge conflict)
// ---------------------------------------------------------------------------

import { execSync } from 'node:child_process';
import { chdir } from 'node:process';
import { getGithub } from './config.js';
import { findPRByBranch, mergePR, closeIssue } from './github.js';
import { getCurrentBranch, extractIssueFromBranch, getRepoRoot, hasGitHubRemote } from './utils.js';

const repoRoot = getRepoRoot();
chdir(repoRoot);

if (!hasGitHubRemote()) {
  console.log('No GitHub remote detected. Skipping.');
  process.exit(0);
}

const branch = getCurrentBranch();
if (!branch) {
  console.error('No current branch detected. Aborting merge.');
  process.exit(1);
}

// Recover issue number from branch name
const issueNum = extractIssueFromBranch(branch);

// Find PR
const prNum = findPRByBranch(branch);
if (!prNum) {
  console.error(`No open PR found for branch ${branch}. Aborting merge.`);
  process.exit(1);
}

console.log(`Merging PR #${prNum} (branch ${branch})...`);

// Merge
const merged = mergePR(prNum);
if (!merged) {
  console.error(`Failed to merge PR #${prNum}. Resolve conflicts or checks and retry manually.`);
  process.exit(1);
}
console.log(`PR #${prNum} merged successfully.`);

// Close issue
let issueClosed = false;
if (issueNum) {
  issueClosed = closeIssue(issueNum);
}

// Checkout base and pull
const base = getGithub().default_base_branch;
execSync(`git checkout ${base}`, { stdio: 'inherit' });
try { execSync(`git pull origin ${base}`, { stdio: 'inherit' }); } catch { /* offline? */ }

// Delete local branch
let deletedLocal = false;
try {
  execSync(`git branch -d ${branch}`, { stdio: 'inherit' });
  deletedLocal = true;
  console.log(`Deleted local branch ${branch}.`);
} catch {
  try {
    execSync(`git branch -D ${branch}`, { stdio: 'inherit' });
    deletedLocal = true;
    console.log(`Force-deleted local branch ${branch}.`);
  } catch {
    console.warn(`Warning: could not delete local branch ${branch}.`);
  }
}

// Delete remote branch
let deletedRemote = false;
try {
  execSync(`git push origin --delete ${branch}`, { stdio: 'inherit' });
  deletedRemote = true;
  console.log(`Deleted remote branch ${branch}.`);
} catch {
  console.warn(`Warning: could not delete remote branch ${branch}.`);
}

// Output JSON result
console.log(JSON.stringify({
  merged: true,
  pr_number: prNum,
  branch_deleted_local: deletedLocal,
  branch_deleted_remote: deletedRemote,
  issue_closed: issueClosed,
}));
