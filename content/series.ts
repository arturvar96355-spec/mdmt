export type SectionKey = 'flat' | 'triangle' | 'square' | 'rect' | 'trapezoid' | 'five' | 'arch';

export interface Section {
  key: SectionKey;
  label: string;
  code: string;
  note: string;
}

export const sections: Section[] = [
  { key: 'flat', label: 'Плоская', code: 'D', note: 'Две трубы-пояса, зигзаг между ними' },
  { key: 'triangle', label: 'Треугольная', code: 'T', note: 'Три пояса, равносторонняя схема' },
  { key: 'square', label: 'Квадратная', code: 'Q', note: 'Четыре пояса, универсальная схема' },
  { key: 'rect', label: 'Прямоугольная', code: 'R', note: 'Четыре пояса, вытянутое сечение' },
  { key: 'trapezoid', label: 'Трапециевидная', code: 'H', note: 'Четыре пояса, трапеция' },
  { key: 'five', label: 'Пятитрубная', code: '5', note: 'Пять поясов под повышенные нагрузки' },
  { key: 'arch', label: 'Арочная', code: 'A', note: 'Пояса по дуге для арок и крыш' },
];

export interface Series {
  code: string;
  slug: string;
  /** условный относительный размер для 3D, не миллиметры */
  scale: number;
  sections: SectionKey[];
  chordDiameter: number | null;
  wallThickness: number | null;
  maxSpan: number | null;
  loadTable: null;
  weightPerMeter: number | null;
  task: Array<'stage' | 'expo' | 'roof' | 'light'>;
}

const ALL: SectionKey[] = ['flat', 'triangle', 'square', 'rect', 'trapezoid', 'five', 'arch'];

const base = { chordDiameter: null, wallThickness: null, maxSpan: null, loadTable: null, weightPerMeter: null } as const;

export const series: Series[] = [
  { code: 'T23', slug: 't23', scale: 0.62, sections: ['flat', 'triangle', 'square'], task: ['light', 'expo'], ...base },
  { code: 'T29', slug: 't29', scale: 0.74, sections: ['flat', 'triangle', 'square', 'arch'], task: ['light', 'stage', 'expo'], ...base },
  { code: 'T39', slug: 't39', scale: 0.88, sections: ['flat', 'triangle', 'square', 'arch'], task: ['stage', 'light'], ...base },
  { code: 'T52', slug: 't52', scale: 1.0, sections: ['square', 'rect', 'arch'], task: ['stage', 'roof'], ...base },
  { code: 'T67', slug: 't67', scale: 1.14, sections: ['rect', 'trapezoid', 'five', 'square'], task: ['stage', 'roof'], ...base },
  { code: 'T75', slug: 't75', scale: 1.26, sections: ['square', 'five', 'arch'], task: ['roof'], ...base },
  { code: 'T100', slug: 't100', scale: 1.5, sections: ['rect', 'trapezoid', 'five', 'arch'], task: ['roof', 'stage'], ...base },
].map((s) => ({ ...s, sections: s.sections.length ? s.sections : ALL })) as Series[];

export const taskLabels = {
  stage: 'Сцена',
  expo: 'Выставка',
  roof: 'Кровля',
  light: 'Подвес света',
} as const;

export const DATA_PH = '[данные — из каталога МДМ]';
