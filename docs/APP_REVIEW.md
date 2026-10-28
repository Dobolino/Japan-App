# JAPP: App-Review, UI und nächste Entwicklungsschritte

> Dieser Bericht dokumentiert die ursprüngliche Prüfung. Die anschließende Umsetzung aller elf Befunde und der zusätzlichen Lernfunktionen steht im [aktuellen Umsetzungsstand](IMPLEMENTATION_STATUS.md). Anmeldung und Cloud-Sync wurden auf Wunsch für später vorbereitet. Die Zahlen und offenen Befunde im ursprünglichen Bericht beschreiben den damaligen Stand.

Stand: 27. Oktober 2026. Gewünschte Richtung: ruhig und erwachsen, mit Busuu/Babbel als Vergleich für klare Lernführung. Untersucht wurden alle vorhandenen Seiten, Komponenten, Lerninhalte, Zustandsverwaltung, Wiederholungslogik und PWA-Konfiguration. Die UI wurde zusätzlich im Browser geprüft. Die Bezüge zu anderen Lernapps beschreiben bekannte Produktmuster und sind keine aktuelle Funktionsinventur dieser Anbieter.

## Einschätzung

JAPP hat eine brauchbare Basis für eine persönliche Japanisch-Lernapp: 337 Zeichen und Vokabeln, 20 Grammatikpunkte mit 59 Übungssätzen, sieben kurze Lesetexte, lokale Speicherung und Offlinebetrieb. Zeichen, Aussprache, Schreiben, Satzbau und Wiederholen sind bereits verbunden.

Der größte nächste Entwicklungsschritt liegt in der **Lernführung und in der Qualität der Lerninhalte**. Ein Einsteiger braucht eine sinnvolle Reihenfolge und verlässliche Rückmeldungen. Eine zufällige Auswahl aus allen Inhalten ist dafür noch kein vollständiger Kurs.

## Aufbau der App

| Bereich      | Vorhandene Grundlage                              | Bewertung und Empfehlung                                                                                 |
| ------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Oberfläche   | React 19, Vite, Tailwind, HashRouter              | Für eine lokale PWA angemessen. Gemeinsame Komponenten und Gestaltung weiterführen.                      |
| Navigation   | Start, Lernen, Lesen, Üben, Statistik             | Jetzt als Heute, Lernen, Üben, Lesen, Fortschritt geordnet; Einstellungen separat.                       |
| Lerninhalte  | Statische TypeScript-Daten                        | Einfach offline verfügbar. Inhaltliche Prüfung und einheitliche Datenformate sind wichtiger als ein CMS. |
| Fortschritt  | Zustand mit versionierter localStorage-Persistenz | Gut für ein Gerät. Export/Import sollte vor größeren Datenänderungen kommen.                             |
| Wiederholung | Vereinfachte SM-2-Variante                        | Als Grundlage verwendbar; Lernschritte für falsche Antworten und getrennte Wissensziele fehlen.          |
| Lesen        | Worterklärungen und Satzbauübungen                | Ein gutes Unterscheidungsmerkmal. Texte stärker zu zusammenhängenden Geschichten ausarbeiten.            |
| Tests        | Ursprünglich 25 Unit-Tests                        | Jetzt 35 Tests. Für Store-Migrationen, vollständige Lernabläufe und Inhaltskonsistenz weiter ausbauen.   |

## Bereits umgesetzt

