#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="mcp-playwright"
LOG_FILE="/tmp/${SCRIPT_NAME}.log"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log() {
    echo "[$(date -Iseconds)] $*" >> "$LOG_FILE"
}

error_exit() {
    local msg="$1"
    local code="${2:-1}"
    log "ERROR: $msg"
    printf '{"status": "error", "message": "%s", "exit_code": %d}\n' "$msg" "$code"
    exit "$code"
}

# ---------------------------------------------------------------------------
# Service helpers
# ---------------------------------------------------------------------------
wait_for_service() {
    local url="$1"
    local timeout="${2:-10}"
    local interval="${3:-1}"
    local elapsed=0
    while [ "$elapsed" -lt "$timeout" ]; do
        local code
        code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
        if [ "$code" = "200" ] || [ "$code" = "301" ] || [ "$code" = "302" ]; then
            echo "ok"
            return 0
        fi
        sleep "$interval"
        elapsed=$((elapsed + interval))
    done
    echo "timeout"
    return 1
}

ensure_service() {
    local name="$1"
    local url="$2"
    local status
    status=$(wait_for_service "$url" 8 1)
    if [ "$status" = "ok" ]; then
        log "$name is up at $url"
        return 0
    fi
    log "$name not responding at $url"
    return 1
}

load_env_file() {
    local file="$1"
    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$line" ]] && continue
        if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
            export "${BASH_REMATCH[1]}"="${BASH_REMATCH[2]}"
        fi
    done < "$file"
}

# ---------------------------------------------------------------------------
# Prereqs
# ---------------------------------------------------------------------------
if ! command -v npx >/dev/null 2>&1; then
    error_exit "npx is not available. Install Node.js / npm." 127
fi

if ! npx playwright --version >/dev/null 2>&1; then
    error_exit "Playwright is not installed. Install via: npm install -D @playwright/test" 127
fi

if [[ ! -f "playwright.config.ts" && ! -f "playwright.config.js" ]]; then
    log "WARNING: No playwright.config.ts/js found in current directory."
fi

# ---------------------------------------------------------------------------
# Args
# ---------------------------------------------------------------------------
ACTION=""
TEST_PATH=""

E2E_MODE=false
EXTRA_ARGS=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        --run)
            ACTION="run"
            TEST_PATH="${2:-}"
            shift 2
            ;;
        --ui)
            ACTION="ui"
            shift
            ;;
        --debug)
            ACTION="debug"
            shift
            ;;
        --report)
            ACTION="report"
            shift
            ;;
        --e2e)
            E2E_MODE=true
            shift
            ;;
        --help|-h)
            cat <<'EOF'
Usage: mcp-playwright.sh [--run <path> | --ui | --debug | --report] [--e2e] [PLAYWRIGHT_FLAGS]

Options:
  --run <path>   Run tests at the given path (default: all tests)
  --ui           Open Playwright UI mode
  --debug        Run tests in debug mode
  --report       Show the last HTML report
  --e2e          Enable E2E prod-DB mode (checks .env.e2e, injects ENV=e2e)
  --help         Show this help

Playwright flags (passed through to npx playwright test):
  --project=<name>   Run tests only for the given project
  --grep=<pattern>   Run tests matching the given grep pattern
  --reporter=<name>  Use a custom reporter (disables JSON parsing)
  ...and any other Playwright CLI flag

Returns JSON.
EOF
            exit 0
            ;;
        --*)
            if [[ "$1" == *=* ]]; then
                EXTRA_ARGS+=("$1")
                shift
            else
                if [[ -n "${2:-}" && "$2" != --* ]]; then
                    EXTRA_ARGS+=("$1" "$2")
                    shift 2
                else
                    EXTRA_ARGS+=("$1")
                    shift
                fi
            fi
            ;;
        *)
            error_exit "Unknown argument: $1" 2
            ;;
    esac
done

if [[ -z "$ACTION" ]]; then
    error_exit "No action specified. Use --run, --ui, --debug, or --report." 2
fi

log "action=$ACTION test_path='$TEST_PATH' pwd=$(pwd)"

