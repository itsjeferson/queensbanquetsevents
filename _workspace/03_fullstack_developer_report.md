# Fullstack Developer Report: Default Mark & She Design Implementation

## Modifications Summary

1. `backend/models/InvitationPage.php`:
   - Updated `markPublished` to set `template_id = COALESCE(template_id, 1)` when an invitation is published.
   - Updated `formatForApi` to return `template_id => 1` by default when `template_id` is missing/null in the database.
   - Updated `emptyDefault` to return `template_id => 1`.
   - Updated `normalizeInput` to assign `template_id => 1` if no template ID is provided in data payload.

2. `frontend/src/utils/invitationContent.js`:
   - Updated `normalizeInvitationContent` to default `template_id` to `1` when unspecified or falsy.

3. `frontend/src/components/invitation/InvitationRenderer.jsx`:
   - Added `effectiveTemplateId = Number(invitation?.template_id) || 1` so that template 1 (`<InvitationMainContent>` rendering Mark & She hero banner, PLAY OUR SONG card, story balloons, M&S monogram, and groom/bride profiles) renders by default.

4. `frontend/src/pages/client/InvitationBuilder.jsx`:
   - Updated form initialization state so default `template_id` is `1`.

5. `frontend/src/components/invitation/InvitationTemplateSelector.jsx`:
   - Updated selection check to default fallback to Template ID `1` if `selectedId` is undefined or falsy.
