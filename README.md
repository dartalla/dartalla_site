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

## Visual restoration — 2026-10-05

Restored the original hero ornament, section shapes, footer background and FAQ illustration from commit `178033e`. Product screenshots and corrected content remain. Entrance animations return through IntersectionObserver/Web Animations, alongside gentle illustration motion and hover/header transitions. Real screenshot slides use native scroll snapping with previous/next controls, keyboard arrows and touch scrolling. No autoplay.

Verified: 360, 390, 768, 1024 and 1440 pixel layouts without horizontal page overflow; slide buttons and keyboard navigation; no console errors; script-free content and vertical gallery fallback. An isolated review fixture simulated reduced-motion input and its CSS rules: no animation, instant slide navigation. User OS preferences were not modified. Assets, anchors, duplicate IDs, JS syntax and diff whitespace checks passed.

Lighthouse 12.8.2 mobile, simulated throttling, local server: performance 97, accessibility 100, best practices 100, SEO 100, CLS 0. Report: `.lighthouse/motion-mobile.json`. This visual correction was prepared on `codex/restaurar-movimento-design` before publication.


### Movimento e scroll

Motion 14.0.0 (MIT) controla entradas com fade de 1,35 s e deslocamento curto; Lenis 1.3.26 (MIT) suaviza apenas âncoras com duração de 1,45 s. Arquivos e licenças estão em `assets/vendor/`, sem CDN em runtime. Roda, trackpad e toque mantêm o scroll nativo e a galeria preserva seu scroll horizontal. `prefers-reduced-motion` desliga animações e destrói o scroll suave, inclusive quando alterado com a página aberta. Conteúdo permanece acessível sem JavaScript ou bibliotecas.

Verificação local da suavização: navegação móvel e galeria operantes; sem overflow em 360/390/768 px; fixture sem scripts preserva conteúdo e navegação; fixture de movimento reduzido desliga Lenis e animações. Lighthouse móvel: desempenho 91, acessibilidade 100, boas práticas 100, SEO 100 e CLS 0 (`.lighthouse/smooth-mobile.json`).


### Acabamento e desempenho — 2026-10-05

- Motion Mini 14.0.0 substitui a distribuição completa: 8,2 KB locais em vez de 144 KB. O hero entra por deslocamento sem ocultar título ou captura; o fade gradual continua nas outras seções.
- Cabeçalho mantém posicionamento fixo com transições de topo, preenchimento, cor e bordas; a versão sem scripts continua no fluxo.
- FAQ nativa anima abertura e fechamento por 420 ms; cliques repetidos revertem a direção. Movimento reduzido mantém a interação nativa sem animação.
- Capturas abrem em um diálogo com zoom de 1600 px, área rolável, fechamento com Escape e retorno do foco. Sem scripts, os links continuam abrindo o arquivo original. Scroll manual permanece nativo.
- Verificados menu móvel, FAQ por teclado, galeria, foco no diálogo, zoom, fechamento e ausência de overflow em 360/390/768 px. Fixtures locais validam conteúdo sem scripts e simulam movimento reduzido; a preferência do sistema não foi alterada.
- Lighthouse 12.8.2 mobile, throttling simulado, servidor local: desempenho 97, acessibilidade 100, boas práticas 100, SEO 100; LCP 2,5 s, TBT 0 ms, CLS 0. Relatório local ignorado: `.lighthouse/polish-mobile.json`. Validação realizada antes da publicação.

Para reproduzir o bundle Mini em um diretório temporário, instale `motion@14.0.0` e `esbuild@0.25.11`, crie um entry com `import { animate } from "motion/mini"; window.Motion = { animate };` e execute esbuild com `--bundle --minify --format=iife --legal-comments=inline`. Copie o bundle para `assets/vendor/motion-14.0.0/motion-mini.js` preservando `LICENSE.md`.


### Consistência, demonstração e eventos

Fundos da galeria e do contato usam a mesma paleta; a seção de contato explica os três assuntos da demonstração sem prometer duração, condições ou recursos não confirmados. Eventos locais cobrem visualização de seções, intenções de contato, galeria, capturas, zoom e FAQ. O evento anterior de CTA continua compatível. Contratos e limites estão em `docs/analytics.md`. Integração com analytics de produção e validação de conversões permanecem pendentes de um serviço confirmado.


Versão aprovada para publicação em 2026-10-05, mantendo scroll manual nativo, animações reduzidas por preferência do usuário, capturas reais ampliáveis e eventos locais sem transmissão. A publicação segue a integração de hospedagem vinculada à branch `main`.
