# Runewars Fate Intelligence

Fate deck odds and rune tracking for Runewars. `cards.json` and images from
https://github.com/takras/runewars-fate/tree/main.

## Development

Requires the Node version in `.node-version` (22).

```sh
npm ci
npm run dev        # vite dev server
npm test           # vitest
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Deployment

Deployed to Cloudflare Workers as a static asset Worker, configured in
`wrangler.jsonc` and built automatically by Workers Builds on push to `main`.
There is no server-side code, and no client-side router — `not_found_handling`
is `none` so unknown paths return a 404.
