// ---------------------------------------------------------------------------
// types.ts — Interfaces for the Swarm GitHub Orchestrator tools
// ---------------------------------------------------------------------------

/** A single step in the test report */
export interface TestStep {
  name: string;
  status: 'pass' | 'fail' | 'skip' | 'warn';
  detail: string;
}

/** Full test report written to .orchestrator-report.json */
export interface TestReport {
  steps: TestStep[];
  overall: 'running' | 'pass' | 'fail';
}

/** Detected frontend framework */
export type Framework = 'nextjs' | 'vite' | 'angular' | 'generic-node' | 'unknown';

/** Detected project structure */
export interface DetectedProject {
  framework: Framework;
  frontendDir: string;
  devCmd: string;
  buildCmd: string;
  testCmd: string;
  port: number;
  pkgManager: 'npm' | 'pnpm' | 'yarn';
  pkgJson: string;
  backendDir: string;
}

/** Testing section of swarm-workflow.json */
export interface SwarmTestingConfig {
  mock_setup_command: string;
  mock_teardown_command: string;
  e2e_backend_env_file: string;
  e2e_grep_pattern: string;
  e2e_max_retries: number;
  e2e_timeout_minutes: number;
  block_on_e2e_failure: boolean;
  coverage_threshold: number;
  coverage_enforce: boolean;
  e2e_interactive_mode?: boolean;
  a11y_enabled: boolean;
  a11y_tags: string;
  /** "changed-only" = only tests related to git diff, "full" = entire suite */
  test_scope: 'changed-only' | 'full';
  /** Auto-build --grep pattern from changed routes (overrides e2e_grep_pattern) */
  e2e_auto_grep_from_diff: boolean;
  /** Command to start the frontend dev server for E2E tests (falls back to detected project.devCmd) */
  e2e_frontend_command?: string;
  /** URL the dev server serves on (falls back to http://localhost:{project.port}) */
  e2e_frontend_url?: string;
}

/** Workflow section of swarm-workflow.json */
export interface SwarmWorkflowConfig {
  auto_create_github_issue: boolean;
  auto_create_branch: boolean;
  auto_run_local_tests: boolean;
  auto_create_pr: boolean;
  pr_draft_by_default: boolean;
  cleanup_processes_after_run: boolean;
  auto_decompose_tasks: boolean;
  max_tasks_per_session: number;
}

/** Root shape of swarm-workflow.json */
export interface SwarmConfig {
  swarm: {
    workflow: SwarmWorkflowConfig;
    github: {
      default_base_branch: string;
      branch_prefix: string;
    };
    testing: SwarmTestingConfig;
  };
}

// ---- Tool result types ----

/** Returned by setup.ts */
export interface SetupResult {
  issue: number | null;
  branch: string | null;
  base_branch: string;
}

/** Returned by finish.ts */
export interface FinishResult {
  pr: number | null;
  branch: string;
  tests: 'pass' | 'fail' | 'skipped';
  coverage: number | null;
}

/** Returned by merge.ts */
export interface MergeResult {
  merged: boolean;
  pr_number: number | null;
  branch_deleted_local: boolean;
  branch_deleted_remote: boolean;
  issue_closed: boolean;
}
