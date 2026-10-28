# JAPP – Japanisch Lern-App

PWA zum Lernen von Hiragana, Katakana, Kanji, Wortschatz und Grammatik. Ruhige Oberfläche, geführte Lektionen und SRS-Wiederholung (SM-2-Variante).

## Lernfunktionen

- Geführter Kurs mit Einführung, Erkennen und aktiver Eingabe; Lektionen und Übungen später fortsetzen.
- Moderne Kana mit Dakuten, Handakuten und Kombinationen; historische Zeichen separat.
- Verwechslungstrainer, Hörverständnis, Kompetenzchecks und drei Alltagsmissionen.
- Sieben zusammenhängende Geschichten mit Worterklärungen, Satzbau und Verständnisfragen.
- Nachsprechen mit regelbarem Tempo und Wiederholungen.
- Strichfolge und bewusst gespeicherte Schreibübungen für alle 79 Kanji, mit Form-Merkhilfen.
- Adaptiv reduzierte Lesehilfen, Lernheft mit eigenen Notizen und Sammlungen, echter Wochenverlauf.
- Versionierter JSON-Export/-Import mit Vorschau und Wiederherstellungskopie unter Einstellungen.

Lernstände bleiben auf dem Gerät. Anmeldung und automatische Gerätesynchronisierung sind für später vorbereitet; aktuell erfolgt ein Gerätewechsel über die Sicherungsdatei. [Umsetzungsstand und Prüfungen](docs/IMPLEMENTATION_STATUS.md) · [Ursprüngliches App-Review](docs/APP_REVIEW.md)

## Voraussetzungen

- Node.js 24 empfohlen (Vite 8 benötigt mindestens 20.19 oder 22.12)
- npm

## Entwicklung

```bash
npm ci
npm run dev
```

Die App läuft unter `http://localhost:5173/Japan-App/`.

## Skripte

| Befehl            | Beschreibung                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Entwicklungsserver                   |
| `npm run build`   | TypeScript-Check + Produktions-Build |
| `npm run preview` | Build lokal testen                   |
| `npm run test`    | Unit-Tests (Vitest)                  |
| `npm run lint`    | ESLint                               |
| `npm run deploy`  | Build + GitHub Pages                 |

## Audio generieren (optional)

MP3-Dateien für Aussprache per OpenAI TTS:

```powershell
$env:OPENAI_API_KEY="sk-..."
node scripts/gen-audio.mjs
```

Ohne MP3-Dateien wird automatisch `SpeechSynthesis` als Fallback genutzt. Eine japanische Systemstimme muss auf dem Gerät verfügbar sein; deren Offlinefähigkeit hängt vom Betriebssystem ab. Die bestehenden TTS-Skripte sind optional und werden beim normalen Start nicht aufgerufen.

## Strich-SVGs

Stroke-Animationen und Referenzpfade stammen von [AnimCJK](https://github.com/parsimonhi/animCJK) (`public/strokes/`). Sie enthalten eigene Lizenzbedingungen: [Übersicht](public/strokes/COPYING.txt), [Kana/LGPL](public/strokes/LGPL.txt), [Kanji/Arphic](public/strokes/APL/ARPHICPL.TXT). Diese Assets fallen nicht unter die ISC-Lizenz des Anwendungscodes.

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
  services/    # Schnittstelle für späteren Sync
  store/       # Zustand-Aktionen, Persistenz, Bewertungsmodell und Datentypen
  utils/       # Lernplanung, Backup-Prüfung, Antworten, Schreiben und Audio
```

## Tastaturkürzel (Üben)

| Taste             | Aktion                            |
| ----------------- | --------------------------------- |
| Leertaste / Enter | Karte aufdecken                   |
| 1–4               | SRS-Bewertung (Nochmal → Einfach) |
| 1 / N             | Karteikarte: Nochmal              |
| 4 / Y             | Karteikarte: Gewusst              |

## Deployment

`base` in `vite.config.ts` ist auf `/Japan-App/` gesetzt (GitHub Pages). Anpassen, falls das Repo anders heißt.

```bash
npm run deploy
```

## Lizenz

Anwendungscode: ISC. Die AnimCJK-Strichdaten haben die oben verlinkten eigenen Lizenzen.
