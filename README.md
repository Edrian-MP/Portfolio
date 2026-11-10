# Edrian Monforte Patulot — Portfolio

The latest Dark Bento portfolio exported from the Figma Code Layer, adapted for standalone hosting on GitHub Pages. Includes the pixel developer artwork, project modal, interactive SmartPOS system explorer, motion effects, and email/GitHub links.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

## Validate and build

```sh
npm run check
npm run build
npm run preview
```

The production website is generated in `dist/`. Relative asset paths support both account websites and repository websites.

## Publish to GitHub Pages

1. Push this project to the selected GitHub repository's `main` branch, including `package-lock.json` and `.github/workflows/deploy.yml`.
2. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Open **Actions → Deploy portfolio to GitHub Pages** and run the workflow, or push a commit to `main`.
4. Wait for both build and deploy jobs to succeed. The deploy job returns the live website URL.

If using only the separate built-site ZIP, extract its contents into the repository's publishing root and choose **Deploy from a branch** in Pages settings instead. Upload `index.html`, `assets/`, fonts, favicon, and `.nojekyll` together; do not upload the ZIP as the website.

## Content and assets

- `src/App.tsx`: portfolio content, SmartPOS details, interactions, and explorer.
- `src/index.css`: source styling and effects.
- `public/assets/ee678.png`: approved pixel developer workspace illustration.
- `public/fonts/`: local fonts, so the site does not depend on temporary Figma asset URLs.

Screenshots remain placeholders as requested. SmartPOS is labeled as a private repository; no fake demo URL is supplied. The contact action opens the visitor's email app. There is no server, database, contact-form submission service, or API secret in this version.

## Portable build notes

The build uses Vite 7 and the official Rollup WASM distribution for compatibility with the Windows development environment. `scripts/tailwind-candidates.mjs` reads source string literals and compiles the Tailwind stylesheet directly, avoiding platform-specific filesystem scanning. `src/generated.css` is generated automatically before development and production builds; edit `src/index.css` instead. Restart the dev command after changing CSS or adding utility classes.

## Validation performed

- TypeScript check and production build passed.
- Browser checks at 390px and 1440px: no horizontal overflow; illustration loaded.
- SmartPOS modal opened; Escape closed it and returned focus to the card.
- System explorer updated its information panel on selection.
- GitHub Pages publication must still be verified in the selected repository.

