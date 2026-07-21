# Atelier OS

Atelier OS ist ein langfristiges, dateibasiertes Kreativsystem für Literatur, Musik, Hörspiel, Film, Wissen und künstlerische Forschung.

Der Kern besteht aus offenen Markdown-Dateien, stabilen Objekt-IDs und nachvollziehbaren Beziehungen. Obsidian dient zunächst als Arbeitsoberfläche; Git verwaltet die Geschichte des Projekts. Eine spätere eigene App soll auf denselben Daten aufbauen können.

## Leitidee

Atelier OS soll nicht nur fertige Werke speichern, sondern auch Entscheidungen, Varianten, Begründungen, Quellen, Audio, offene Fragen und den Kontext, der vor weiterer Arbeit gelesen werden muss.

Das zentrale Problem, das Atelier OS löst:

> Gute Entscheidungen und Zusammenhänge dürfen nicht verloren gehen, nur weil ein Chat, eine Person oder eine Anwendung sie vergisst.

## Prinzipien

- **Offene Daten:** Markdown und gewöhnliche Mediendateien.
- **Lokale Kontrolle:** Die Daten gehören der Nutzerin oder dem Nutzer.
- **Objekte statt loser Notizen:** Werke, Szenen, Songs, Figuren, Motive, Sounds und Wissen erhalten stabile Identitäten.
- **Beziehungen statt Ordnerdenken:** Verknüpfungen tragen Bedeutung.
- **Nachvollziehbarkeit:** Entscheidungen und Änderungen erhalten Historie.
- **Kontext vor Bearbeitung:** Für jedes zentrale Objekt wird festgelegt, was vor der Arbeit gelesen werden muss.
- **Explizites Speichern:** Dauerhafte Übernahme erfolgt bewusst und dokumentiert.

## Status

Dieses Repository befindet sich in **Sprint 0: Repository Foundation**.

Sprint 0 umfasst ausschließlich:

- Projektbeschreibung
- Manifest
- Architekturgrundlagen
- Objektmodell
- erste Entscheidungsprotokolle
- Roadmap
- Spezifikation für den nächsten nutzbaren Vault-Stand

Die eigentliche Obsidian-Vault wird in einem folgenden Sprint integriert.

## Geplante Struktur

```text
atelier-os/
├── docs/                 Architektur, Manifest, Spezifikationen
├── vault/                spätere Obsidian-Vault
├── examples/             Beispielprojekte, zunächst Experiment Null
├── scripts/              spätere Prüf- und Hilfsskripte
├── .github/              Issue-Vorlagen und Projektpflege
├── README.md
├── CHANGELOG.md
├── ROADMAP.md
└── LICENSE
```

## Arbeitsweise

1. Eine Idee wird diskutiert.
2. Eine Entscheidung wird dokumentiert.
3. Die Änderung wird einer Version oder dem Backlog zugeordnet.
4. Erst danach wird gebaut.
5. Jede relevante Änderung erhält einen Git-Commit.

## Aktueller Fokus

Der nächste Meilenstein ist eine belastbare, täglich nutzbare Obsidian-Vault mit:

- zentralem Dashboard
- Dataview-Abfragen
- Templates
- Objektkarten
- Kontextblöcken
- Beispielprojekt **Experiment Null**, insbesondere **Szene 4**

## Lizenz

Der Inhalt ist derzeit privat/proprietär vorgesehen. Siehe [LICENSE](LICENSE).
