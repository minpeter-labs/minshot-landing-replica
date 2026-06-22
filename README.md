# Minshot Landing Replica

React + Vite recreation of `https://minshot.fehey.com/`.

This is a private reference implementation for visual QA and frontend study.
Minshot branding and product assets belong to their respective owner.

Run locally:

```sh
bun install
bun run dev
```

Production preview:

```sh
bun run build
bun run preview -- --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/` or `http://127.0.0.1:4173/zh/`.

Cloudflare Pages deployment used for QA:

```sh
env CLOUDFLARE_ACCOUNT_ID=795b98fae2d3efac0afc7a41494cc697 \
  bunx wrangler pages deploy dist \
  --project-name minshot-vite-temp-20260622 \
  --branch main \
  --commit-dirty=true
```

Current deployed URL: [https://minshot-vite-temp-20260622.pages.dev/](https://minshot-vite-temp-20260622.pages.dev/)

Latest verified deployment: [https://da5ae3cc.minshot-vite-temp-20260622.pages.dev/](https://da5ae3cc.minshot-vite-temp-20260622.pages.dev/)
