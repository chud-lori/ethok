<p align="center">
  <img src="icon-192.png" alt="Ethok-Ethok" width="128" height="128" />
</p>

<h1 align="center">Ethok-Ethok</h1>

<p align="center">A social deduction party game. Find the impostor among you.</p>

---

A social deduction party game in the style of Undercover. Players share a secret word, one or more impostors get a similar-but-different word, and optional Mr. White has no word at all. Describe, vote, eliminate, repeat.

Pure static web app — no backend, no build step.

## Features

- 🌐 Bilingual: English & Bahasa Indonesia (persisted per device)
- 👥 3–20 players, configurable Undercover and Mr. White counts
- 🗂️ 500 word pairs per language (1000 total)
- ♻️ Anti-repeat history — no pair repeats within the last 50 games per language
- 🎭 Full game loop: role reveal → discussion → vote → elimination → win detection
- 🃏 Mr. White final-guess mechanic
- 📱 Responsive, mobile-first, installable (PWA manifest, touch icons)
- 🔎 SEO & link-preview ready (OG tags, Twitter card, JSON-LD, sitemap, robots)
- 🎨 Light-blue theme with custom brand icon and OG image

## Project Structure

```
ethok/
├── index.html              # all screens as sections + meta/OG tags
├── style.css               # responsive styles, light-blue theme
├── script.js               # game logic + pair history
├── i18n.js                 # EN/ID strings
├── words.js                # 500 pairs per language
├── manifest.webmanifest    # PWA manifest
├── robots.txt / sitemap.xml
├── icon.svg                # master icon
├── icon-192.png / icon-512.png / apple-touch-icon.png / favicon-32.png
├── og-image.png            # 1200×630 social preview
└── _gen_icons.py           # regenerates icon set + OG image
```

## Run Locally

Any static file server works:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Open http://localhost:8000.

## Deploy

### Static hosting (recommended)
Upload the folder as-is to Cloudflare Pages, Netlify, Vercel, GitHub Pages, or S3 + CloudFront.

### nginx
Point `root` at the project directory and serve:

```nginx
server {
  listen 80;
  server_name _;
  root /var/www/ethok;
  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }
}
```

### Docker + nginx
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

Build and run: `docker build -t ethok . && docker run -p 8080:80 ethok`.

## How to Play

1. Each player is secretly assigned a role and a word (Civilian, Undercover, or Mr. White).
2. Pass the phone around so each player views their card privately.
3. In turn, each player describes their word in one short sentence — without saying it.
4. After the round, vote to eliminate the player you suspect is an impostor.
5. If Mr. White is eliminated, they get one chance to guess the civilian word and steal the win.
6. Rounds continue until a team wins.

### Winning

- **Civilians** win by eliminating every impostor.
- **Undercover** wins by surviving until impostors equal or outnumber civilians.
- **Mr. White** wins by correctly guessing the civilian word when eliminated.

## Credits

Created by [Lori](https://profile.lori.my.id).

## License

MIT
