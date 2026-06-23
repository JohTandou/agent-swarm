// ---------------------------------------------------------------------------
// utils.ts — Pure utility functions (no side effects on process.env)
// Replaces: load_env_file(), wait_for_service(), log_step(), finalize_report(),
//           detect-stack logic (package manager, framework, backend dir)
// ---------------------------------------------------------------------------

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { DetectedProject, Framework, TestReport, TestStep } from './types.js';

// ---- Report file (mirrors .orchestrator-report.json) ----

const REPORT_FILE = '.orchestrator-report.json';
const BUILD_LOG = '.orchestrator-build.log';
const TEST_LOG = '.orchestrator-test.log';
const E2E_LOG = '.orchestrator-e2e.log';
const MOCK_LOG = '.orchestrator-mocks.log';
const BACKEND_LOG = '.orchestrator-backend.log';
const DEVSERVER_LOG = '.orchestrator-devserver.log';

export function initReport(): TestReport {
  const report: TestReport = { steps: [], overall: 'running' };
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  return report;
}

export function readReport(): TestReport {
  return JSON.parse(readFileSync(REPORT_FILE, 'utf-8')) as TestReport;
}

export function logStep(name: string, status: TestStep['status'], detail = ''): void {
  const report = readReport();
  report.steps.push({ name, status, detail });
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
}

export function finalizeReport(overall: 'pass' | 'fail'): void {
  const report = readReport();
  report.overall = overall;
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
}

// ---- .env file loader ----

/** Parse a .env file and return key-value pairs (does NOT mutate process.env) */
export function parseEnvFile(filePath: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!existsSync(filePath)) return result;
  const content = readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    result[key] = value;
  }
  return result;
}

/** Load .env file and set on the given env object */
export function loadEnvFile(filePath: string, target: Record<string, string>): void {
  const vars = parseEnvFile(filePath);
  Object.assign(target, vars);
}

// ---- HTTP health check ----

/** Wait for an HTTP service to become available. Returns true if ready. */
export async function waitForService(
  url: string,
  timeoutSec = 30,
  intervalSec = 2,
): Promise<boolean> {
  const start = Date.now();
  const deadline = start + timeoutSec * 1000;
  while (Date.now() < deadline) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(url, { signal: controller.signal, redirect: 'manual' });
      clearTimeout(timer);
      if (resp.ok || resp.status === 301 || resp.status === 302) return true;
    } catch {
      // Connection refused or timeout — keep waiting
    }
    await new Promise((r) => setTimeout(r, intervalSec * 1000));
  }
  return false;
}

// ---- Package manager detection ----

