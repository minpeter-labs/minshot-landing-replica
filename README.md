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
CLOUDFLARE_ACCOUNT_ID=<your-account-id> \
  bunx wrangler pages deploy dist \
  --project-name minshot-landing-replica \
  --branch main \
  --commit-dirty=true
```

Current deployed URL: [https://minshot-landing-replica.pages.dev/](https://minshot-landing-replica.pages.dev/)
