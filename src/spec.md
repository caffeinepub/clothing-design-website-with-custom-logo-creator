# Specification

## Summary
**Goal:** Build a responsive clothing design web app with a simple logo maker, project saving via Internet Identity, and PNG export.

**Planned changes:**
- Create a responsive designer flow to select a garment base (T-shirt, hoodie, cap), set base color(s), and design on a 2D canvas with a visible print area.
- Implement a logo maker to create logos from text (font/size/color) and basic shapes (at least circle and rectangle), export as transparent PNG, and allow uploading existing images (PNG/JPG/SVG).
- Enable placing created/uploaded logos onto the garment canvas with move, resize, and rotate controls.
- Add basic layer management on the garment canvas: select with handles, bring forward/send backward, duplicate, delete.
- Add Internet Identity sign-in/out and a project gallery to create, name, save, list, open/restore, and delete projects.
- Implement a Motoko backend (single actor) with CRUD APIs and stable storage for per-user project persistence and ownership enforcement.
- Add an export flow to download the final garment design as a PNG at a fixed, consistent resolution per garment.
- Apply a consistent visual theme across landing, designer, logo maker, and gallery (avoid blue/purple as primary colors).
- Add a dismissible onboarding tip panel in the designer with persistence per browser.
- Add frontend static garment base templates under `frontend/public/assets/generated` and swap templates without full reload.

**User-visible outcome:** Users can sign in, start and manage multiple saved clothing design projects, create or upload a logo, place and edit elements on a garment template with layers, and export the final design as a downloadable PNG.
