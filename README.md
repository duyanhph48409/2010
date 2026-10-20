# Happy Womenday 20/10

A mobile-first greeting-card web app for Vietnamese Women's Day (20/10), sent from a company to its female colleagues. Built with React + Vite + Tailwind + Framer Motion.

## Features

- Animated envelope that opens with a 3D flap, revealing a card with "Happy Womenday 20/10"
- Carnations spring up, then the card expands into a full letter
- Auto-scrolling Vietnamese letter text (touch/scroll cancels auto-scroll)
- Bouquet and polaroid decorations on the envelope front
- Subtle floating petals in the background
- Optional background music (starts after first tap, toggle top-right)
- Edit mode: customize names, title, letter, photo URL, and music URL
- Share: generates a link with config encoded in the URL hash; opening it shows the customized card
- Mobile-first, max-width 430px centered, iPhone safe-area support, no horizontal scroll

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The output is in `dist/`.

## Deploy

### Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com), import the repo
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`
4. Deploy

### Netlify

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com), import the repo
3. Build command: `npm run build`. Publish directory: `dist`
4. Deploy

### GitHub Pages

1. Push this repo to GitHub
2. Go to Settings → Pages → Source → GitHub Actions
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. Push and your site will be at `https://<username>.github.io/<repo>/`

## Customization

- Open the app with `?edit=1` in the URL (e.g. `https://yoursite.com/?edit=1`) or tap the small gear icon
- Edit names, title, letter text, photo URL, and music URL
- Click "Tạo link chia sẻ" to generate a shareable link, then "Sao chép link" to copy it
- Opening the shared link shows the customized card without the edit UI