- **Ruhigeres Erscheinungsbild:** gedeckte Blautöne, klare Schrift, weniger Schatten, dünnere Rahmen und einheitliche Symbole. Heller und dunkler Modus sowie begrenzte Inhaltsbreiten auf großen Bildschirmen.
- **Startseite mit Lernfokus:** neuer Hiragana-Einstieg, Tagesziel und direkte Links zu allen fünf Lernbereichen einschließlich Grammatik. Die Einstellungen verdecken die Lerninhalte nicht mehr.
- **Eigene Einstellungen:** Erscheinungsbild, Tagesziel und Lesehilfen an einem Ort. Erklärung zur lokalen Speicherung und bestätigtes Zurücksetzen außerhalb der Fortschrittsübersicht.
- **Lernbibliothek:** alle fünf Bereiche sichtbar, auswählbar und direkt verlinkbar; die Auswahl bleibt über die URL nach Neuladen erhalten.
- **Vokabelsuche:** Suche nach Deutsch, Japanisch und Romaji, zusammen mit den vorhandenen Themenfiltern.
- **Übungsübersicht:** Eingabemodus und Selbstbewertung verständlich erklärt. Neue Inhalte und tatsächlich fällige Wiederholungen werden getrennt angezeigt. Die Lektion verspricht keine feste Kartenzahl, die ihre Auswahl nicht einhält.
- **Wiederholungsauswahl korrigiert:** Ein früherer Fehler setzte falsche Karten auf `repetitions = 0` zurück und behandelte sie anschließend wie nie gelernte Karten. Jetzt entscheidet das bisherige Bewertungsdatum über „neu“ und „Wiederholung“; Karten mit zukünftigem Termin werden nicht als neue Karten eingeschoben. Das gilt auch für Grammatik.
- **Lernbereich respektiert:** Eine auf Hiragana, Katakana, Kanji oder Vokabeln eingegrenzte Tageslektion fügt keine fremden Grammatikkarten mehr hinzu.
- **Verlässliche Bewertungsanzeigen:** Die Intervalle auf den Tasten kommen aus der tatsächlichen Zeitplanung statt aus pauschalen Angaben wie „<1 min“ oder „>7 Tage“. Die Zeitplanung selbst wurde dabei nicht neu erfunden.
- **Konsistente Abschlussanzeige:** „Schwer“ zählt wie im Lernspeicher als richtige Antwort; Prozentzahl und XP stimmen dazu. Selbstbewertungen werden als solche benannt.
- **Fortschrittsdarstellung:** leere Genauigkeit als „–“, passende Erklärung des Fortschritts innerhalb der App und nicht überlappende Intervallgruppen ohne ungeübte Karten.
- **Bedienbarkeit:** Browser-Zoom wieder erlaubt, deutsche Dokumentsprache, sichtbarer Tastaturfokus, ausgewiesene Auswahlzustände und nicht fokussierbare verdeckte Karteikarten. Noch keine vollständige Prüfung aller WCAG-Kriterien.

## Vergleich mit bewährten Lernmustern

| Muster                                                      | Nutzen für JAPP                                                               | Weiterer Schritt                                                                         |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Klarer nächster Lernschritt, wie bei geführten Sprachkursen | Anfänger müssen nicht fünf gleichwertige Entscheidungen treffen.              | Aus dem Hiragana-Einstieg eine echte, geführte erste Einheit machen.                     |
| Kleine Einheiten mit einem Lernziel                         | Ein Abschluss bedeutet „Ich kann etwas“, nicht nur „Ich habe Karten gesehen“. | Etwa: „Du erkennst あ・い・う・え・お“ mit Einführung und anschließendem Abruf.          |
| Wiederholung nach Bedarf, wie bei Karteikarten-Apps         | Wissen bleibt länger verfügbar.                                               | Einen eigenen Lernschritt für falsche Antworten innerhalb der Sitzung ergänzen.          |
| Wörter in sinnvoller Kommunikation                          | Bedeutung, Grammatik und Situation verbinden sich.                            | Geschichten redaktionell überarbeiten und mit passenden Lektionen verknüpfen.            |
| Konkretes, zurückhaltendes Feedback                         | Motivation ohne dauernden Belohnungsdruck.                                    | Nach richtigen Eingaben kurz Erfolg und korrekte Aussprache zeigen, bevor es weitergeht. |
| Verständlicher Fortschritt                                  | Lernende sehen, was sich verbessert.                                          | Lernverlauf speichern und daraus einen echten Wochenrückblick bilden.                    |

