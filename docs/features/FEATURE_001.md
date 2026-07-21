# Feature 001 – Repository öffnen

## Ziel

Atelier soll ein lokales Repository auswählen, alle Markdown-Dateien darin einlesen und daraus echte Atelier-Objekte erzeugen.

## Benutzerablauf

1. Benutzer klickt auf **Repository öffnen**.
2. Electron öffnet einen Ordnerdialog.
3. Der Benutzer wählt den lokalen Ordner `atelier-os`.
4. Atelier durchsucht den Ordner rekursiv nach Markdown-Dateien.
5. Jede Markdown-Datei wird geparst.
6. Die erzeugten Objekte werden im `ObjectStore` gespeichert.
7. Das Dashboard zeigt echte Daten aus dem gewählten Repository.

## Technischer Ablauf

```text
App.tsx
  ↓
useRepository.ts
  ↓
Electron IPC
  ↓
main.cjs
  ↓
RepositoryService.ts
  ↓
MarkdownParser.ts
  ↓
ObjectStore.ts
  ↓
React UI
```

## Beteiligte Dateien

- `app/electron/main.cjs`
  - öffnet den nativen Ordnerdialog
  - liest Markdown-Dateien aus dem gewählten Ordner

- `app/electron/preload.cjs`
  - stellt eine sichere Schnittstelle zwischen Electron und React bereit

- `app/src/hooks/useRepository.ts`
  - verwaltet Laden, Fehler, Status und geladene Objekte

- `app/src/components/RepositoryPanel.tsx`
  - zeigt den Verbindungsstatus des Repositorys

- `app/src/types/repository.ts`
  - enthält die gemeinsamen Datentypen

- `app/src/engine/repository/RepositoryService.ts`
  - scannt das Repository

- `app/src/engine/parser/MarkdownParser.ts`
  - erzeugt aus Markdown ein `BaseObject`

- `app/src/services/ObjectStore.ts`
  - speichert die erzeugten Objekte zentral

- `app/src/App.tsx`
  - verbindet den Hook mit der Oberfläche

## Definition of Done

Feature 001 ist fertig, wenn:

- [ ] der Button **Repository öffnen** einen Ordnerdialog öffnet
- [ ] ein lokales Repository ausgewählt werden kann
- [ ] alle Markdown-Dateien erkannt werden
- [ ] Frontmatter und Wiki-Links geparst werden
- [ ] die Objekte im `ObjectStore` landen
- [ ] der Repository-Name in der Oberfläche angezeigt wird
- [ ] die Anzahl geladener Objekte sichtbar ist
- [ ] Fehler verständlich angezeigt werden
- [ ] keine Demo-Daten mehr nötig sind

## Nicht Bestandteil

- Graphdarstellung
- Suche
- Dateibearbeitung
- Git-Funktionen
- automatische Speicherung
- KI-Assistent

## Commit

```text
docs(feature): define repository open workflow
```
