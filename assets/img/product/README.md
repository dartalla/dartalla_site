# Product screenshots — 2026-10-04

These are captures of the actual Dartalla One React interface, not a reconstructed or generated UI. Synthetic API fixtures supply the displayed business records. No customer database was seeded or changed, and no real session was copied.

Frontend: existing local Vite server on port 3010, worktree `accounting-classification/core_app`, base commit `6f5f3f243473c49be82f1a30d034a72f2733cfee`. Existing worktree changes may affect the rendered interface; this is provenance, not a release certification.

Captured via Codex browser at 1600×1000: `/`, `/transaction`, `/customer`, `/fiscal/nfe`. Originals: `source/*.jpg`. Integrity hashes: `source/manifest.json`. WebP variants: 640, 960 and 1600 pixels wide, proportional resizing only, quality 88. No screenshot contents were composited or replaced.

## Reproduction

With the existing frontend already running at localhost:3010:

```sh
python3 scripts/demo_gateway.py
```

Open http://127.0.0.1:3020 and sign in with fictional `demo@dartalla.example` / `DemoLocal2026!`. These inputs are discarded; authentication is simulated locally. The gateway binds loopback only, proxies UI assets without browser credentials, overrides the frontend API base to same origin, and intercepts every `/api/` request. It never forwards API requests to the real backend. All business writes and fiscal emissions are disabled. Unknown optional lists are empty. Stop the gateway after capture.

The UI sidebar follows the existing feature flags. Customer and fiscal captures use their existing application routes directly; this does not assert that every subscription exposes those modules.

## Demonstration data

Six fictional companies, example-domain emails, one checking account, nine transactions and four NF-e drafts. No real tax IDs, phone numbers, access keys or authorized invoices. Monetary values are integer cents. Received R$42,500 minus paid R$16,300 gives period net R$26,200. With an implicit opening balance of R$10,000, account balance is R$36,200. Pending payments R$4,200 leave R$32,000 available; pending receipt R$9,800 gives projected R$41,800.

These images substantiate the interface shown. They do not establish backend correctness, fiscal authorization, permissions, persistence or customer results.
