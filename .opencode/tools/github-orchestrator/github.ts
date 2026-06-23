// ---------------------------------------------------------------------------
// github.ts — Typed wrappers around the `gh` CLI
//
// No new dependencies. Uses execSync on `gh`. Fails with clear messages if
// gh is not installed or the repo has no GitHub remote.
// ---------------------------------------------------------------------------

import { execSync } from 'node:child_process';

/** Ensure gh CLI is available */
function requireGh(): void {
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch {
    console.error('Error: GitHub CLI (gh) is not installed or not in PATH.');
    console.error('Install it: https://cli.github.com/');
    process.exit(1);
  }
}

/** Create a GitHub issue. Returns { number, url }. Exits on failure. */
export function createIssue(title: string, body: string): { number: number; url: string } {
  requireGh();
  try {
    const out = execSync(
      `gh issue create --title "${title}" --body "${body}"`,
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] },
    ).trim();
    const match = out.match(/(\d+)$/);
    if (!match) throw new Error(`Could not parse issue number from: ${out}`);
    const number = parseInt(match[1]!, 10);
    // gh issue create outputs the URL like https://github.com/owner/repo/issues/42
    const url = out.trim();
    return { number, url };
  } catch (e: unknown) {
    const err = e as { stderr?: string; message?: string };
    console.error('Failed to create GitHub issue:', err.stderr || err.message);
    process.exit(1);
  }
}

/** Create a draft or ready PR. Returns the PR number or null if skipped. */
export function createPR(
  title: string,
  body: string,
  branch: string,
  draft: boolean,
): number | null {
  requireGh();
  const draftFlag = draft ? '--draft' : '';
  try {
    const out = execSync(
      `gh pr create --title "${title}" --body "${body}" ${draftFlag}`.trim(),
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] },
    ).trim();
    // gh pr create outputs the PR URL, e.g. https://github.com/owner/repo/pull/128
    const match = out.match(/\/pull\/(\d+)$/);
    if (!match) {
      console.error('Could not parse PR number from:', out);
      return null;
    }
    return parseInt(match[1]!, 10);
  } catch (e: unknown) {
    const err = e as { stderr?: string; message?: string };
    console.error('Failed to create PR:', err.stderr || err.message);
    return null;
  }
}

/** Find an open PR number by branch name. Returns null if none found. */
export function findPRByBranch(branch: string): number | null {
  requireGh();
  try {
    const out = execSync(
      `gh pr list --head "${branch}" --json number --jq '.[0].number'`,
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] },
    ).trim();
    if (!out) return null;
    return parseInt(out, 10);
  } catch {
    return null;
  }
}

/** Mark a draft PR as ready for review */
export function markPRReady(prNumber: number): void {
  try {
    execSync(`gh pr ready ${prNumber}`, { stdio: 'ignore' });
  } catch {
    // PR might already be ready — ignore
  }
}

/** Squash-merge a PR. Returns true on success. */
export function mergePR(prNumber: number): boolean {
  requireGh();
  // Mark ready first (no-op if already ready)
  markPRReady(prNumber);
  try {
    execSync(`gh pr merge ${prNumber} --squash`, { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

/** Close a GitHub issue. Returns true on success. */
export function closeIssue(issueNumber: number): boolean {
  requireGh();
  try {
    execSync(`gh issue close ${issueNumber}`, { stdio: 'ignore' });
    console.log(`Closed issue #${issueNumber}.`);
    return true;
  } catch {
    console.warn(`Warning: could not close issue #${issueNumber}.`);
    return false;
  }
}