export function detectPkgManager(): 'npm' | 'pnpm' | 'yarn' {
  if (existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (existsSync('yarn.lock')) return 'yarn';
  // Check frontend subdirs
  for (const dir of ['topseeker-frontend', 'frontend', 'client', 'web', 'app']) {
    if (existsSync(`${dir}/pnpm-lock.yaml`)) return 'pnpm';
    if (existsSync(`${dir}/yarn.lock`)) return 'yarn';
  }
  return 'npm';
}

// ---- Framework detection ----

const FRONTEND_CANDIDATES = ['topseeker-frontend', 'frontend', 'client', 'web', 'app'];

function detectInDir(dir: string): { framework: Framework; devCmd: string; buildCmd: string; testCmd: string; port: number; pkgManager: string } | null {
  const pm = detectPkgManager();
  if (existsSync(`${dir}/next.config.ts`) || existsSync(`${dir}/next.config.js`)) {
    return { framework: 'nextjs', devCmd: `${pm} dev`, buildCmd: `${pm} build`, testCmd: `${pm} test`, port: 3000, pkgManager: pm };
  }
  if (existsSync(`${dir}/vite.config.ts`) || existsSync(`${dir}/vite.config.js`)) {
    return { framework: 'vite', devCmd: `${pm} dev`, buildCmd: `${pm} build`, testCmd: `${pm} test`, port: 5173, pkgManager: pm };
  }
  if (existsSync(`${dir}/angular.json`)) {
    return { framework: 'angular', devCmd: `${pm} start`, buildCmd: `${pm} run build`, testCmd: `${pm} test`, port: 3000, pkgManager: pm };
  }
  if (existsSync(`${dir}/package.json`)) {
    return { framework: 'generic-node', devCmd: `${pm} dev`, buildCmd: `${pm} build`, testCmd: `${pm} test`, port: 3000, pkgManager: pm };
  }
  return null;
}

export function detectProject(): DetectedProject {
  let result = detectInDir('.');
  let frontendDir = '.';

  if (!result) {
    for (const dir of FRONTEND_CANDIDATES) {
      result = detectInDir(dir);
      if (result) {
        frontendDir = dir;
        break;
      }
    }
  }

  const pkgJson = existsSync(`${frontendDir}/package.json`) ? `${frontendDir}/package.json` : '';

  // Backend detection
  let backendDir = '';
  for (const dir of ['topseeker-backend', '../topseeker-backend', '../backend']) {
    if (!existsSync(dir)) continue;
    const hasPython =
      existsSync(`${dir}/main.py`) ||
      existsSync(`${dir}/app.py`) ||
      existsSync(`${dir}/pyproject.toml`) ||
      existsSync(`${dir}/requirements.txt`);
    if (hasPython) { backendDir = dir; break; }
  }

  return {
    framework: result?.framework ?? 'unknown',
    frontendDir,
    devCmd: result?.devCmd ?? '',
    buildCmd: result?.buildCmd ?? '',
    testCmd: result?.testCmd ?? '',
    port: result?.port ?? 3000,
    pkgManager: (result?.pkgManager ?? 'npm') as 'npm' | 'pnpm' | 'yarn',
    pkgJson,
    backendDir,
  };
}

// ---- Command execution helpers ----

/** Run a command, return { ok, stdout, stderr }. Never throws. */
export function run(cmd: string, cwd?: string): { ok: boolean; stdout: string; stderr: string } {
  try {
    const stdout = execSync(cmd, {
      cwd: cwd ?? process.cwd(),
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024,
    });
    return { ok: true, stdout, stderr: '' };
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string };
    return { ok: false, stdout: (err.stdout as string) ?? '', stderr: (err.stderr as string) ?? String(e) };
  }
}

/** Run a command and log output to a file, return ok */
export function runLogged(cmd: string, logFile: string, cwd?: string): boolean {
  const result = run(`${cmd} > ${logFile} 2>&1`, cwd);
  return result.ok;
}

/** Check if a package.json has a "test" script */
export function hasTestScript(pkgJsonPath: string): boolean {
  if (!existsSync(pkgJsonPath)) return false;
  try {
    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    return typeof pkg.scripts?.test === 'string';
  } catch {
    return false;
  }
}

// ---- Playwright detection ----

export function findPlaywrightDir(frontendDir: string): string | null {
  if (existsSync('playwright.config.ts') || existsSync('playwright.config.js')) return '.';
  if (frontendDir !== '.') {
    if (existsSync(`${frontendDir}/playwright.config.ts`) || existsSync(`${frontendDir}/playwright.config.js`)) {
      return frontendDir;
    }
  }
  return null;
}

// ---- Git helpers ----

/** Convert a title to a git-branch-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

/** Extract issue number from branch name (e.g. "feature/swarm-issue-42-slug" → 42) */
export function extractIssueFromBranch(branch: string): number | null {
  const match = branch.match(/issue-(\d+)/);
  return match ? parseInt(match[1]!, 10) : null;
}

