# Umsetzung des App-Reviews

Stand: 27. Oktober 2026. Grundlage: `APP_REVIEW.md` und die anschließend vorgeschlagenen Lernfunktionen. Die Gestaltung folgt der gewünschten ruhigen, erwachsenen Richtung mit Busuu/Babbel als Vergleich.

## Ergebnis

Die App hat jetzt einen geführten Kurs, eine Lernwerkstatt und eine lokale Datensicherung. Vorhandene Lernstände werden mit Store-Version 4 übernommen. Die Bibliothek enthält 453 Einträge: jeweils 104 moderne Hiragana-/Katakana-Formen, vier separat angebotene historische Zeichen, 79 Kanji und 162 Vokabeln. Dazu kommen 20 Grammatikpunkte, sieben überarbeitete Geschichten und drei Alltagsmissionen.

**Anmeldung und Cloud-Synchronisierung wurden auf ausdrücklichen Wunsch ausgelassen und für eine spätere Ergänzung vorbereitet.** Die App benötigt keinen Server und überträgt den Lernstand nicht an einen Kontodienst.

## Befunde aus dem Review

| Befund                                              | Umsetzung                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Einzelne Kanji-Lesungen werden abgelehnt         | Getrennte Kana-/Romaji-Lesungen mit On-/Kun-Kennung; `ichi`, `いち` und `ひとつ` werden bei 一 akzeptiert. Kontextkarten prüfen die zum Beispiel gehörende Antwort. Lange Vokale bleiben relevant.                                                                                                                  |
| 2. Grobe und automatisch verbuchte Schreibbewertung | Referenzen aus tatsächlichen AnimCJK-Strichpfaden; Vergleich von Verlauf, Ansatz/Ende, Reihenfolge und Richtung. Erst „Zeichnung prüfen“, anschließend ausdrücklich speichern. Löschen und einzelne Striche verändern keinen Lernstand. Die Prozentzahl ist eine Formhilfe, keine zertifizierte Handschriftprüfung. |
| 3. Fehlende Kanji-Strichfolge                       | Lokale SVGs und erreichbare Animations-/Schreibtabs für alle 79 Kanji. Alle Referenzen im Browser extrahiert und mit der hinterlegten Strichzahl abgeglichen. Quell- und Lizenzdateien liegen unter `public/strokes/`.                                                                                              |
| 4. Unzusammenhängende Geschichten                   | Alle sieben Texte als zusammenhängende Alltagssituationen überarbeitet, jeweils mit zwei Verständnisfragen. Übersetzungen lassen sich gezielt einblenden, abgeschlossene Texte erneut lesen.                                                                                                                        |
| 5. Kein Anfängercurriculum                          | Kleine Einheiten mit Einführung, Erkennen, eigener Eingabe und Ergebnis. Erste Einheit: あ・い・う・え・お. Kurs nach Kana-Reihen, Kanji-/Wortschatzgruppen und Grammatik. Grundlagen werden empfohlen; eine bewusste Auswahl anderer Einheiten bleibt möglich. Neue Tageskarten stammen aus eingeführten Inhalten. |
| 6. Kein Export/Import/Sync                          | Versionierte JSON-Sicherung mit Größen-/Datenprüfung, Vorschau, bestätigtem Ersetzen und Wiederherstellungskopie. Importfehler verändern keinen Lernstand. Speicherfehler zeigen einen Exportweg; beschädigtes lokales JSON blockiert die App nicht. Sync ist nur als spätere Schnittstelle vorbereitet.            |
| 7. Verlorene Sitzungen                              | Warteschlange, Position, Antwort, Feedback, Bewertungen und Fehlerrunde bleiben erhalten. Auch Kurslektionen, Trainings und Lesepositionen sind fortsetzbar.                                                                                                                                                        |
| 8. Gemeinsamer Zustand für Wort und Beispiel        | Eigenständige stabile IDs und Termine für Lemma, Beispiel und Grammatiksatz. Eine Beispielantwort erhöht nicht den Wortzähler.                                                                                                                                                                                      |
| 9. Uneinheitliche Lesehilfen                        | Gemeinsame Steuerung in Zeichenansichten, Beispielen, Karten und Lesetexten. Romaji/Furigana respektieren die Einstellungen; Hinweise und ausdrücklich aufgerufene Antworten sind weiter zugänglich.                                                                                                                |
| 10. Überladener Store                               | Persistenz/Migration, Bewertungsmodell, Sitzungsdaten und Lernplanung getrennt. Import übernimmt bekannte Datenfelder, keine Store-Aktionen oder fremde Inhaltsdefinitionen.                                                                                                                                        |
| 11. Fehlende Wochenhistorie                         | Tageswerte aus tatsächlichen Bewertungen, interaktiver Sieben-Tage-Verlauf, richtige Antworten und XP. Frühere Tage werden nicht aus alten Summen erfunden.                                                                                                                                                         |