# ---------------------------------------------------------------------------
# Action dispatch
# ---------------------------------------------------------------------------
case "$ACTION" in
    run)
        TEST_ARG="${TEST_PATH:-}"
        log "Running Playwright tests: ${TEST_ARG:-(all)} e2e=$E2E_MODE extra_args=${EXTRA_ARGS[*]}"

        if [[ "$E2E_MODE" == "true" ]]; then
            ENV_FILE="topseeker-backend/.env.e2e"
            if [[ ! -f "$ENV_FILE" ]]; then
                error_exit "E2E mode requested but $ENV_FILE not found. Create it first." 1
            fi
            load_env_file "$ENV_FILE"
            export ENV=e2e
            log "E2E mode active: ENV=e2e, loaded $ENV_FILE"
        fi

        # Ensure backend is up
        if ! ensure_service "backend" "http://localhost:8000"; then
            error_exit "Backend not available at http://localhost:8000. Start it first (e.g. bash ~/.opencode/scripts/github-orchestrator/detect-stack.sh)." 1
        fi

        # Ensure frontend dev server is up
        if ! ensure_service "frontend" "http://localhost:3000"; then
            error_exit "Frontend not available at http://localhost:3000. Start it first (e.g. npm run dev)." 1
        fi

        # Determine if user provided a custom reporter
        has_custom_reporter=false
        for arg in "${EXTRA_ARGS[@]}"; do
            if [[ "$arg" == --reporter* ]]; then
                has_custom_reporter=true
                break
            fi
        done

        cmd_args=()
        if [[ -n "$TEST_ARG" ]]; then
            cmd_args+=("$TEST_ARG")
        fi
        cmd_args+=("${EXTRA_ARGS[@]}")
        if [[ "$has_custom_reporter" == "false" ]]; then
            cmd_args+=("--reporter=json")
        fi

        # Run tests and capture output + exit code
        set +e
        OUTPUT=$(npx playwright test "${cmd_args[@]}" 2>&1)
        EXIT_CODE=$?
        set -e

        # Try to extract JSON report from output (only if we forced JSON reporter)
        JSON_REPORT=""
        if [[ "$has_custom_reporter" == "false" ]]; then
            JSON_REPORT=$(echo "$OUTPUT" | awk '/^\[/{found=1} found{print}')
        fi
        
        if [[ $EXIT_CODE -eq 0 ]]; then
            if [[ -n "$JSON_REPORT" ]]; then
                echo "$JSON_REPORT"
            else
                printf '{"status": "ok", "message": "All tests passed", "exit_code": 0}\n'
            fi
            log "Tests passed."
        else
            if [[ -n "$JSON_REPORT" ]]; then
                echo "$JSON_REPORT"
            else
                printf '{"status": "error", "message": "Tests failed", "exit_code": %d, "output": %s}\n' \
                    "$EXIT_CODE" \
                    "$(echo "$OUTPUT" | jq -R -s '.[:-1]')"
            fi
            log "Tests failed with exit code $EXIT_CODE."
            exit "$EXIT_CODE"
        fi
        ;;

    ui)
        log "Starting Playwright UI mode..."
        # UI mode is interactive; we cannot capture JSON easily.
        # Return structured info and run in background or foreground.
        printf '{"status": "ok", "message": "Starting Playwright UI mode. This is interactive."}\n'
        npx playwright test --ui 2>>"$LOG_FILE" || {
            error_exit "UI mode failed or was interrupted." 1
        }
        ;;

    debug)
        log "Starting Playwright debug mode..."
        printf '{"status": "ok", "message": "Starting Playwright debug mode. This is interactive."}\n'
        npx playwright test --debug 2>>"$LOG_FILE" || {
            error_exit "Debug mode failed or was interrupted." 1
        }
        ;;

    report)
        log "Showing Playwright report..."
        REPORT_PATH="playwright-report/index.html"
        if [[ -f "$REPORT_PATH" ]]; then
            printf '{"status": "ok", "message": "Report found", "path": "%s", "suggestion": "Open with: npx playwright show-report"}\n' \
                "$(realpath "$REPORT_PATH" 2>/dev/null || echo "$REPORT_PATH")"
            log "Report located at $REPORT_PATH"
        else
            error_exit "No report found at $REPORT_PATH. Run tests first." 1
        fi
        ;;

    *)
        error_exit "Unknown action: $ACTION" 2
        ;;
esac