/** Get current git branch name */
export function getCurrentBranch(): string {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

/** Walk up the directory tree looking for a .git directory */
function findGitDir(startDir: string): string | null {
  let current = resolve(startDir);
  for (let i = 0; i < 50; i++) {
    if (existsSync(join(current, '.git'))) return current;
    const parent = dirname(current);
    if (parent === current) break; // reached filesystem root
    current = parent;
  }
  return null;
}

/** Get the git repository root directory.
 *  First tries git rev-parse from CWD (fast path when invoked inside the repo).
 *  Falls back to walking up the tree to find .git, then retries from there.
 *  This handles invocations from outside the repo (e.g. npx --prefix). */
export function getRepoRoot(): string {
  // Fast path: CWD is inside the git repo
  try {
    return execSync('git rev-parse --show-toplevel', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // CWD is outside the repo — walk up to find .git, then retry
    const gitDir = findGitDir(process.cwd());
    if (gitDir) {
      try {
        return execSync('git rev-parse --show-toplevel', {
          cwd: gitDir,
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
      } catch {
        return gitDir; // .git found but rev-parse failed — use parent dir
      }
    }
    // No .git found anywhere — last resort
    return process.cwd();
  }
}

/** Check if the current repo has a GitHub remote */
export function hasGitHubRemote(): boolean {
  try {
    const remotes = execSync('git remote -v', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    return remotes.includes('github.com');
  } catch {
    return false;
  }
}

// ---- Playwright output parser ----

export interface PlaywrightResult {
  total: number;
  passed: number;
  failed: number;
  hasOutput: boolean;
}

/** Parse Playwright stdout to extract test counts */
export function parsePlaywrightOutput(stdout: string): PlaywrightResult {
  // "No tests found" — explicit zero
  if (/no tests found/i.test(stdout)) {
    return { total: 0, passed: 0, failed: 0, hasOutput: true };
  }

  const passedMatch = stdout.match(/(\d+)\s+passed/);
  const failedMatch = stdout.match(/(\d+)\s+failed/);

  const passed = passedMatch ? parseInt(passedMatch[1]!, 10) : 0;
  const failed = failedMatch ? parseInt(failedMatch[1]!, 10) : 0;

  if (passedMatch || failedMatch) {
    return { total: passed + failed, passed, failed, hasOutput: true };
  }

  return { total: 0, passed: 0, failed: 0, hasOutput: false };
}

// ---- Route-to-test cross-reference ----

/** Extract routes from page.tsx files changed vs base branch */
export function extractChangedRoutes(baseBranch = 'main'): string[] {
  try {
    const files = execSync(`git diff --name-only ${baseBranch}..HEAD`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 1024 * 1024,
    }).trim().split('\n').filter(Boolean);

    const routes: string[] = [];
    for (const file of files) {
      // Match src/app/<route>/page.tsx or src/app/page.tsx
      const match = file.match(/src\/app(\/.*?)?\/page\.tsx$/);
      if (match) {
        routes.push(match[1] || '/');
      }
    }
    return [...new Set(routes)];
  } catch {
    return [];
  }
}

/** Check which routes are covered by E2E test files */
export function checkRouteCoverage(
  routes: string[],
  e2eDir: string,
): { covered: string[]; uncovered: string[] } {
  const covered: string[] = [];
  const uncovered: string[] = [];

  if (!routes.length) return { covered, uncovered };
  if (!existsSync(e2eDir)) return { covered: [], uncovered: routes };

  const specFiles = readdirSync(e2eDir).filter((f) => f.endsWith('.spec.ts'));

  for (const route of routes) {
    let found = false;
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    for (const specFile of specFiles) {
      try {
        const content = readFileSync(join(e2eDir, specFile), 'utf-8');
        if (content.includes(route) || new RegExp(escaped + '(?![\\w-])').test(content)) {
          found = true;
          break;
        }
      } catch {
        // Can't read spec file — skip
      }
    }
    (found ? covered : uncovered).push(route);
  }

  return { covered, uncovered };
}

// ---- Test scoping helpers ----

const SOURCE_EXTENSIONS = /\.(ts|tsx|py|go|rs|java|rb)$/;
const TEST_PATTERNS = /\.(test|spec)\.(ts|tsx|py|go|rs|java|rb)$/;
const SKIP_PATTERNS = /\.(css|scss|less|svg|png|jpg|json|md|yaml|yml|env)$/;

/** Get source files changed vs base branch (excludes tests, config, assets) */
export function getChangedSourceFiles(baseBranch = 'main'): string[] {
  try {
    const files = execSync(`git diff --name-only ${baseBranch}..HEAD`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 1024 * 1024,
    }).trim().split('\n').filter(Boolean);

    return files.filter((f) => {
      if (!SOURCE_EXTENSIONS.test(f)) return false;
      if (SKIP_PATTERNS.test(f)) return false;
      return true;
    });
  } catch {
    return [];
  }
}

/** Build a Playwright --grep pattern from a list of route paths */
export function buildE2eGrepFromRoutes(routes: string[]): string {
  if (!routes.length) return '';

  const slugs = routes.map((route) => {
    if (route === '/') return 'home';
    // Remove leading/trailing slashes, split by /
    const parts = route.replace(/^\/|\/$/g, '').split('/');
    // Each part becomes a regex-safe word; use .* to allow separator flexibility
    return parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  });

  return slugs.join('|');
}

// ---- Test runner detection ----

export type TestRunner = 'vitest' | 'jest' | 'pytest' | 'unknown';

/** Detect which test runner is used in the project */
export function detectTestRunner(frontendDir = '.'): TestRunner {
  // Vitest
  if (existsSync(`${frontendDir}/vitest.config.ts`) || existsSync(`${frontendDir}/vitest.config.js`)) {
    return 'vitest';
  }
  // Jest
  if (existsSync(`${frontendDir}/jest.config.ts`) || existsSync(`${frontendDir}/jest.config.js`) ||
      existsSync(`${frontendDir}/jest.config.mjs`) || existsSync(`${frontendDir}/jest.config.cjs`)) {
    return 'jest';
  }
  // Check package.json for vitest/jest dependency
  try {
    const pkgPath = `${frontendDir}/package.json`;
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const deps = { ...pkg.devDependencies, ...pkg.dependencies };
      if (deps.vitest) return 'vitest';
      if (deps.jest) return 'jest';
    }
  } catch { /* ignore */ }
  // Pytest (backends with Python)
  if (existsSync(`${frontendDir}/pyproject.toml`) || existsSync(`${frontendDir}/pytest.ini`) ||
      existsSync(`${frontendDir}/setup.cfg`)) {
    return 'pytest';
  }
  return 'unknown';
}

// ---- Test file resolution ----

/**
 * Map changed source files to their likely test files.
 * Covers: __tests__/<name>.test.ts, <name>.test.ts, <name>.spec.ts (and .tsx variants)
 */
export function resolveTestFiles(changedSources: string[], frontendDir = '.'): string[] {
  const testFiles: string[] = [];

  for (const source of changedSources) {
    // Strip extension and directory
    const base = source.replace(/\.[^.]+$/, ''); // src/modules/auth
    const dir = base.substring(0, base.lastIndexOf('/')); // src/modules
    const name = base.substring(base.lastIndexOf('/') + 1); // auth

    // Possible test file locations (ordered by priority)
    const candidates = [
      `${dir}/__tests__/${name}.test.ts`,
      `${dir}/__tests__/${name}.test.tsx`,
      `${dir}/__tests__/${name}.spec.ts`,
      `${dir}/__tests__/${name}.spec.tsx`,
      `${dir}/${name}.test.ts`,
      `${dir}/${name}.test.tsx`,
      `${dir}/${name}.spec.ts`,
      `${dir}/${name}.spec.tsx`,
      // Next.js convention
      `${dir}/__tests__/${name}.test.ts`,
      // Python convention
      `${dir}/test_${name}.py`,
      `${dir}/${name}_test.py`,
    ];

    let found = false;
    for (const candidate of candidates) {
      const fullPath = frontendDir === '.' ? candidate : `${frontendDir}/${candidate}`;
      if (existsSync(fullPath)) {
        testFiles.push(fullPath);
        found = true;
        break; // First match wins
      }
    }

    // Fallback for Python: app/ and tests/ are sibling directories
    // Standard layout: app/services/foo.py → tests/services/test_foo.py
    // Flattened layout: app/api/endpoints/bar.py → tests/api/test_bar_*.py
    if (!found && source.endsWith('.py')) {
      // Strategy 1: replace app/ with tests/ at the same directory level
      const testsDir = dir.replace(/\/app\//, '/tests/');
      if (testsDir !== dir) {
        const testCandidates = [
          `${testsDir}/test_${name}.py`,
          `${testsDir}/${name}_test.py`,
        ];
        for (const tc of testCandidates) {
          const fullPath = frontendDir === '.' ? tc : `${frontendDir}/${tc}`;
          if (existsSync(fullPath)) {
            testFiles.push(fullPath);
            found = true;
            break;
          }
        }
        // Strategy 2: if not found, walk up one level + prefix match
        // e.g. app/api/endpoints/cover_letters.py → tests/api/test_cover_letters_*.py
        if (!found) {
          const parentTestsDir = testsDir.substring(0, testsDir.lastIndexOf('/'));
          try {
            const contents = existsSync(parentTestsDir) ? readdirSync(parentTestsDir) : [];
            const prefixMatch = contents.find(
              (f: string) => f.startsWith(`test_${name}`) || f.startsWith(`${name}_test`)
            );
            if (prefixMatch) {
              const fullPath = frontendDir === '.' 
                ? `${parentTestsDir}/${prefixMatch}` 
                : `${frontendDir}/${parentTestsDir}/${prefixMatch}`;
              if (existsSync(fullPath)) {
                testFiles.push(fullPath);
                found = true;
              }
            }
          } catch { /* ignore */ }
        }
      }
    }
  }

  return [...new Set(testFiles)];
}

// ---- Test output parsers ----

export interface TestOutputResult {
  total: number;
  passed: number;
  failed: number;
  hasOutput: boolean;
}

/** Parse vitest/jest output to extract test counts */
export function parseUnitTestOutput(stdout: string): TestOutputResult {
  if (!stdout.trim()) return { total: 0, passed: 0, failed: 0, hasOutput: false };

  // Vitest pattern: "Tests  3 passed (3)" or "Tests  1 failed | 2 passed (3)"
  const vitestMatch = stdout.match(/Tests\s+(\d+)\s+failed\s*\|\s*(\d+)\s+passed\s*\((\d+)\)/);
  if (vitestMatch) {
    return {
      total: parseInt(vitestMatch[3]!, 10),
      passed: parseInt(vitestMatch[2]!, 10),
      failed: parseInt(vitestMatch[1]!, 10),
      hasOutput: true,
    };
  }

  const vitestSimple = stdout.match(/Tests\s+(\d+)\s+passed\s*\((\d+)\)/);
  if (vitestSimple) {
    return {
      total: parseInt(vitestSimple[2]!, 10),
      passed: parseInt(vitestSimple[1]!, 10),
      failed: 0,
      hasOutput: true,
    };
  }

  // Jest pattern: "Tests: 3 passed, 3 total"
  const jestMatch = stdout.match(/Tests?:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/);
  if (jestMatch) {
    return {
      total: parseInt(jestMatch[3]!, 10),
      passed: parseInt(jestMatch[2]!, 10),
      failed: parseInt(jestMatch[1]!, 10),
      hasOutput: true,
    };
  }

  // Jest simple: "Tests: 3 passed, 3 total"
  const jestSimple = stdout.match(/Tests?:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
  if (jestSimple) {
    return {
      total: parseInt(jestSimple[2]!, 10),
      passed: parseInt(jestSimple[1]!, 10),
      failed: 0,
      hasOutput: true,
    };
  }

  // Pytest: "3 passed, 1 failed" or "4 passed"
  const pytestMatch = stdout.match(/(\d+)\s+passed/);
  const pytestFailed = stdout.match(/(\d+)\s+failed/);
  if (pytestMatch) {
    const passed = parseInt(pytestMatch[1]!, 10);
    const failed = pytestFailed ? parseInt(pytestFailed[1]!, 10) : 0;
    return { total: passed + failed, passed, failed, hasOutput: true };
  }

  // "No tests found" or "no test files"
  if (/no tests? found/i.test(stdout) || /no test files/i.test(stdout)) {
    return { total: 0, passed: 0, failed: 0, hasOutput: true };
  }

  return { total: 0, passed: 0, failed: 0, hasOutput: false };
}

// Log file paths for external use
export const LOGS = {
  BUILD_LOG,
  TEST_LOG,
  E2E_LOG,
  MOCK_LOG,
  BACKEND_LOG,
  DEVSERVER_LOG,
  REPORT_FILE,
};