## Wichtige offene Befunde

### P1: Inhalt und Bewertung zuverlässig machen

1. **Kanji-Lesungen werden nicht zuverlässig als einzelne Antworten akzeptiert.** `kanji-n5.ts` speichert mehrere Lesungen gemeinsam, zum Beispiel für 一 als `イチ / ひと・つ`. `reviewCardMatchesAnswer` vergleicht diese Zeichenfolge als Ganzes; die Eingabe `ichi` wird bei der einzelnen Kanji-Karte abgelehnt. Lesungen brauchen getrennte Felder für Kana, Romaji und zulässige Alternativen. Dabei müssen On-/Kun-Lesung und das abgefragte Wort eindeutig zum Lernziel passen.
2. **Schreibbewertung ist eine grobe Näherung.** `StrokeCanvas` bewertet hauptsächlich Strichzahl und überlappende Begrenzungsflächen. Strichrichtung, Verlauf und Reihenfolge werden damit nicht zuverlässig beurteilt. Außerdem sind die gezeichneten Referenzdaten vereinfachte Polylinien. `CharacterDetailPage` verbucht bereits die erste Auswertung nach dem ersten Strich; auch „Löschen“ kann vor einer Bewertung einen Fehlversuch speichern. Die Bewertung sollte erst ausdrücklich nach Abschluss übernommen werden. Eine belastbare Bewertung braucht geprüfte Pfade und eigene Referenzfälle.
3. **Kanji-Strichfolge ist nicht durchgehend erreichbar.** Die 79 Kanji-Einträge enthalten keine `strokes`-Polylinien. `CharacterDetailPage` blendet die Schreib-/Strichfolge-Tabs deshalb aus, auch wenn passende SVG-Dateien vorhanden sein können. SVG-Verfügbarkeit und Daten für die Schreibbewertung sollten getrennt modelliert werden.
4. **Die Geschichten haben noch keine durchgehende Handlung.** „Im Café“ wechselt beispielsweise vom Bestellen zur Bibliothek und zum Aufstehen um drei Uhr. Kurze, zusammenhängende Situationen und Fragen zum Verständnis würden diesen Bereich deutlich verbessern. Die Japanisch- und Übersetzungsinhalte sollten fachlich geprüft werden.
5. **Ein strukturiertes Anfängercurriculum fehlt.** Die Übungswarteschlange wählt neue Karten zufällig und bevorzugt häufig Beispiele. Dadurch können Wörter, Kanji und Grammatik erscheinen, bevor ihre Grundlagen eingeführt wurden. Neue Inhalte sollten aus freigeschalteten Einheiten stammen; Wiederholungen dürfen davon unabhängig fällig werden.

### P1: Fortschritt schützen

6. **Es gibt keinen Export/Import und keine Synchronisierung.** Das Löschen von Browserdaten oder ein Gerätewechsel verliert den lokalen Stand. Als erster Schritt genügt ein versionierter JSON-Export mit geprüftem Import, Vorschau und expliziter Bestätigung vor dem Ersetzen. Anmeldung und Cloud-Sync können später folgen.

### P2: Lernfluss und Architektur vertiefen

