#!/usr/bin/env tsx
// ---------------------------------------------------------------------------
// detect-stack.ts — Typed replacement for detect-stack.sh
//
// Pipeline : mock-setup → build → backend-start → E2E (dev-server + playwright + retry) → cleanup
//
// Usage :    npx tsx detect-stack.ts
//            (run from the project root)
//
// Exit code : 0 = all passed, 1 = some checks failed
// ---------------------------------------------------------------------------

import { spawn, type ChildProcess } from 'node:child_process';
import { createWriteStream, existsSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import {
  initReport,
  logStep,
  readReport,
  finalizeReport,
  detectProject,
  findPlaywrightDir,
  runLogged,
  run,
  loadEnvFile,
  waitForService,
  parsePlaywrightOutput,
  parseUnitTestOutput,
  getChangedSourceFiles,
  resolveTestFiles,
  extractChangedRoutes,
  buildE2eGrepFromRoutes,
  type PlaywrightResult,
  LOGS,
} from './utils.js';
import { getTesting, getStr } from './config.js';

// ---- State ----
const testing = getTesting();
const project = detectProject();
let failed = false;
let interactive = false;

// Process handles for cleanup
let devPid: ChildProcess | null = null;
let backendPid: ChildProcess | null = null;

// ---- Helpers ----

function killProcess(proc: ChildProcess | null): void {
  if (!proc) return;
  try { proc.kill('SIGTERM'); } catch { /* already dead */ }
}

function killAll(pattern: string): void {
  // Equivalent to pkill -f <pattern>
  try {
    spawn('pkill', ['-f', pattern], { stdio: 'ignore', detached: true });
  } catch { /* ignore */ }
}

function readLogTail(logFile: string, lines = 30): string {
  if (!existsSync(logFile)) return '';
  const content = readFileSync(logFile, 'utf-8');
  const all = content.split('\n');
  return all.slice(-lines).join('\n');
}

// ---- Pipeline steps ----

async function stepMockSetup(): Promise<void> {
  const cmd = testing.mock_setup_command;
  if (cmd) {
    const ok = runLogged(cmd, LOGS.MOCK_LOG);
    logStep('mock-setup', ok ? 'pass' : 'fail', ok ? 'Custom mock setup command' : readLogTail(LOGS.MOCK_LOG));
    if (!ok) failed = true;
  } else if (existsSync('scripts/swarm-test-setup.sh')) {
    const ok = runLogged('bash scripts/swarm-test-setup.sh', LOGS.MOCK_LOG);
    logStep('mock-setup', ok ? 'pass' : 'fail', ok ? 'scripts/swarm-test-setup.sh' : readLogTail(LOGS.MOCK_LOG));
    if (!ok) failed = true;
  } else if (existsSync('docker-compose.test.yml')) {
    const ok = runLogged('docker-compose -f docker-compose.test.yml up -d', LOGS.MOCK_LOG);
    logStep('mock-setup', ok ? 'pass' : 'fail', ok ? 'docker-compose.test.yml' : readLogTail(LOGS.MOCK_LOG));
    if (!ok) failed = true;
  } else {
    logStep('mock-setup', 'skip', 'No mock setup found');
  }
}

async function stepBuild(): Promise<void> {
  if (!project.buildCmd) {
    logStep('build', 'skip', 'No build command detected');
    return;
  }
  const ok = runLogged(project.buildCmd, LOGS.BUILD_LOG, project.frontendDir);
  logStep('build', ok ? 'pass' : 'fail', ok ? '' : readLogTail(LOGS.BUILD_LOG));
  if (!ok) failed = true;
}

async function stepUnitTests(): Promise<void> {
  if (!project.testCmd) {
    logStep('unit-tests', 'skip', 'No test command detected');
    return;
  }

  const scope = testing.test_scope || 'full';
  const frontendDir = project.frontendDir;
  let cmd = project.testCmd;

  if (scope === 'changed-only' && project.framework !== 'angular') {
    cmd = `${project.testCmd} -- --changed --changedBranch=main`;
    console.log('[detect-stack] Scoping unit tests to changed files (vs main)');
  } else {
    console.log('[detect-stack] Running full test suite (test_scope=full)');
  }

  if (scope === 'changed-only' && project.framework === 'angular') {
    console.log('[detect-stack] Angular detected — running full test suite (--changed not supported by Karma)');
  }

  console.log(`[detect-stack] Unit test command: ${cmd}`);
  
  const result = run(cmd, frontendDir);
  const combined = result.stdout + result.stderr;
  const parsed = parseUnitTestOutput(combined);

  if (result.ok && parsed.failed === 0) {
    const info = parsed.hasOutput
      ? `${parsed.total} tests (${parsed.passed} passed, ${parsed.failed} failed)`
      : 'passed';
    logStep('unit-tests', 'pass', info);
  } else {
    const detail = parsed.hasOutput
      ? `${parsed.passed}/${parsed.total} passed, ${parsed.failed} failed`
      : result.stderr.substring(0, 500) || 'unknown error';
    logStep('unit-tests', 'fail', detail);
    failed = true;
  }
}

async function stepBackendStart(): Promise<void> {
  if (!project.backendDir) {
    logStep('backend-start', 'skip', 'No backend directory detected');
    return;
  }

  const bd = project.backendDir;

  // Docker path
  if (existsSync(`${bd}/docker-compose.yml`)) {
    const ok = runLogged(`cd ${bd} && docker-compose up -d backend`, LOGS.BACKEND_LOG);
    if (!ok) {
      logStep('backend-start', 'fail', readLogTail(LOGS.BACKEND_LOG));
      failed = true;
      return;
    }
    const ready = await waitForService('http://localhost:8000', 60, 3);
    if (ready) {
      process.env.BACKEND_URL = 'http://localhost:8000';
      logStep('backend-start', 'pass', 'docker-compose');
    } else {
      logStep('backend-start', 'warn', 'Backend timeout after 60s');
    }
    return;
  }

  // Python/uvicorn path
  const hasPython =
    existsSync(`${bd}/main.py`) ||
    existsSync(`${bd}/app.py`) ||
    existsSync(`${bd}/app/main.py`);

  if (!hasPython) {
    logStep('backend-start', 'skip', 'No Python entry point found');
    return;
  }

  const envFile = existsSync(`${bd}/.env.e2e`)
    ? `${bd}/.env.e2e`
    : `${bd}/.env`;

  if (!existsSync(envFile)) {
    logStep('backend-start', 'skip', 'No .env file');
    return;
  }

  // Load env file
  const envVars = { ...process.env } as Record<string, string>;
  loadEnvFile(envFile, envVars);

  let uvicornCmd = '';
  if (existsSync(`${bd}/app/main.py`)) {
    uvicornCmd = `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000`;
  } else if (existsSync(`${bd}/main.py`)) {
    uvicornCmd = `python -m uvicorn main:app --host 127.0.0.1 --port 8000`;
  } else if (existsSync(`${bd}/app.py`)) {
    uvicornCmd = `python -m uvicorn app:app --host 127.0.0.1 --port 8000`;
  }

  if (!uvicornCmd) {
    logStep('backend-start', 'skip', 'Could not determine uvicorn entry point');
    return;
  }

  // Spawn backend (detached — survives parent death)
  const backendLogFd = openSync(LOGS.BACKEND_LOG, 'w');
  const [bin, ...args] = uvicornCmd.split(' ');
  backendPid = spawn(bin!, args, {
    cwd: bd,
    env: envVars,
    stdio: ['ignore', backendLogFd, backendLogFd],
    detached: true,
  });
  backendPid.unref();

  const ready = await waitForService('http://localhost:8000', 60, 3);
  if (ready) {
    process.env.BACKEND_URL = 'http://localhost:8000';
    logStep('backend-start', 'pass', `uvicorn: ${uvicornCmd}`);
  } else {
    logStep('backend-start', 'warn', 'Backend timeout after 60s (HTTP not ready)');
    killProcess(backendPid);
    backendPid = null;
  }
}

async function stepBackendUnitTests(): Promise<void> {
  const bd = project.backendDir;
  if (!bd) {
    logStep('backend-unit-tests', 'skip', 'No backend directory detected');
    return;
  }

  // Check if pytest is available
  const hasPytest = existsSync(`${bd}/pyproject.toml`) || existsSync(`${bd}/pytest.ini`) || existsSync(`${bd}/setup.cfg`);
  if (!hasPytest) {
    logStep('backend-unit-tests', 'skip', 'No pytest config found');
    return;
  }

  const scope = testing.test_scope || 'full';
  const changedSources = getChangedSourceFiles('main');
  const pySources = changedSources.filter((f) => f.endsWith('.py') && f.startsWith(bd));
  
  if (pySources.length === 0 && scope === 'changed-only') {
    logStep('backend-unit-tests', 'skip', 'No Python source files changed');
    return;
  }

  let cmd: string;
  
  if (scope === 'changed-only' && pySources.length > 0) {
    const testFiles = resolveTestFiles(pySources, '.');
    // Filter to only files that actually exist
    const existing = testFiles.filter((f) => existsSync(f));
    
    if (existing.length > 0) {
      cmd = `cd ${bd} && python -m pytest ${existing.map((f) => f.replace(`${bd}/`, '')).join(' ')} -v --tb=short`;
      console.log(`[detect-stack] Scoping backend tests to ${existing.length} test file(s)`);
    } else {
      // Safety net: heuristic couldn't map, run full suite
      console.log('[detect-stack] Could not map changed sources to test files — running full backend suite');
      cmd = `cd ${bd} && python -m pytest tests/ -v --tb=short`;
    }
  } else {
    console.log('[detect-stack] Running full backend test suite');
    cmd = `cd ${bd} && python -m pytest tests/ -v --tb=short`;
  }

  console.log(`[detect-stack] Backend test command: ${cmd}`);
  
  const result = run(cmd);
  const parsed = parseUnitTestOutput(result.stdout + result.stderr);

  if (result.ok && parsed.failed === 0) {
    const info = parsed.hasOutput
      ? `${parsed.total} tests (${parsed.passed} passed, ${parsed.failed} failed)`
      : 'passed';
    logStep('backend-unit-tests', 'pass', info);
  } else {
    const detail = parsed.hasOutput
      ? `${parsed.passed}/${parsed.total} passed, ${parsed.failed} failed`
      : (result.stderr || result.stdout).substring(0, 500) || 'unknown error';
    logStep('backend-unit-tests', 'fail', detail);
    failed = true;
  }
}

async function stepE2E(): Promise<void> {
  const pwDir = findPlaywrightDir(project.frontendDir);
  if (!pwDir) {
    logStep('e2e', 'skip', 'No Playwright config found');
    return;
  }

  // Use the configured E2E frontend command if set, otherwise fall back to detected dev command
  const devCmd = testing.e2e_frontend_command || project.devCmd;
  const devUrl = testing.e2e_frontend_url || `http://localhost:${project.port}`;
  
  if (!devCmd) {
    logStep('e2e', 'skip', 'No dev command detected');
    return;
  }

  // Start dev server
  console.log(`[detect-stack] Starting dev server: ${devCmd}`);

  const devLogFd = openSync(LOGS.DEVSERVER_LOG, 'w');
  const [bin, ...args] = devCmd.split(' ');
  devPid = spawn(bin!, args, {
    cwd: project.frontendDir,
    stdio: ['ignore', devLogFd, devLogFd],
    detached: true,
  });
  devPid.unref();

  const ready = await waitForService(devUrl, 60, 3);

  if (!ready) {
      logStep('e2e', 'skip', `Dev server timeout after 60s (${devUrl})`);
      if (!interactive) {
        killProcess(devPid);
        devPid = null;
      }
      return;
  }

  // Build E2E command
  let e2eCmd = 'npx playwright test';
  let grepPattern = '';

  if (testing.e2e_auto_grep_from_diff) {
    const changedRoutes = extractChangedRoutes('main');
    if (changedRoutes.length > 0) {
      grepPattern = buildE2eGrepFromRoutes(changedRoutes);
      console.log(`[detect-stack] Auto-grep from ${changedRoutes.length} changed route(s): "${grepPattern}"`);
    } else {
      // No page.tsx routes changed — check if any TS/TSX components changed
      const changedSources = getChangedSourceFiles('main');
      const hasTsxChanges = changedSources.some(
        (f) => f.endsWith('.tsx') || f.endsWith('.ts')
      );
      if (hasTsxChanges) {
        // Run smoke test as minimum safety net
        grepPattern = 'smoke';
        console.log('[detect-stack] No routes changed but TS/TSX files modified — running smoke E2E');
      } else {
          logStep('e2e', 'skip', 'No frontend files changed (server left running for interactive testing)');
          if (!interactive) {
            killProcess(devPid);
            devPid = null;
          }
          return;
      }
    }
  }

  if (!grepPattern) {
    grepPattern = getStr('swarm.testing.e2e_grep_pattern', '');
  }

  if (grepPattern) {
    e2eCmd = `npx playwright test --grep "${grepPattern}"`;
  }
  console.log(`[detect-stack] E2E command: ${e2eCmd} (max retries: ${testing.e2e_max_retries})`);

  // Retry loop
  let e2ePass = false;
  let lastStdout = '';
  let attempt = 0;
  let pwResult: PlaywrightResult = { total: 0, passed: 0, failed: 0, hasOutput: false };

  while (attempt < testing.e2e_max_retries) {
    attempt++;
    console.log(`[detect-stack] E2E attempt ${attempt}/${testing.e2e_max_retries}...`);
    const result = run(e2eCmd, pwDir);
    lastStdout = result.stdout;

    if (result.ok) {
      e2ePass = true;
      pwResult = parsePlaywrightOutput(result.stdout);
      break;
    }
    // Parse even failed output to check if any tests ran
    if (!pwResult.hasOutput) {
      pwResult = parsePlaywrightOutput(result.stdout);
    }
    // Save failure output
    writeFileSync(LOGS.E2E_LOG, result.stdout + '\n' + result.stderr);
    console.log(`[detect-stack] E2E attempt ${attempt} failed.`);
  }

  // Build detail string
  const suiteName = grepPattern || 'all';
  const countInfo = pwResult.hasOutput
    ? `${pwResult.total} tests (${pwResult.passed} passed, ${pwResult.failed} failed)`
    : 'unknown count';

  if (e2ePass) {
    // Zero-test detection: tests "passed" but nothing actually ran
    if (pwResult.hasOutput && pwResult.total === 0) {
      console.warn('[detect-stack] ⚠️  E2E passed but 0 tests were executed! Possible grep mismatch or empty suite.');
      logStep('e2e', 'warn', `Suite: ${suiteName} — 0 tests executed (attempt ${attempt}/${testing.e2e_max_retries})`);
      // Treat as failure if block_on_e2e_failure is enabled
      if (testing.block_on_e2e_failure) {
        failed = true;
      }
    } else {
      logStep('e2e', 'pass', `Suite: ${suiteName} — ${countInfo} (attempt ${attempt}/${testing.e2e_max_retries})`);
    }
  } else if (pwResult.hasOutput && pwResult.total === 0) {
    // No E2E tests matched the grep — not a real failure
    logStep('e2e', 'warn', `Suite: ${suiteName} — 0 tests matched the grep pattern`);
  } else {
    const detail = pwResult.total > 0
      ? `${countInfo} (attempt ${attempt}/${testing.e2e_max_retries})`
      : readLogTail(LOGS.E2E_LOG, 50);
    logStep('e2e', 'fail', detail);
    failed = true;
  }

  // Kill dev server (skip in interactive mode)
  if (!interactive) {
    killProcess(devPid);
    devPid = null;
  }
}

function cleanup(): void {
  if (interactive) {
    console.log('[detect-stack] Interactive mode: servers left running');
    console.log(`  Frontend: http://localhost:${project.port}`);
    console.log('  Backend:  http://localhost:8000');
    console.log('  Close browser and Ctrl+C when done.');
    return;
  }
  killProcess(devPid);
  killProcess(backendPid);
  killAll('next dev');
  killAll('vite');
}

// ---- Public API (callable from finish.ts) ----

/** Run the full test pipeline. Returns true if all checks passed. */
export async function runDetectStack(opts?: { interactive?: boolean }): Promise<boolean> {
  if (opts?.interactive) interactive = true;
  console.log('[detect-stack] Starting test pipeline...');
  console.log(`[detect-stack] Framework: ${project.framework}, Dir: ${project.frontendDir}, PM: ${project.pkgManager}`);

  initReport();

  await stepMockSetup();
  await stepBuild();
  await stepUnitTests();
  await stepBackendStart();
  await stepBackendUnitTests();
  await stepE2E();

  cleanup();

  const report = readReport();
  const emoji: Record<string, string> = { pass: '✅', fail: '❌', skip: '⏭️', warn: '⚠️' };
  const stepLine = report.steps
    .map((s) => `${s.name}:${emoji[s.status] || '❓'}`)
    .join(' | ');
  console.log(`[detect-stack] Pipeline: ${stepLine}`);

  if (failed) {
    console.log('[detect-stack] RESULT: FAIL');
    finalizeReport('fail');
    return false;
  }
  console.log('[detect-stack] RESULT: PASS');
  finalizeReport('pass');
  return true;
}

// ---- CLI entry point (when called directly via npx tsx) ----

const isMain = process.argv[1]?.endsWith('detect-stack.ts') || process.argv[1]?.endsWith('detect-stack.js');
if (isMain) {
  runDetectStack().then((ok) => {
    process.exit(ok ? 0 : 1);
  }).catch((err) => {
    console.error('[detect-stack] Fatal error:', err);
    cleanup();
    finalizeReport('fail');
    process.exit(1);
  });
}
