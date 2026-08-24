# MimmoStore - GitHub Pages

This package is prepared as a static GitHub Pages site.

## Termux local test

Run from this folder (the folder containing `index.html`):

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`.

## GitHub Pages

Push the contents of this package to the `main` branch. The included
`.github/workflows/pages.yml` deploys the site with GitHub Pages.

`assets/api-local.js` is a static JavaScript data module, not a server.
It does not require Python/Node after deployment.
