# JAPP – Japanisch Lern-App

PWA zum Lernen von Hiragana, Katakana, Kanji (N5) und Vokabeln mit SRS-Wiederholung (SM-2-Variante).

## Voraussetzungen

- Node.js 20+
- npm

## Entwicklung

```bash
npm install
npm run dev
```

Die App läuft unter `http://localhost:5173/Japan-App/`.

## Skripte

| Befehl | Beschreibung |
|--------|--------------|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | TypeScript-Check + Produktions-Build |
| `npm run preview` | Build lokal testen |
| `npm run test` | Unit-Tests (Vitest) |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + GitHub Pages |

## Audio generieren (optional)

MP3-Dateien für Aussprache per OpenAI TTS:

```powershell
$env:OPENAI_API_KEY="sk-..."
node scripts/gen-audio.mjs
```

Ohne MP3-Dateien wird automatisch `SpeechSynthesis` als Fallback genutzt.

## Strich-SVGs

Stroke-Animationen stammen von [AnimCJK](https://github.com/parsimonhi/animCJK) (`public/strokes/`).

Neue SVGs herunterladen:

```bash
node scripts/download-strokes.mjs
```

## Architektur

- **React 19** + **Vite** + **Tailwind CSS 4**
- **Zustand** mit LocalStorage-Persistenz für Lernfortschritt
- **HashRouter** für GitHub Pages Deployment

```
src/
  constants/   # SRS, Status, Kategorie-Labels
  components/  # UI-Komponenten inkl. practice/
  data/        # Statische Lerninhalte
  hooks/       # usePracticeSession, useStoreHydration
  pages/       # Routen
  store/       # Zustand Store
  utils/       # sm2, date, audio, scriptAnalyzer
```

## Tastaturkürzel (Üben)

| Taste | Aktion |
|-------|--------|
| Leertaste / Enter | Karte aufdecken |
| 1–4 | SRS-Bewertung (Nochmal → Einfach) |
| 1 / N | Karteikarte: Nochmal |
| 4 / Y | Karteikarte: Gewusst |

## Deployment

`base` in `vite.config.ts` ist auf `/Japan-App/` gesetzt (GitHub Pages). Anpassen, falls das Repo anders heißt.

```bash
npm run deploy
```

## Lizenz

ISC
