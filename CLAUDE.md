# dtonmoy.github.io — Portfolio Site

## What this project is

A static GitHub Pages portfolio/CV site for Tonmoy Das. Built with plain HTML, CSS, and vanilla JS — no build step required.

## Architecture

**All content lives in `data/profile.json`.** Never edit `index.html` to change content — edit the JSON file instead. `js/main.js` reads the JSON on page load and renders every section dynamically.

```
index.html          → shell structure + nav
css/style.css       → all styling
js/main.js          → fetches profile.json, renders sections
data/profile.json   → single source of truth for all content
assets/             → images (profile photo, etc.)
```

## Updating content

| What you want to change | File to edit |
|---|---|
| Bio, title, institution | `data/profile.json` → top-level fields |
| Skills (languages/tools/domains) | `data/profile.json` → `skills` object |
| Projects | `data/profile.json` → `projects` array |
| Work / academic history | `data/profile.json` → `experience` array |
| Contact links | `data/profile.json` → `contact` object |
| Layout or visual design | `css/style.css` |

## Slash commands (use in Claude Code)

- `/add-project` — guided flow to add a new project card
- `/update-skills` — review and edit the skills section
- `/update-resume` — add or update an experience entry

## Previewing locally

Open `index.html` via a local server (not file://) so `fetch('data/profile.json')` works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use the VS Code Live Server extension.

## Deploying to GitHub Pages

1. Create repo `dtonmoy/dtonmoy.github.io` on GitHub
2. From this folder: `git init && git remote add origin git@github.com:dtonmoy/dtonmoy.github.io.git`
3. `git add . && git commit -m "initial portfolio" && git push -u origin main`
4. GitHub Pages auto-serves from the `main` branch root → live at `https://dtonmoy.github.io`

No CI/CD or build step needed — push and it's live within ~2 minutes.

## Adding a profile photo

Drop your photo into `assets/photo.jpg` (or any format), then in `profile.json` add:

```json
"photo": "assets/photo.jpg"
```

`main.js` will automatically use it in the hero avatar if the field is present.