Falsche Antworten erhalten außerdem eine zehnminütige Wiederholungsstufe und eine einmalige Fehlerrunde innerhalb der Sitzung. Intervallbeschriftungen folgen der tatsächlichen Planung. Fällige Beispiele konkurrieren mit neuen Inhalten nach ihrem Termin.

## Zusätzliche Lernfunktionen

| Funktion                 | Umfang                                                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verwechslungstrainer     | Acht Zeichenpaare, beispielsweise シ/ツ und ぬ/め; bis zu zehn Aufgaben pro Durchlauf, persönliche Fehler priorisieren die Auswahl.                   |
| Alltagsmissionen         | Café, Bahnhof und Kennenlernen mit jeweils drei Aufgaben und Erklärungen; zugehörige Grammatik wird anschließend für Wiederholungen eingeführt.       |
| Erklärendes Feedback     | Expliziter Antwortschritt statt sofortigem Weiterspringen; Erläuterungen in Missionen, Trainings, Grammatik und Verständnisfragen.                    |
| Adaptive Lesehilfen      | Romaji bei wiederholt sicher erkannten Inhalten reduzieren, Furigana bei beherrschten Inhalten; Anpassung abschaltbar und Hilfen gezielt einblendbar. |
| Nachsprechen / Shadowing | Sätze aus den Geschichten, Tempo 0,6–1,2×, ein/drei/fünf Wiederholungen mit Pausen und Abbrechen. Keine automatische Aussprachebenotung.              |
| Persönliches Lernheft    | Gemerkte Wörter, Notizen, eigene Beispielsätze, Sammlungen, Suche und Entfernen. Alles lokal gespeichert und im Backup enthalten.                     |
| Kanji-Bausteine          | Form- und Komponenten-Merkhilfen für alle 79 Kanji. Die Bilder sind Gedächtnisstützen, keine Behauptungen über historische Etymologie.                |
| Kompetenzchecks          | Abrufaufgaben aus bereits eingeführten/geübten Inhalten, Ergebnis und Wiederholung; ergänzend Hörverständnis mit Audio und Antwortauswahl.            |

## Architektur und spätere Synchronisierung

- `src/store/persistence.ts`: aktuelle Inhalte mit älteren Lernständen zusammenführen, Datenfelder für Persistenz auswählen.
- `src/store/reviewModel.ts`: Bewertungen, Zähler, Termine und echte Tageshistorie; wiederholte Ereignis-IDs werden ignoriert.
- `src/utils/studyPlan.ts`: Lernplanung aus eingeführten Inhalten, fälligen Karten und bewusst gemerkten Wörtern.
- `src/utils/backup.ts`: unabhängiges Sicherungsformat `japp-backup`, Version 1; wiederaufgenommene Karten werden aus den aktuellen Inhalten rekonstruiert.
- `src/services/sync.ts`: Provider-Schnittstelle und Konflikterkennung über Revisionen. Ein späterer Server muss die Revision auch beim Schreiben atomar prüfen. Konto, Anbieter, Anmeldeablauf und automatische Zusammenführung sind noch nicht implementiert.

## Validierung

- 87 Unit-Tests in 16 Dateien: Antworten, Schreibvergleich, Wiederholungsintervalle, Lernplanung, Migration, Sicherung, Sitzungsfortsetzung, Ereignisse, Audio-Abbruch und spätere Sync-Konflikte.
- TypeScript/Produktions-Build und ESLint.
- Browser: vollständige erste Lektion und Wiederholung, Navigation mitten im Feedback, Eingabe nach Neuladen, Fehlerrunde, unabhängige Beispieltermine, Lernheft und Sammlungen, Backup-Download/Import/Wiederherstellung, fehlerhafte Dateien, Schreibbewertung und explizites Speichern, Mission, Verwechslungen, Hörtraining, Kompetenzcheck, Geschichte und Wochenverlauf.
- Bestehender v3-Lernstand mit XP, SRS, Design, gemerkten Wörtern und Lesefortschritt; zusätzlich simulierte Speicherplatzfehler und beschädigtes lokales JSON.
- 320 × 568, 390 × 844 und 1440 × 1000, heller/dunkler Modus; Produktions-PWA mit Offline-Neuladen.

