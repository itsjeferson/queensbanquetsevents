# Requirements Analyst Plan: Non-Collapsing Full-Content Multi-Device Wedding Invitation

## 1. Overview
The user requests that the wedding invitation display full, uncollapsed content across all devices (mobile, tablet, desktop) matching the provided high-end mobile screenshots for the "Entourage" and "Details" sections.

## 2. Identified Visual & Functional Requirements

### A. Entourage Section (Matching Screenshot 1)
- **Top Header**: Elegant gold script "Entourage" with delicate watercolor botanical eucalyptus/green leaves in the top right.
- **Side-by-Side 2-Column Responsive Layout**:
  - Parents: "Parents of the Groom" (left) | "Parents of the Bride" (right) with cursive subheaders and names underneath.
  - Principal Sponsors: Centered "Principal Sponsors" header, with 2 balanced columns (Male Sponsors on left, Female Sponsors on right).
  - Best Men / Maid of Honor: "Best Men" (left) | "Matron & Maid of Honor" (right).
  - Secondary Sponsors: Centered "Secondary Sponsors", "Veil" (centered), "Candle" (left) | "Cord" (right).
  - Bearers: "Bible Bearer" (centered), "Ring Bearer" (left) | "Coin Bearer" (right).
  - Flower Girls: Centered "Flower Girls" with list of names.
  - Ceremony Contributors / Officiants: "Ceremony Contributors" (centered) with "Catholic Wedding Officiant" (left) | "Persian Wedding Officiant" (right) or custom officiants.
- **Device Scaling (Non-Collapsing)**: The 2-column grid must maintain its side-by-side structure on mobile viewports with fluid typography (`clamp(...)`), appropriate margin/padding, and no wrapping or content truncation.

### B. Details Section (Matching Screenshot 2)
- **Top Header**: Elegant gold script "Details" with top-right botanical watercolor foliage.
- **Attire Component**:
  - Script header "Attire" + "STRICTLY FORMAL" uppercase badge/subtitle.
  - "Ladies: Long Evening Gown | Gentlemen: Barong & Black Slacks" or custom dress code details.
  - **Principal Sponsors Color Motif**: Gold uppercase label + color swatch (e.g., Matte Gold).
  - **Guests Color Palette**: Gold uppercase label + palette title (e.g., Pastel Earth) + reminder "(Kindly avoid wearing White, Emerald Green or Gold)" + horizontal swatch dots.
  - **Attire Couple Illustration**: Refined couple illustration (lady in evening gown, gentleman in barong) alongside the color guide.
- **Unplugged Ceremony Component**:
  - Gold script "Unplugged Ceremony" heading + elegant centered italic message encouraging guests to be present.
- **Children and Companions Component**:
  - Gold script "Children and Companions" heading + clear, graceful advisory text regarding invitation-named guests only.
- **Venue Information Component**:
  - Gold script "Venue Information" heading.
  - Two side-by-side columns: "Where we say “I do”" (Ceremony) and "Where we celebrate" (Reception).
  - Includes Church & Reception venue names, full addresses, architectural vintage sketches, and quick-scan QR codes for Google Maps navigation.

### C. Styling & Non-Collapsing Layout
- Update CSS in `frontend/src/styles/invitation.css` to prevent mobile media queries from collapsing side-by-side grids into stacked single columns for entourage and details.
- Provide fluid, readable scaling for typography across all viewports from 360px up to 1440px+.

## 3. Files to Update / Create
1. `frontend/src/components/invitation/EntourageFullSection.jsx` - Refactor to support all entourage categories, gold script headings, and non-collapsing multi-column layout.
2. `frontend/src/components/invitation/AttireGuideSection.jsx` - Support color swatches, couple illustration, and strictly formal attire guidance.
3. `frontend/src/components/invitation/WeddingDetailsSection.jsx` - Support Venue Information with "Where we say 'I do'" / "Where we celebrate" cards with architectural sketches and QR codes.
4. `frontend/src/components/invitation/UnpluggedCeremonySection.jsx` / `ChildrenPolicySection.jsx` or unified `EventDetailsSection.jsx` - Add Unplugged Ceremony and Children & Companions sections.
5. `frontend/src/components/invitation/InvitationMainContent.jsx` - Integrate all uncollapsed sections in the clean reveal pipeline.
6. `frontend/src/styles/invitation.css` - Update responsive rules to maintain 2-column layout on mobile, add gold script styling, textured background, and botanical corner overlays.
7. `frontend/src/utils/invitationContent.js` & `frontend/src/data/demoInvitation.js` - Ensure full data attributes and default values are present.
