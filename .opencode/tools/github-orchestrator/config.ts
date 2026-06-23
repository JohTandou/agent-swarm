// ---------------------------------------------------------------------------
// config.ts — Typed reader for swarm-workflow.json
// Replaces the bash helpers read_bool() / read_str() + jq
// ---------------------------------------------------------------------------

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { SwarmConfig, SwarmTestingConfig, SwarmWorkflowConfig } from './types.js';

const CONFIG_PATH = join(homedir(), '.opencode', 'swarm-workflow.json');

// Cached config — read once
let _config: SwarmConfig | null = null;

function loadConfig(): SwarmConfig {
  if (_config) return _config;
  try {
    const raw = readFileSync(CONFIG_PATH, 'utf-8');
    _config = JSON.parse(raw) as SwarmConfig;
    return _config!;
  } catch {
    // Return safe defaults if file missing or invalid
    _config = defaultConfig();
    return _config;
  }
}

function defaultConfig(): SwarmConfig {
  return {
    swarm: {
      workflow: defaultWorkflow(),
      github: { default_base_branch: 'main', branch_prefix: 'feature/swarm-' },
      testing: defaultTesting(),
    },
  };
}

function defaultWorkflow(): SwarmWorkflowConfig {
  return {
    auto_create_github_issue: true,
    auto_create_branch: true,
    auto_run_local_tests: true,
    auto_create_pr: true,
    pr_draft_by_default: true,
    cleanup_processes_after_run: true,
    auto_decompose_tasks: true,
    max_tasks_per_session: 5,
  };
}

function defaultTesting(): SwarmTestingConfig {
  return {
    mock_setup_command: '',
    mock_teardown_command: '',
    e2e_backend_env_file: '',
    e2e_grep_pattern: '',
    e2e_max_retries: 2,
    e2e_timeout_minutes: 15,
    block_on_e2e_failure: true,
    coverage_threshold: 80,
    coverage_enforce: true,
    e2e_interactive_mode: true,
    a11y_enabled: false,
    a11y_tags: 'wcag2a,wcag2aa,wcag21a,wcag21aa',
    test_scope: 'changed-only',
    e2e_auto_grep_from_diff: true,
  };
}

// ---- Public API ----

export function getWorkflow(): SwarmWorkflowConfig {
  return loadConfig().swarm.workflow;
}

export function getGithub() {
  return loadConfig().swarm.github;
}

export function getTesting(): SwarmTestingConfig {
  return loadConfig().swarm.testing;
}

/** Generic getter with dot-path notation (e.g. "swarm.testing.e2e_max_retries") */
export function get<T = string>(path: string, defaultValue: T): T {
  const cfg = loadConfig() as unknown as Record<string, unknown>;
  const keys = path.split('.');
  let current: unknown = cfg;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return defaultValue;
    current = (current as Record<string, unknown>)[key];
  }
  return (current !== undefined && current !== null ? current : defaultValue) as T;
}

/** Shorthand for boolean config values (defaults to true if missing) */
export function getBool(path: string, defaultValue = true): boolean {
  return get<boolean>(path, defaultValue);
}

/** Shorthand for string config values */
export function getStr(path: string, defaultValue = ''): string {
  return get<string>(path, defaultValue);
}

/** Shorthand for number config values */
export function getNum(path: string, defaultValue = 0): number {
  return get<number>(path, defaultValue);
}
