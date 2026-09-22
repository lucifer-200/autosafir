# AutoSafir Digital Showroom

Source code for the AutoSafir luxury digital showroom demo.

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify:static
```

The project uses Next.js static export. Production-ready static files are generated in `out/` after `npm run build`.

## Publishing Notes

- Public repository visibility means the source code is visible to everyone.
- Keep demo metadata as `noindex,nofollow` until AutoSafir authorizes public indexing.
- Do not commit `.env*`, local logs, generated output, or QA review artifacts.
- Public pages must not show vehicle prices.
- Demo integrations are mocked and must not include real API keys.

See [docs/public-publishing.md](docs/public-publishing.md) for the full publishing checklist.
