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

The project cover and gallery now use nine original SmartPOS application screenshots supplied by Edrian (one duplicate inventory capture was omitted). Captions describe the captured screens; displayed confidence is not presented as an accuracy benchmark. The separate, collapsible workflow demo still uses illustrative prices and performs no real transactions. SmartPOS is labeled as a private repository; no fake demo URL is supplied. The contact action opens the visitor's email app. There is no server, database, contact-form submission service, or API secret in this version.

## Portable build notes

The build uses Vite 7 and the official Rollup WASM distribution for compatibility with the Windows development environment. `scripts/tailwind-candidates.mjs` reads source string literals and compiles the Tailwind stylesheet directly, avoiding platform-specific filesystem scanning. `src/generated.css` is generated automatically before development and production builds; edit `src/index.css` instead. Restart the dev command after changing CSS or adding utility classes.

## Validation performed

- TypeScript check and production build passed.
- Browser checks at 320px, 390px, 768px, and 1440px; corrected narrow-screen overflow and checked mobile layouts.
- SmartPOS modal opened; Escape closed it and returned focus to the card.
- System explorer updated its information panel on selection.
- Published at https://edrian-mp.github.io/Portfolio/ through GitHub Actions.

## Interactive experiences

- Workspace devices reveal relevant skills; the Day/Night switch themes the entire website, including project and navigation dialogs. A saved preference survives reloads and synchronizes across tabs. First-time visitors follow their device preference. Early theme initialization avoids a flash of the wrong theme.
- SmartPOS gallery: keyboard-accessible thumbnails, wrapping previous/next controls, captions, and full-resolution image links. Original files are preserved under public/assets/smartpos/.
- SmartPOS playground: select produce, adjust 0.25–3 kg, generate and reset a sample receipt. Prices are illustrative; no recognition, hardware, payment, or persistence is involved.
- Native View Transitions animate the project card into its showcase where supported. Unsupported browsers retain the modal; reduced-motion preferences disable the morph.
- Quick navigation opens from the header or Ctrl/Cmd+K, supports search, arrow keys, Enter, Escape, and focus trapping/return.
- Responsive navigation, separate About section, compact mobile modal header, aligned contact actions, and smaller device controls support narrow screens.

## Visual polish

Pixel character: a generated closed-eye frame is masked to the eye regions, with short blinks/double blink, slow breathing, and device-selection acknowledgement. The original artwork is preserved. Pause/Resume character controls, offscreen/background pausing, and reduced-motion support are included. New asset: public/assets/edrian-blink-v1.png.

Section navigation tracks the current section and slides its highlight; mobile uses a bottom navigation bar with content/safe-area clearance. The fullscreen screenshot dialog supports keyboard navigation, horizontal swipe, zoom/fit, and returning focus without closing the project. Screenshot changes fade gently. Theme changes coordinate surface colors and a sun/moon icon animation. Workspace device selection adds a small nod, monitor activity, and a status light. Offscreen/background activity is paused, and reduced-motion preferences disable the added animation. Mobile labels use larger, less dense type.
