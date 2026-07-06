---
name: code-review-qa
description: "Rules and tests for code verification, integration sanity checks, compilation testing, and boundary checks. Used by code-reviewer-qa to output a QA validation report."
---

# Code Review & QA

Guides verification and validation of codebase modifications.

## Instructions

### 1. Build Verification
- Execute frontend compilation checks:
  ```bash
  cd frontend
  npm run build
  ```
- Capture and review errors. Any compiler or linter errors count as a failure.

### 2. Interface Boundary Checks (Critical)
- **Field Name Mismatch**: Compare field names returned by PHP JSON responses (e.g. `$db_row['invite_code']`) against how they are referenced in React code (e.g. `data.inviteCode`). They must be perfectly aligned or mapped explicitly.
- **Pagination Structure**: If the backend returns page metadata, confirm the frontend handles pagination arrays/counts correctly.
- **HTTP Response Codes**: Verify frontend services handle non-200 HTTP statuses without throwing unhandled exceptions.

### 3. URL and Path Mapping
- Check that navigation links match hash-routing specifications:
  - Invite Slug: `queensbanquetevents.html#/invite/{slug}`
  - Invite Code: `queensbanquetevents.html#/event/{invite_code}`
- Check that redirection rules are correct.

### 4. QA Report
Generate a review document at `_workspace/04_code_reviewer_qa_report.md`:
```markdown
# QA Verification Report

## Compilation Status
- [ ] Frontend Compile (npm run build)
- [ ] Backend Syntax Checks

## Interface Boundary Checks
- [ ] React fetch parser vs PHP API response shape
- [ ] Key cases: snake_case vs camelCase checks

## Path Routing Verification
- [ ] Navigation and redirection links

## Final Verdict
- **Status**: [PASS | FAIL]
- **Details**: (List specific items to fix if FAIL)
```
