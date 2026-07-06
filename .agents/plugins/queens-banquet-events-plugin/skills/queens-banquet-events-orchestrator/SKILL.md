---
name: queens-banquet-events-orchestrator
description: "Orchestrator for Queen's Banquet. Guides the developer team (analyst, fullstack, QA) to build, modify, test, and integrate features, components, pages, backend APIs, or database scripts. Automatically triggers for any tasks, feature additions, bug fixes, updates, refactorings, or modifications on the Queen's Banquet codebase. Use this whenever the user requests changes, fixes, updates, or re-runs of previous tasks."
---

# Queen's Banquet Events Orchestrator

Co-ordinates the development team (analyst, fullstack developer, and QA engineer) to build, test, and integrate modifications for the Queen's Banquet invitation management platform.

## Execution Mode: Subagent (Pipeline + QA Loop)

## Subagents Configuration

| Agent TypeName | Role | Skill | Output |
|:---|:---|:---|:---|
| `requirements-analyst` | Analyzes code and designs features | `requirements-analysis` | `_workspace/02_requirements_analyst_plan.md` |
| `fullstack-developer` | Implements frontend, backend, and DB modifications | `fullstack-development` | `_workspace/03_fullstack_developer_report.md` |
| `code-reviewer-qa` | Reviews changes and compiles code | `code-review-qa` | `_workspace/04_code_reviewer_qa_report.md` |

---

## Workflow

### Phase 0: Context Check (Restart & Update Support)
Check if previous workspace artifacts exist:
1. Scan for the `_workspace/` directory in the current working directory.
2. Determine Execution State:
   - **`_workspace/` Not Present**: This is an **Initial Run**. Proceed to Phase 1.
   - **`_workspace/` Present + Modification Request**: This is a **Partial Update/Re-run**. Trigger only the affected subagents. For example, if updating code based on feedback, skip Phase 2 and re-trigger `fullstack-developer` with the feedback details, then run `code-reviewer-qa`.
   - **`_workspace/` Present + New Request**: This is a **Fresh Run**. Move the existing `_workspace/` to `_workspace_backup_{timestamp}/` and proceed to Phase 1.

### Phase 1: Preparation
1. Analyze user inputs and requirements.
2. Ensure `_workspace/` exists (create if not).
3. Save the original prompt text to `_workspace/01_user_request.md`.

### Phase 2: Analysis & Planning
**Pattern:** Subagent Delegation
1. Call `requirements-analyst` via `invoke_subagent`:
   - **TypeName**: `requirements-analyst`
   - **Prompt**: "Please read the user request at `_workspace/01_user_request.md`, analyze the Queen's Banquet codebases, database tables, and API models, and output a detailed plan listing all files to be modified/created in `_workspace/02_requirements_analyst_plan.md`."
2. Verify that `_workspace/02_requirements_analyst_plan.md` has been successfully written.

### Phase 3: Development & Implementation
**Pattern:** Subagent Delegation
1. Call `fullstack-developer` via `invoke_subagent`:
   - **TypeName**: `fullstack-developer`
   - **Prompt**: "Please read `_workspace/02_requirements_analyst_plan.md` and implement the plan on the codebase. Modify/create React components, service wrappers, PHP routes/controllers, or SQL schemas. Write your summary report in `_workspace/03_fullstack_developer_report.md`."
2. Verify that `_workspace/03_fullstack_developer_report.md` is present.

### Phase 4: QA & Verification
**Pattern:** Subagent Delegation
1. Call `code-reviewer-qa` via `invoke_subagent`:
   - **TypeName**: `code-reviewer-qa`
   - **Prompt**: "Please read `_workspace/03_fullstack_developer_report.md`. Run frontend compiles/builds to check for syntax errors. Verify boundary interfaces (PHP endpoints vs React service calls), database foreign key constraints, and hash routing link formats. Save the QA validation report to `_workspace/04_code_reviewer_qa_report.md`."
2. Read the QA report:
   - If there are failed checks, re-trigger `fullstack-developer` with the failure details (QA Loop).
   - If checks pass, continue to Phase 5.

### Phase 5: Integration & Wrap-Up
**Pattern:** Direct Execution
1. Read the final state of the files.
2. Consolidate changes and summarize.
3. Present the walkthrough of the changes to the user.

---

## Data Flow

```
[Orchestrator]
    │
    ├── invoke_subagent("requirements-analyst") ──→ _workspace/02_requirements_analyst_plan.md
    │                                                      │
    │                                                      ↓ (Read)
    ├── invoke_subagent("fullstack-developer") ───→ [Code Modifications]
    │                                               _workspace/03_fullstack_developer_report.md
    │                                                      │
    │                                                      ↓ (Read)
    ├── invoke_subagent("code-reviewer-qa") ──────→ [Build Validation & Review]
    │                                               _workspace/04_code_reviewer_qa_report.md
    │
    └── walkthrough.md (Final Summary)
```

---

## Error Handling

- **Subagent Timeout/Crash**: Retry once. If failure persists, log the error in the final summary and request user input.
- **QA Compilation Failures**: Automatically route the build logs back to `fullstack-developer` for correction.
- **Incompatible Boundaries**: If a field name mismatch is detected between PHP and React API models, log the mismatch details and do not proceed to final integration until resolved.

---

## Test Scenarios

### Happy Path
1. The user requests a new invitation customizing field (e.g., guest RSVP remarks).
2. Phase 2 extracts database columns in `database/`, updates PHP controller, and updates React form input.
3. Phase 3 implements the code edits.
4. Phase 4 runs `npm run build` (passes) and confirms API response fields match React service parsing.
5. Walkthrough generated.

### Error Path (QA Loop)
1. User requests database-backed change.
2. Developer modifies React but forgets to update the fetch parsing parameter.
3. QA detects a boundary mismatch (camelCase vs snake_case).
4. QA writes a fail log in `_workspace/04_code_reviewer_qa_report.md`.
5. Orchestrator triggers developer again to fix the parsing mismatch.
6. Developer corrects the mismatch; QA re-tests and passes.
