# Dartalla Site

- Preserve Dartalla's existing logo, purple gradients and Nunito typography.
- This is a static HTML/CSS/JavaScript site. Do not migrate frameworks without a request.
- Product claims require confirmed capabilities and evidence. Never invent customer quotes, metrics, guarantees, certifications or commercial terms.
- Product screenshots must show the actual Dartalla One with safe demonstration data. Never publish template screens or mock interfaces as product evidence; alt text and captions must match the image.
- Keep missing screenshots and deployment facts explicitly pending; do not invent public domains or replace them with placeholder URLs.
- Interactive state and accessible state must agree. Use Bootstrap's component API rather than changing collapse classes manually.
- Keep content and WhatsApp links available without JavaScript. Never use a blocking preloader or hide content behind animation initialization.
- WhatsApp clicks are contact intentions, not persisted leads or sent messages. Never transmit contact information through analytics events.
- Verify keyboard focus, mobile navigation, reduced motion, asset links and responsive layout after changes.
- Third-party dependencies must be pinned, served locally and retain their licenses.
- Initialize navigation enhancement before first paint to prevent header/content layout shifts; the script-free layout must keep navigation in document flow.
- On small screens, Bootstrap row gutters must fit container padding. Check document scroll width, not only individual card bounds.
- Screenshot fixtures must intercept every API request locally and never forward authentication or cookies to a real service. Inspect endpoint response shapes before capture; keep transaction payment states consistent with dashboard totals. Record UI provenance and distinguish rendered mock data from backend verification.
- Before committing, check the staged diff with `git diff --cached --check`; the unstaged check does not cover newly added files.
- Content cleanup must preserve the existing visual composition, decorative artwork and motion. Replace fictitious product evidence without removing unrelated design assets or interactions; redesign requires an explicit request. Motion must respect reduced-motion preferences and keep content readable when JavaScript is unavailable.
- Mobile navigation must stay above page content in both initial and sticky states, with an opaque background during opening and closing. Verify overlap and link hit targets; a high z-index alone does not fix transparent backgrounds.

- Animation libraries must release inline opacity/transform after completion so CSS hover and floating effects remain effective. Anchor scrolling must use one header offset; do not add a second offset on top of CSS scroll-padding.

- Keep manual wheel, trackpad and touch scrolling native and responsive. Apply Lenis smoothing only to programmatic anchor navigation; do not add manual scroll inertia without an explicit request.

- Above-the-fold title and product evidence must remain fully visible during entrance motion; keep fades below the fold and use the smallest library build needed. Screenshot enhancement must preserve original links without JavaScript and provide keyboard closing, focus return and contained zoom scrolling.

- Normalize vendored text licenses to LF while preserving their wording and copyright notices; include newly added vendor files in the staged whitespace check.
