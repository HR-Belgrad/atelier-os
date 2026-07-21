# ADR 0001: Markdown als maßgebliche Datenquelle

- Status: Accepted
- Datum: 2026-07-21

## Kontext

Atelier OS soll langfristig nutzbar bleiben und darf nicht von einer einzelnen Anwendung abhängen.

## Entscheidung

Inhalte werden primär als Markdown mit YAML-Frontmatter gespeichert. Medien bleiben gewöhnliche Dateien.

## Folgen

### Positiv

- langfristig lesbar
- leicht versionierbar
- durch viele Programme bearbeitbar
- später von eigener App nutzbar

### Negativ

- komplexe Datenintegrität muss durch Regeln und Prüfwerkzeuge ergänzt werden
- manche Benutzeroberflächen müssen erst gebaut werden
