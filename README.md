# network-engineers.com

A vendor-neutral community for network engineers. One topic per session, 30 minutes of discussion, one written conclusion published here.

Plain HTML + CSS + vanilla JS. No build step. No framework. No npm.

---

## Preview locally

```
cd network-engineers.com
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser.

---

## GitHub Pages

The repo is set up for `nimentus/network-engineers`, served at:

- **Now:** https://nimentus.github.io/network-engineers/
- **Later:** https://network-engineers.com/ (after DNS cutover)

All asset paths are relative (`./assets/...`) so the site works at both locations with zero edits.

`.nojekyll` is present so GitHub Pages serves the site as-is.

---

## DNS cutover (apex domain)

When DNS is ready:

1. Rename `CNAME.disabled` → `CNAME` in the repo root.
2. Commit and push.
3. In GitHub → Settings → Pages → Custom domain, enter `network-engineers.com`.
4. Enable "Enforce HTTPS" once the cert provisions.

The `CNAME.disabled` file contains the target domain (`network-engineers.com`).
Do **not** rename it to `CNAME` until the A/AAAA records point to GitHub Pages IPs — premature renaming causes a failed cert check.

---

## Font files

Self-hosted woff2 files go in `./assets/fonts/`. Until they are present, the site falls back to Courier New / system monospace.

Required files:
- `JetBrainsMono-Regular.woff2`
- `JetBrainsMono-Medium.woff2`
- `IBMPlexMono-Regular.woff2`

Both typefaces are free under SIL OFL 1.1:
- JetBrains Mono: https://www.jetbrains.com/legalterms/jetbrains-mono/
- IBM Plex Mono: https://github.com/IBM/plex/releases

---

## Adding a conclusion article

Open `index.html`, find the `show archive` section, and copy the template block from the comment into the `.archive-list` div. Increment the `ep-N` class (ep-1 through ep-8, then back to ep-1) for each new entry. Delete the `<p class="archive-empty">` line when you have at least one entry. Update `CONCLUSIONS_COUNT` at the top of `main.js`.

## Updating the status bar

At the top of `main.js`, edit:

```js
const CONCLUSIONS_COUNT = 0        // number of published conclusions
const NEXT_SESSION      = 'TBA'    // e.g. '2026-09-10'
const PEERING_URL       = 'https://REPLACE-ME'  // founding-circle survey URL
```

## Brand assets

`./assets/brand/` contains the full identity system:

| File | Use |
|------|-----|
| `ne-bubble-dark.svg` | Full-colour mark, dark backgrounds (source) |
| `ne-bubble-dark-crop.svg` | Same mark, viewBox trimmed to visible bounds (used in HTML) |
| `ne-bubble-light.svg` | Full-colour mark, light backgrounds |
| `ne-bubble-mono.svg` | Single-colour fallback |
| `ne-bubble-solid3.svg` | 3-figure reduction for small sizes |
| `ne-bubble-favicon-512.png` | Favicon / avatar |
| `ne-social-1200x630.png` | Open Graph image |