Die Browserprüfung verwendet Chromium. Nachsprechen wurde mit kontrollierter Sprachausgabe auf Tempo, Wiederholung und Abbruch geprüft. Japanische Systemstimmen, physische iPhones/Safari und eine unabhängige sprachdidaktische Prüfung der gesamten Inhalte bleiben reale Geräte- bzw. Fachprüfungen. MP3-Dateien sind optional; ohne Datei wird die japanische System-Sprachausgabe verwendet, deren Verfügbarkeit und Offlinefähigkeit vom Gerät abhängen.

## Veröffentlichung und installierte Webapp (28. Oktober 2026)

Der ursprüngliche Workflow veröffentlichte nur nach manuellem Start zusammen mit der optionalen Audiogenerierung. Ein normaler Merge aktualisierte deshalb den Quellcode, während im Branch `gh-pages` weiterhin die ältere gebaute Oberfläche lag.

Version 1.1.0 ergänzt die automatische Veröffentlichung des gebauten App-Branches, eine sichtbare Versionsnummer in den Einstellungen sowie aktive Updateprüfungen beim Wiederöffnen, bei wiederhergestellter Internetverbindung und regelmäßig im Vordergrund. Ein bereites Update lädt den Bildschirm erst nach „Jetzt aktualisieren“ neu; der lokale Lernstand wird dabei nicht gelöscht.

Geprüft wurde im Chromium-Browser der tatsächliche alte Pages-Service-Worker mit gespeicherten Lernzählern: Übernahme nach 1.1.0 und anschließend ein simuliertes Folgeupdate 1.1.1 mit explizitem Neuladen, unverändertem Fortschritt und offline fortsetzbarem Lektionsfeedback. Die 87 vorhandenen Tests, ESLint und Produktionsbuild sind weiterhin erfolgreich. Die Live-Domain und GitHub-API sind aus dieser Cloud-Umgebung durch die Netzwerkregeln nicht direkt erreichbar; die veröffentlichten Dateien werden zusätzlich über den Git-Branch geprüft.

Zusätzlich war GitHub Pages auf `master` mit dem Verzeichnis `/` eingestellt. Dort liegt der Vite-Quellcode; die gebaute App wird nach `gh-pages` veröffentlicht. Die Einstellung wurde über die GitHub-Actions-Diagnose bestätigt. GitHub verweigerte dem Workflow die Änderung mit **HTTP 403: Resource not accessible by integration**. Ein Repository-Eigentümer muss deshalb einmal unter **Settings → Pages → Build and deployment** die Quelle **Deploy from a branch → gh-pages → /(root)** speichern. Die geprüften Dateien von Version 1.1.0 sind bereits in diesem Branch veröffentlicht. Danach kann der Workflow weitere App-Versionen ohne Änderung der Repository-Einstellung veröffentlichen.

Die Pages-Quelle wurde anschließend durch den Repository-Eigentümer auf `gh-pages` mit `/` umgestellt. [GitHub-Pages-Veröffentlichung 40650775147](https://github.com/Dobolino/Japan-App/actions/runs/40650775147) ist erfolgreich und verwendet den richtigen Branch mit den geprüften Dateien von Version 1.1.0. Die ursprüngliche Berechtigungssperre ist damit für weitere Veröffentlichungen nicht mehr relevant; der Workflow muss die Einstellung nur noch prüfen.

## iPhone-Layoutkorrektur, Version 1.1.1

Installierte Webapps verwenden für den App-Rahmen jetzt die volle Höhe des Root-Containers. So bleibt unter der Navigation kein zusätzlicher Streifen, wenn iOS für `dvh` noch einen Browserleisten-Abstand abzieht. Der Schutzabstand für die Wischleiste wird weiterhin genau einmal in der Navigation berücksichtigt. „Aussprache zeigen“ steht mittig auf einer eigenen Zeile unter dem Zeichen.

Geprüft in einer tatsächlich installierten Chromium-PWA bei 320 × 568, 393 × 852, 430 × 932, 844 × 390 und 1440 × 1000: Navigation am Fensterrand, simulierte obere/untere Sicherheitsabstände, eigene Zeile für die Aussprache bei Kana, Kanji und Vokabeln, funktionierendes Ein-/Ausblenden der Hilfe und unveränderte Lernzähler/Einstellungen. Zusätzlich vier Größen im normalen Browser. Eine simulierte um 55 Pixel verkürzte dynamische Viewport-Höhe erzeugt ohne Standalone-Korrektur den beobachteten Streifen; mit der Korrektur ist er null Pixel hoch. Build, ESLint und alle 87 Tests erfolgreich. Eine physische iPhone-Prüfung bleibt von dieser Browserprüfung getrennt.
