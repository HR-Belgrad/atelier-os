# Objektmodell

## Grundstruktur

Jedes zentrale Objekt besitzt mindestens:

```yaml
---
id: stable-object-id
type: object-type
title: Menschlich lesbarer Titel
status: idea
created: 2026-07-21
updated: 2026-07-21
tags: []
relations: []
---
```

## Kernfelder

| Feld | Bedeutung |
|---|---|
| `id` | stabile, eindeutige Identität |
| `type` | Objekttyp |
| `title` | sichtbarer Name |
| `status` | Arbeitsstand |
| `created` | Erstellungsdatum |
| `updated` | letztes bewusstes Aktualisierungsdatum |
| `tags` | ergänzende, nicht-hierarchische Schlagworte |
| `relations` | benannte Beziehungen zu anderen Objekten |

## Statuswerte

Vorläufige gemeinsame Statuswerte:

- `idea`
- `active`
- `experiment`
- `draft`
- `canonical`
- `published`
- `archived`

Nicht jeder Objekttyp muss jeden Status verwenden.

## Objekttypen

### Kreative Werke

- `work`
- `scene`
- `chapter`
- `album`
- `song`
- `demo`
- `lyric`
- `film`
- `audio-play`
- `essay`

### Inhaltliche Elemente

- `character`
- `place`
- `motif`
- `atmosphere`
- `theme`

### Musik und Klang

- `sound`
- `preset`
- `sample`
- `field-recording`
- `synthesizer`
- `effect-device`
- `instrument`
- `microphone`
- `plugin`
- `reference-track`

### Wissen

- `knowledge`
- `method`
- `tool`
- `source`
- `artist`
- `book`
- `film-reference`

### Prozess und Gedächtnis

- `idea`
- `decision`
- `variant`
- `question`
- `memory-point`
- `task`

## Kontextblock

Zentrale Arbeitsobjekte besitzen einen Abschnitt:

```markdown
## Vor Bearbeitung lesen

- [[Werkübersicht]]
- [[Kanon]]
- [[Entscheidungen]]
- [[Historie]]
- [[Offene Fragen]]
```

Dieser Block ist keine Dekoration. Er definiert den Mindestkontext für weitere Arbeit.

## IDs

IDs sollen:

- stabil bleiben, auch wenn sich Titel ändern,
- ausschließlich Kleinbuchstaben, Zahlen und Bindestriche verwenden,
- den Typ erkennbar machen,
- aber nicht jede Ordnerhierarchie abbilden.

Beispiele:

```text
work-experiment-null
scene-experiment-null-004
motif-paper
synth-roland-sh-101
decision-experiment-null-scene-4-opening
```
