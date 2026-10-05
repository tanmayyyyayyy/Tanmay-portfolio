# Tanmay Jain — Portfolio

Single page, scroll-driven portfolio built with Vite, React, TypeScript, Tailwind CSS, GSAP and Lenis.

## Run locally

```sh
npm install
npm run dev
```

Create a `.env` file from `.env.example` and set `VITE_WEB3FORMS_ACCESS_KEY` to enable the contact form. Without a key, the form shows a setup message and directs visitors to email.

## Edit content and media

Portfolio copy, links, projects, stack and skills live in `src/content/site.ts`. Add the portrait at `public/me.jpg` and replace the labeled project placeholders with screenshots when available. Add `public/share.jpg` for the Open Graph share image.

Project repo URLs currently marked `TODO` should be replaced with real repository URLs. The footer and lab social links are configured in the same content file.

## GitHub Pages

The Vite base path is `/Tanmay-portfolio/`. The workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to `main`; enable GitHub Pages with **GitHub Actions** as the deployment source in repository settings.
