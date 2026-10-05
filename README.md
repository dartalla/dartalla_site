# Dartalla One — landing page

Static product landing page. Serve the repository with any static HTTP server; there is no build step or backend API.

## Implemented

- Dartalla One positioning for PMEs; demonstration request via WhatsApp.
- Bootstrap 5.3.8 (Collapse only, 12 KB JavaScript), local Nunito, accessible native FAQ, progressive mobile navigation.
- Removed template screenshots, inert editorial links, pseudo testimonials and video.
- Local `dartalla:cta_click` event dispatched on `document` with `{ placement, intent: 'request_demo' }`. Placements: `header`, `hero`, `contact`, `floating`. No persistence, tracker, personal data or automatic WhatsApp submission.
- Informational privacy page describing this site's behavior.

## Required before publication

1. Confirm official landing domain, WhatsApp owner and company identification. Old social links were removed because ownership and availability were not verified.
2. Validate backend behavior and integrated finance/fiscal workflows in an isolated non-production environment. The screenshots verify rendered UI only; the local fixture gateway does not verify API business logic, SEFAZ integration or plan availability.
3. Four actual UI captures are included: dashboard, transactions, NF-e drafts and customers. Their records are synthetic. See `assets/img/product/README.md` for provenance and reproduction. Originals and responsive WebP variants are retained; captions identify demonstration data.
4. Confirm which product modules are offered to each target customer before making specific commercial claims.
5. Set absolute canonical, og:url and og:image tags on both pages from the confirmed domain. Use the prepared 1200×630 `assets/img/share-card.jpg` (editable source: `share-card.svg`). Generate sitemap.xml for `/` and `/privacidade.html` and robots.txt pointing to that sitemap. No guessed domain, placeholder URL or nonexistent image should enter production.
6. Confirm hosting access logging and align the privacy information with the actual hosting configuration. Configure HTTPS, compression, cache rules and security headers in the real host; never describe unverified infrastructure guarantees in product copy.
7. Run responsive/browser checks and Lighthouse on the final asset set: targets 90 performance and 95 accessibility, best practices and SEO. Record device/network settings and remaining limitations. Do not infer field conversion or Core Web Vitals from local checks.

## Dependencies

Bootstrap: https://getbootstrap.com/ (MIT, copyright retained in distributed assets).
Nunito: https://github.com/googlefonts/nunito (SIL Open Font License; see assets/fonts/OFL.txt).

## CSS optimization

Bootstrap CSS is the 5.3.8 distribution reduced to this page's selectors. When adding Bootstrap components or utilities, download the full CSS again and regenerate using:

```sh
npx --yes purgecss@7.0.2 --css assets/css/bootstrap.min.css --content index.html privacidade.html assets/js/main.js --safelist show collapsing --output assets/css
```

Always preserve the license header and recheck collapse transitions. Do not purge an already reduced file when introducing new components. Nunito uses a local Latin variable WOFF2 covering weights 400–800.

## Validation — 2026-10-04

- Node syntax check and `git diff --check` passed.
- Both HTML documents passed local-file, anchor, duplicate-ID, image-dimension and inert-link checks.
- Browser inspection: widths 360, 390, 768, 1024 and 1440; mobile menu open/close and ARIA state; FAQ keyboard activation and visible focus; privacy navigation.
- A script-free rendering confirmed that mobile navigation and the main content remain available in the document flow.
- CTA contract check: four placements, exactly one local event per click, only placement and intent fields.
- Lighthouse 12.8.2 mobile, simulated throttling, local Python static server: performance 94, accessibility 100, best practices 100, SEO 100. FCP 1.2 s, LCP 2.1 s, CLS 0, TBT 240 ms. Report at `.lighthouse/mobile.json` (ignored local artifact).
- These earlier scores describe the version before product screenshots. A final screenshot validation is recorded below. They do not verify production security, hosting, indexation or future image performance. Production cache and compression remain hosting tasks. Full 200% browser zoom and real-device validation are still pending.

## JavaScript optimization

The local Bootstrap bundle includes only Collapse and its official dependencies. Reproduce from the npm `bootstrap@5.3.8` package with an entry importing `js/src/collapse.js` and assigning `window.bootstrap = { Collapse }`; bundle with `esbuild@0.25.11 --bundle --minify --format=iife --legal-comments=inline`. Retain the Bootstrap copyright/MIT header. The bundle is 12 KB versus 60 KB for the previous full distribution.

## Final validation with product screenshots — 2026-10-04

- Four originals (1600×1000) checked and hashed; twelve proportional WebP variants (413 KB combined). Below-fold images load lazily; hero image has high fetch priority. Every screenshot includes demonstration-data labeling and an enlargement link.
- Browser checks at 360, 390, 768, 1024 and 1440 pixels: no horizontal page overflow. All four images loaded successfully; mobile menu open/close and `aria-expanded` verified after reducing Bootstrap to Collapse only.
- HTML assets and source hashes, JavaScript syntax, gateway Python syntax and `git diff --check` passed.
- Lighthouse 12.8.2 mobile (412×823, device scale 1.75), simulated throttling, local static server: performance 98, accessibility 100, best practices 100, SEO 100. FCP 1.4 s, LCP 2.0 s, Speed Index 2.0 s, CLS 0, TBT 110 ms. Earlier intermediate runs varied; these are lab results, not field guarantees.
- Landing preview remains served on `0.0.0.0:8765`; LAN URL `http://192.168.1.101:8765/` returned HTTP 200 from this computer. Mobile device must share the LAN; actual handset access was not verified.
- Screenshot gateway stopped after capture. Remote database and original user session were not changed. Official domain, hosting, legal/business identity and commercial confirmation remain publication prerequisites.
