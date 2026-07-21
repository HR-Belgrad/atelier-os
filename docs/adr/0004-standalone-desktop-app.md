# ADR 0004: Atelier wird als eigenständige Desktop-App entwickelt

## Status

Akzeptiert

## Kontext

Obsidian war als frühe Oberfläche und Referenz nützlich. Das eigentliche Produktziel ist jedoch eine eigenständige Anwendung, die kreative Objekte, Beziehungen, Medien und Kontext in einer gemeinsamen Oberfläche verwaltet.

## Entscheidung

Atelier OS wird als Desktop-App mit Electron, React und TypeScript aufgebaut. Markdown-Dateien und Git bleiben das offene Datenfundament. Obsidian wird nicht zur Laufzeit benötigt.

## Konsequenzen

- Die App kann schrittweise Obsidian-Funktionen ersetzen.
- Daten bleiben außerhalb der App lesbar.
- Der Wissensgraph wird ein Kernbestandteil der Anwendung.
- Obsidian-Kompatibilität bleibt optional, ist aber nicht das Produktzentrum.
