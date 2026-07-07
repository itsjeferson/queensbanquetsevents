# Requirements Analysis & Design Spec — Template Management & Picker Redesign

Implement:
1. **Database update**: Seed 2 new wedding invitation templates: "Sage Garden" and "Navy Elegance".
2. **Invitation Builder (Client)**: Show template selector when "wedding" event type is selected.
3. **Invitation Manage (Client)**: Show template selector with live preview before applying/saving.
4. **Invitation Templates (Admin)**: Allow adding, editing, and previewing templates.

---

## 1. Database Changes

We need to add two new templates to the `invitation_templates` table if they do not exist:
- **Sage Garden**: Category = `wedding`, preview_image = `/images/templates/wedding-sage.jpg`, theme_config = `{"primary":"#6B8F71","accent":"#3E5C44","font":"Inter"}`
- **Navy Elegance**: Category = `wedding`, preview_image = `/images/templates/wedding-navy.jpg`, theme_config = `{"primary":"#2C3E50","accent":"#1A252F","font":"Playfair Display"}`

We will write a database migration/seed script in `backend/database/add_wedding_templates.php` and execute it.

---

## 2. Frontend Components & Pages

### A. Template Selector Component
Create a reusable `<InvitationTemplateSelector />` component in `frontend/src/components/invitation/InvitationTemplateSelector.jsx`:
- Fetches active templates for a given category (or filters by category).
- Displays cards for each template with a preview image or placeholder, title, and buttons:
  - **Select** (Active card border state)
  - **Preview Design** (Triggers a preview modal)
- Custom templates can be represented as "Custom Colors" or we can default to the DB templates.
- Includes a live preview modal showing the client's current details styled with the hovered/selected template's configuration.

### B. Client Invitation Builder
#### [MODIFY] [InvitationBuilder.jsx](file:///c:/queens-banquet-events/frontend/src/pages/client/InvitationBuilder.jsx)
- In Step 0 (Event Info), if `event_type === 'wedding'`, display `<InvitationTemplateSelector />` below the event type grid.
- Selecting a template updates `form.template_id` and pre-populates the colors and fonts in `form.invitation` (`primary_color`, `secondary_color`, `font_family`, `color_motif`) using the template's `theme_config`.
- Prevents moving to Step 1 without selecting a template.

### C. Client Invitation Manage
#### [MODIFY] [InvitationManage.jsx](file:///c:/queens-banquet-events/frontend/src/pages/client/InvitationManage.jsx)
- Add a "Design Template" card section or modal that shows `<InvitationTemplateSelector />` for the event type.
- Allows clients to view their current templates, select a different template, preview it with their actual event data, and save it.

### D. Admin Template Management
#### [MODIFY] [InvitationTemplates.jsx](file:///c:/queens-banquet-events/frontend/src/pages/admin/InvitationTemplates.jsx)
- Add an "Edit Template" modal or overlay.
- In the template data table and grid, add an "Edit" action button.
- Editing a template allows updating its name, category, status (active/inactive), preview image URL, and `theme_config` values (primary color, accent color, font family).
- Integrates with the backend API `PUT /templates/:id` via `templateService.update`.

---

## 3. Verification Plan
- **Database verification**: Run the seed script and verify the 2 templates exist.
- **Builder Verification**: Create a new wedding event, select templates, click "Preview Design", verify rendering.
- **Manage Verification**: Open existing wedding event, change template, verify preview, save, verify persistence.
- **Admin Verification**: Add a template, edit an existing template, verify changes.
