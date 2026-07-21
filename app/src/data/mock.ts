export const recentObjects = [
  { type: 'Werk', title: 'Experiment Null', detail: '4 Szenen · 3 offene Entscheidungen' },
  { type: 'Szene', title: 'Szene 4', detail: 'Kontext zuletzt vor 2 Tagen geprüft' },
  { type: 'Synth', title: 'Roland SH-101', detail: '7 Sounds · 2 Demos' }
];

export const graphNodes = [
  { id: 'work', label: 'Experiment Null', x: 340, y: 180, type: 'work' },
  { id: 'scene4', label: 'Szene 4', x: 530, y: 110, type: 'scene' },
  { id: 'paper', label: 'Papier', x: 530, y: 250, type: 'motive' },
  { id: 'silence', label: 'Leere', x: 160, y: 110, type: 'motive' },
  { id: 'song', label: 'Demo 17', x: 160, y: 250, type: 'song' }
];

export const graphEdges = [
  ['work', 'scene4'],
  ['work', 'paper'],
  ['work', 'silence'],
  ['work', 'song'],
  ['scene4', 'paper']
];