7. **Sitzungen werden beim Verlassen verworfen.** Bereits bewertete Karten sind gespeichert, die restliche Warteschlange und die Sitzungszusammenfassung jedoch nicht. Wiederaufnahme einer begonnenen Einheit wäre sinnvoll.
8. **Wort und Beispielsatz teilen denselben Wiederholungszustand.** Das Erinnern eines Beispiels ist nicht zwangsläufig die Beherrschung des Zeichens oder anderer Lesungen. Separate Lernziele und stabile Karten-IDs vorsehen.
9. **Lesehilfen wirken uneinheitlich.** `RubyText` und Lesetexte berücksichtigen Einstellungen; Teile der Zeichenanalyse und Karteikarten zeigen Aussprache weiterhin direkt. Ein gemeinsames Darstellungsmodell sollte feste Lernhilfen, Hinweise und Benutzereinstellungen unterscheiden.
10. **Der lokale Store vereint viele Aufgaben.** Inhalte, Fortschritt, Präferenzen und gespeicherte Lesewörter sind in einem Store. Vor neuen größeren Features Selektoren, Warteschlangenplanung und Persistenz-Migrationen klar trennen; dafür ist kein Backend-Umbau nötig.
11. **Wochenhistorie lässt sich derzeit nicht rekonstruieren.** Der Store hat Summen und Tageswerte, aber kein vollständiges Lernprotokoll. Ein Wochenchart muss künftig echte Ereignisse verwenden und darf alte Tage nicht aus den Summen schätzen.

## Empfohlene Feature-Reihenfolge

| Reihenfolge | Feature                       | Konkreter Umfang                                                                         | Aufwand                        |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------ |
| 1           | Sichere Antworten und Inhalte | alternative Lesungen, ehrliche Schreibbewertung, geprüfte Beispielsätze                  | Mittel                         |
| 2           | Datensicherung                | versionierter Export/Import mit Validierung und Vorschau                                 | Klein bis mittel               |
| 3           | Erste geführte Lektion        | fünf Hiragana, Aussprache, Erkennen, aktive Eingabe, kurzer Abschluss                    | Mittel                         |
| 4           | Fehler gezielt wiederholen    | eigene Lernschritte, Fehlerrunde und nachvollziehbare nächste Termine                    | Mittel                         |
| 5           | Moderne Kana vervollständigen | Dakuten, Handakuten, Kombinationen und häufige Verwechslungen; historische ゐ/ゑ separat | Mittel                         |
| 6           | Hörverständnis                | Audio → Wort/Satz auswählen, danach Antwort und Erklärung                                | Mittel; Audioqualität beachten |
| 7           | Bessere Geschichten           | zusammenhängende N5-Texte mit Verständnisfragen und passenden Vokabeln                   | Mittel                         |
| 8           | Wochenrückblick               | echtes Lernprotokoll, gelernte Inhalte und persönliche Ziele                             | Mittel                         |
| 9           | Geräteübergreifend lernen     | optionales Konto und Sync mit Konfliktbehandlung                                         | Groß                           |

Der nächste sinnvolle Ausbau wäre **eine durchgehend gute erste Hiragana-Lektion nach Absicherung der Antworten und des Fortschritts**. Das verbessert den eigentlichen Lernerfolg stärker als zusätzliche Punkte, Ranglisten oder ein weiteres Dashboard.

## Prüfung der Änderungen

- Unit-Tests: 35 Tests in zehn Dateien, einschließlich neuer Fälle für fällige, frische und fehlgeschlagene Karten sowie die tatsächlich angezeigten Wiederholungsintervalle.
- TypeScript und Produktions-Build über `npm run build`: bestanden. ESLint über `npm run lint`: bestanden.
- Browserabläufe: Einstieg, direkte Grammatik-Navigation, Vokabelsuche, gespeicherte Bewertung, vollständige Selbstbewertungslektion, Eingabeantworten, Themenfilter, Einstellungen und abgebrochenes Zurücksetzen.
- Größenprüfung: 320 × 568, 390 × 844 und 1440 × 1000; zusätzlich dunkler Modus und Produktions-PWA mit Offline-Neuladen.
- Die beschriebenen Browserabläufe und der Produktions-Offlinebetrieb haben bestanden; keine unbehandelten JavaScript-Laufzeitfehler in diesen Prüfungen. Die oben aufgeführten offenen Inhalts- und Bewertungsprobleme bleiben davon getrennte Befunde. Physische iPhones, Safari und die Qualität einer japanischen Systemstimme benötigen weiterhin Tests auf echten Geräten.
