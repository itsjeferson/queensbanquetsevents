# Requirements Analyst Plan: Default Mark & She Design (Template ID 1)

## Objective
Enforce Template ID 1 (Classic Gold / Standard Mark & She invitation design) as the default design for all wedding invitations across backend APIs, frontend builders, managers, and invitation renderers.

## Affected Files
1. `backend/models/InvitationPage.php`:
   - `formatForApi`: default `template_id` to `1` when missing/null.
   - `emptyDefault`: set default `template_id` to `1`.
   - `normalizeInput`: default `template_id` to `1` when null/missing.
   - `markPublished`: ensure `template_id` is updated with `COALESCE(template_id, 1)` on publish.
2. `frontend/src/utils/invitationContent.js`:
   - `normalizeInvitationContent`: default `template_id` to `1` if missing/falsy.
3. `frontend/src/components/invitation/InvitationRenderer.jsx`:
   - Compute `effectiveTemplateId = Number(invitation?.template_id) || 1`.
4. `frontend/src/pages/client/InvitationBuilder.jsx`:
   - Default form state `template_id: 1`.
5. `frontend/src/components/invitation/InvitationTemplateSelector.jsx`:
   - Default fallback selection to Template ID 1.
