# Atelier OS – Ontologie

Version: 1.0  
Status: Living Document

---

# Zweck

Diese Ontologie beschreibt die fachliche Welt von Atelier OS.

Sie legt fest:

- welche Objekttypen existieren,
- welche Eigenschaften sie besitzen,
- welche Beziehungen erlaubt sind,
- und welche Regeln für den Wissensgraphen gelten.

Die Ontologie ist die verbindliche Grundlage für:

- Markdown-Parser,
- Object Store,
- Graph Builder,
- Suche,
- Benutzeroberfläche,
- und den späteren Assistant.

---

# Grundprinzip

Alles in Atelier ist ein Objekt.

Ein Objekt besitzt mindestens:

- eine stabile ID,
- einen Typ,
- einen Titel,
- einen Pfad,
- Metadaten,
- Beziehungen,
- und eine Historie.

Dateien dienen nur der Speicherung.

Der Wissensgraph arbeitet ausschließlich mit Objekten und Beziehungen.

---

# Basismodell

## BaseObject

Pflichtfelder:

```yaml
id: string
type: string
title: string
path: string
```

Optionale Felder:

```yaml
status: string
summary: string
tags: string[]
aliases: string[]
createdAt: string
modifiedAt: string
```

Beziehungen:

```yaml
relations:
  - type: string
    targetId: string
    label: string
```

---

# Objekttypen

## work

Ein eigenständiges kreatives Werk.

Beispiele:

- Roman
- Theaterstück
- Hörspiel
- Film
- Kunstprojekt

Typische Eigenschaften:

- status
- genre
- medium
- startDate
- completionDate

Erlaubte Beziehungen:

- contains → scene
- contains → chapter
- contains → figure
- contains → motif
- contains → decision
- uses → sound
- uses → synth
- inspired-by → reference
- related-to → knowledge

---

## scene

Ein Abschnitt eines Werkes mit eigenem dramaturgischem oder erzählerischem Zweck.

Typische Eigenschaften:

- order
- setting
- pointOfView
- state

Erlaubte Beziehungen:

- part-of → work
- contains → figure
- contains → motif
- takes-place-in → location
- uses → sound
- refers-to → knowledge
- follows → scene
- precedes → scene

---

## chapter

Ein struktureller Abschnitt eines Werkes.

Erlaubte Beziehungen:

- part-of → work
- contains → scene
- contains → motif
- follows → chapter
- precedes → chapter

---

## figure

Eine Figur, Person oder handelnde Instanz.

Typische Eigenschaften:

- role
- description
- biography

Erlaubte Beziehungen:

- appears-in → work
- appears-in → scene
- knows → figure
- loves → figure
- opposes → figure
- influences → figure
- associated-with → motif
- located-at → location

---

## motif

Ein wiederkehrendes Motiv, Bild, Thema oder Symbol.

Beispiele:

- Papier
- Leere
- Zeit
- Erinnerung

Erlaubte Beziehungen:

- appears-in → work
- appears-in → scene
- appears-in → song
- related-to → motif
- inspired-by → reference
- associated-with → figure
- associated-with → sound

---

## song

Ein musikalisches Werk oder Songentwurf.

Typische Eigenschaften:

- duration
- key
- tempo
- stage

Erlaubte Beziehungen:

- part-of → album
- uses → sound
- uses → synth
- uses → effect
- contains → lyric
- inspired-by → reference
- associated-with → motif
- related-to → work

---

## album

Eine Sammlung musikalischer Werke.

Erlaubte Beziehungen:

- contains → song
- inspired-by → reference
- associated-with → motif

---

## lyric

Ein Liedtext oder Textfragment.

Erlaubte Beziehungen:

- part-of → song
- associated-with → motif
- refers-to → figure
- refers-to → location

---

## sound

Ein Klang, Preset, Sample oder Sounddesign-Objekt.

Typische Eigenschaften:

- source
- format
- duration
- category

Erlaubte Beziehungen:

- created-with → synth
- processed-by → effect
- used-in → song
- used-in → scene
- inspired-by → reference
- associated-with → motif

---

## synth

Ein Synthesizer oder Klangerzeuger.

Typische Eigenschaften:

- manufacturer
- model
- ownership
- serialNumber

Erlaubte Beziehungen:

- creates → sound
- used-in → song
- used-in → work
- processed-by → effect

---

## effect

Ein Effektgerät, Pedal, Plugin oder Effektprozess.

Typische Eigenschaften:

- manufacturer
- model
- category

Erlaubte Beziehungen:

- processes → sound
- used-in → song
- used-with → synth

---

## knowledge

Ein Wissensartikel, Konzept oder theoretischer Inhalt.

Beispiele:

- Kunsttheorie
- Dramaturgie
- Harmonielehre
- Psychoakustik

Erlaubte Beziehungen:

