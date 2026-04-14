# Ethok-Ethok

A social deduction party game in the style of Undercover. Players share a secret word, one or more impostors get a similar-but-different word, and optional Mr. White has no word at all. Describe, vote, eliminate, repeat.

Pure static web app — no backend, no build step.

## Features

- 🌐 Bilingual: English & Bahasa Indonesia (persisted per device)
- 👥 3–20 players, configurable Undercover and Mr. White counts
- 🗂️ 500 word pairs per language (1000 total)
- 🎭 Full game loop: role reveal → discussion → vote → elimination → win detection
- 🃏 Mr. White final-guess mechanic
- 📱 Responsive design — mobile-first, works on desktop

## Project Structure

```
ethok/
├── index.html     # all screens as sections
├── style.css      # responsive styles
├── script.js      # game logic
├── i18n.js        # EN/ID strings
└── words.js       # word pair dataset
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

## License

MIT
