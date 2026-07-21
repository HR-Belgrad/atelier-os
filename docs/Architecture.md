# Architektur

## Zielbild

Atelier OS trennt Daten, Arbeitsoberfläche und spätere Automatisierung.

```text
Datenebene
Markdown + YAML + Medien
        │
        ▼
Arbeitsoberfläche
zunächst Obsidian
        │
        ▼
Versionierung
Git / GitHub
        │
        ▼
spätere Dienste
Suche, Assistent, Companion, API
```

## Datenebene

Die maßgeblichen Inhalte liegen in Dateien, nicht in einer proprietären Datenbank.

### Markdown

Markdown enthält Texte, Abschnitte, Listen, Links und eingebettete Medien.

### YAML-Frontmatter

YAML enthält strukturierte Metadaten, etwa:

```yaml
---
id: scene-experiment-null-004
type: scene
title: Szene 4
status: active
work: work-experiment-null
---
```

### Medien

Audio, Bilder und PDFs werden als Dateien gespeichert und aus Markdown referenziert.

## Obsidian

Obsidian ist zunächst die Arbeitsoberfläche, nicht die eigentliche Datenbank.

Verwendete Funktionen:

- Wiki-Links
- Backlinks
- eingebettete Medien
- Templates
- Dataview
- Graph-Ansichten

Die Daten sollen auch ohne Obsidian lesbar bleiben.

## Git und GitHub

Git speichert Änderungen und ermöglicht die Rückkehr zu früheren Ständen. GitHub dient als entfernte Sicherung und gemeinsame Projektoberfläche.

GitHub ist nicht die einzige mögliche Plattform. Das Repository soll grundsätzlich auch mit GitLab, Forgejo oder rein lokalem Git funktionieren.

## Schichten

### Atelier Core

Definiert Manifest, Objektmodell, Beziehungen, IDs, Status und Regeln.

### Vault

Enthält die tatsächlichen kreativen Inhalte, Dashboards, Templates und Medienverweise.

### Assistant

Ein späterer Assistent liest den dokumentierten Projektkontext, bevor er Vorschläge macht oder Änderungen vorbereitet.

### Companion

Eine spätere eigene Oberfläche kann dieselben Dateien lesen und bearbeiten.

## Nicht-Ziele der aktuellen Architekturphase

- keine eigene Desktop-App
- keine Cloud-Datenbank
- keine automatische KI-Veränderung der Vault
- keine komplexe API
- kein Graph-Datenbankserver
