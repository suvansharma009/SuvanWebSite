# Personal website

A Next.js App Router site with a link-in-bio–style landing page, detail pages (About, Projects, Hobbies, Passion projects), and an **AI alter ego** chat that answers from your profile data.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (includes `npm`)

## Setup

```bash
npm install
```

Create `.env.local` in the project root when you want real chat responses:

```env
OPENAI_API_KEY=sk-...
# Optional — default is gpt-4o-mini
# OPENAI_MODEL=gpt-4o-mini
```

Without `OPENAI_API_KEY`, `/api/chat` returns short **demo** replies so you can still click through the UI.

## Content

Edit **[`content/site.json`](content/site.json)** with your name, bio, projects, hobbies, passion projects, social links, and image paths.

- **Hero image:** `heroImage.src` can be a path under `public/` (e.g. `/hero.jpg`) or a remote URL (Unsplash is allowed in [`next.config.ts`](next.config.ts)).
- **Avatar:** Replace `avatar.src` with something like `/avatar.jpg` and add the file under `public/`, or keep the bundled placeholder SVG.
- **Contact icons:** The landing footer uses `social.website`, `social.email`, and `social.location` (e.g. a maps link). `linkedin` and `github` are included in the AI context and can be surfaced on pages later if you extend the UI.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Deployment (e.g. Vercel)

1. Push the project to a Git host and import it in [Vercel](https://vercel.com/).
2. Add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) in the project environment variables.
3. Deploy.

The chat API runs on the server so your API key is not exposed to the browser.

## Project structure

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Landing page |
| `app/about`, `projects`, `hobbies`, `passion-projects` | Detail pages |
| `app/ai-alter-ego` | Chat UI |
| `app/api/chat` | OpenAI-backed chat with system prompt from `site.json` |
| `lib/site.ts` | Types, `getSiteContent()`, profile text for the AI |
| `content/site.json` | Editable site copy |
