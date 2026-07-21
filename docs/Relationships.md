# Beziehungen

Beziehungen werden benannt, damit ihre Bedeutung nicht nur aus einem Link erraten werden muss.

## Grundbeziehungen

| Beziehung | Bedeutung |
|---|---|
| `contains` | Objekt enthält ein anderes Objekt |
| `part_of` | Objekt ist Teil eines anderen Objekts |
| `uses` | Objekt verwendet ein Werkzeug, Instrument oder Material |
| `appears_in` | Motiv, Figur oder Ort taucht in einem Werk auf |
| `inspired_by` | Objekt wurde von einer Quelle inspiriert |
| `related_to` | allgemeine, schwache Beziehung |
| `decides` | Entscheidung legt einen Aspekt fest |
| `supersedes` | ersetzt eine frühere Entscheidung oder Variante |
| `contradicts` | steht in bewusstem Widerspruch |
| `requires_context` | muss vor Bearbeitung gelesen werden |
| `recorded_with` | Aufnahme wurde mit Gerät oder Mikrofon erstellt |
| `sounds_like` | klangliche Ähnlichkeit oder Referenz |

## Darstellung

Beziehungen können zunächst als YAML-Liste gespeichert werden:

```yaml
relations:
  - type: part_of
    target: work-experiment-null
  - type: requires_context
    target: decision-experiment-null-scene-4-opening
```

Zusätzlich dürfen Wiki-Links im Text verwendet werden. Die strukturierte Beziehung ist jedoch die maschinenlesbare Quelle.

## Regeln

- Beziehungen verweisen möglichst auf IDs, nicht nur auf Titel.
- Unspezifisches `related_to` wird sparsam verwendet.
- Eine neue Beziehungsart wird dokumentiert, bevor sie breit eingesetzt wird.
- Gegenseitige Beziehungen müssen nicht immer doppelt gespeichert werden, wenn sie ableitbar sind.