- related-to → knowledge
- applies-to → work
- applies-to → scene
- applies-to → song
- inspired-by → reference
- contradicts → knowledge
- supports → decision

---

## decision

Eine dokumentierte Entscheidung mit Begründung.

Typische Eigenschaften:

- date
- status
- rationale
- consequences

Erlaubte Beziehungen:

- applies-to → work
- applies-to → scene
- applies-to → song
- based-on → knowledge
- supersedes → decision
- rejects → idea

---

## idea

Ein noch nicht entschiedener Einfall oder Ansatz.

Typische Eigenschaften:

- status
- source
- priority

Erlaubte Beziehungen:

- applies-to → work
- applies-to → scene
- applies-to → song
- inspired-by → reference
- becomes → decision
- related-to → motif

---

## location

Ein realer, fiktiver oder symbolischer Ort.

Erlaubte Beziehungen:

- appears-in → work
- appears-in → scene
- contains → figure
- associated-with → motif

---

## reference

Eine externe Inspirations- oder Wissensquelle.

Beispiele:

- Buch
- Film
- Album
- Künstler
- Bild
- Webseite

Typische Eigenschaften:

- referenceType
- author
- year
- source

Erlaubte Beziehungen:

- inspires → work
- inspires → song
- inspires → scene
- supports → knowledge
- related-to → reference

---

## tool

Ein Werkzeug, Verfahren oder Arbeitsmittel.

Beispiele:

- dramaturgisches Werkzeug
- Schreibmethode
- Recording-Technik
- Analyseverfahren

Erlaubte Beziehungen:

- used-in → work
- used-in → scene
- used-in → song
- based-on → knowledge

---

# Standardbeziehungen

## Strukturell

- contains
- part-of
- follows
- precedes

## Kreativ

- inspired-by
- uses
- created-with
- processed-by
- associated-with

## Inhaltlich

- related-to
- refers-to
- applies-to
- supports
- contradicts

## Figurenbezogen

- appears-in
- knows
- loves
- opposes
- influences

## Entscheidungsbezogen

- based-on
- supersedes
- rejects
- becomes

---

# Beziehungsregeln

## 1. Beziehungen verwenden IDs

Beziehungen verweisen immer auf stabile Objekt-IDs.

Beispiel:

```yaml
relations:
  - type: contains
    targetId: scene:experiment-null:scene-4
```

Nicht erlaubt:

```yaml
relations:
  - type: contains
    target: Szene 4
```

---

## 2. Titel dürfen sich ändern

IDs bleiben stabil, auch wenn sich der Titel eines Objekts ändert.

---

## 3. Beziehungen sind gerichtet

```text
work contains scene
```

ist nicht dasselbe wie:

```text
scene contains work
```

Gegenbeziehungen können abgeleitet werden.

Beispiel:

- contains ↔ part-of
- follows ↔ precedes
- inspires ↔ inspired-by

---

## 4. Wiki-Links sind Komfortsyntax

Ein Wiki-Link wie:

```text
[[Szene 4]]
```

kann vom Parser in eine echte Beziehung aufgelöst werden.

Die endgültige Beziehung arbeitet jedoch mit IDs.

---

## 5. Unbekannte Typen bleiben erhalten

Objekte mit unbekanntem Typ werden als:

```text
unknown
```

eingelesen.

Sie dürfen nicht verworfen werden.

---

## 6. Die Ontologie ist erweiterbar

Neue Objekttypen und Beziehungen dürfen ergänzt werden.

Sie müssen jedoch:

- dokumentiert,
- versioniert,
- und rückwärtskompatibel eingeführt werden.

---

# Mindestanforderung an ein Objekt

Ein Objekt ist gültig, wenn mindestens vorhanden sind:

```yaml
id: string
type: string
title: string
path: string
```

---

# Beispiel

```yaml
---
id: scene:experiment-null:scene-4
type: scene
title: Szene 4
status: active
tags:
  - experiment-null
  - papier
relations:
  - type: part-of
    targetId: work:experiment-null
  - type: associated-with
    targetId: motif:papier
  - type: uses
    targetId: synth:roland-sh-101
---
```

---

# Validierungsregeln

Atelier soll später prüfen:

- ist die ID eindeutig?
- existiert das Ziel einer Beziehung?
- ist die Beziehung für diesen Typ erlaubt?
- ist der Objekttyp bekannt?
- sind Pflichtfelder vorhanden?
- existieren widersprüchliche Beziehungen?

Fehlerhafte Objekte werden angezeigt, aber nicht still verworfen.

---

# Architekturbezug

```text
Markdown
  ↓
MarkdownParser
  ↓
BaseObject
  ↓
OntologyValidator
  ↓
ObjectStore
  ↓
GraphBuilder
  ↓
UI
```

---

# Leitsatz

> Die Ontologie beschreibt nicht, wo Informationen liegen.

> Sie beschreibt, was sie bedeuten.
