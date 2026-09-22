# Public Publishing Guide

## Decision

This repository can be made public when source-code visibility is acceptable.

A public GitHub repository exposes the code, commit history, public assets, and documentation to viewers. GitHub branch protection can stop unauthorized edits to `main`, but it cannot hide the source code in a public repository.

## Recommended Setup

1. Keep `main` protected.
2. Require pull requests before merging.
3. Require status checks before merging.
4. Restrict who can push directly to `main`.
5. Keep demo metadata as `noindex,nofollow` until AutoSafir approves public indexing.

## Hosting Options

### Vercel

- Import the GitHub repository into Vercel.
- Build command: `npm run build`.
- Output directory: `out`.
- Share the deployment URL after the build passes.

### Netlify or Cloudflare Pages

- Build command: `npm run build`.
- Publish directory: `out`.
- Use platform access controls if a preview should be password-protected.

### Manual Static Hosting

Because this project exports static files, the `out/` directory can be uploaded to any static host.

```bash
npm run build
npm run verify:static
```

Upload only the generated `out/` folder.

## Repository Hygiene

The `review/` directory is ignored and should not be committed. It contains local QA screenshots, generated audit output, and temporary review media. These files are useful locally, but they are not part of the product source.

Local files that should stay out of Git:

- `.env*`
- `*.log`
- `.next/`
- `out/`
- `test-results/`
- `playwright-report/`
- `review/`
- `*.tsbuildinfo`

## Before Making The Repository Public

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify:static
```

Confirm:

- No real secrets or API keys exist in the client.
- No private customer data is committed.
- No generated QA review artifacts are tracked.
- Demo admin is clearly treated as an insecure demo gate.
- Robots metadata still blocks indexing unless public SEO has been approved.
- Public pages do not show vehicle prices.

## When Public Indexing Is Approved Later

Only after explicit approval:

1. Update `src/app/layout.tsx` metadata from `noindex,nofollow` to indexable production metadata.
2. Update `src/app/robots.ts` to allow crawling.
3. Update `scripts/verify-static-export.mjs` so it expects the production robots policy.
4. Add production SEO, canonical URLs, sitemap, and verified organization metadata.
