export interface Project {
  slug: string;
  title: string;
  place: string;
  tag: string;
  full?: boolean;
}

export const projects: Project[] = [
  { slug: 'gelendzhik-arena', title: 'Геленджик Арена', place: 'Геленджик', tag: 'Трансформируемая сцена и подъёмный люк', full: true },
  { slug: 'tashir-arena', title: 'Ташир Арена', place: 'Ереван', tag: 'Сценические конструкции' },
  { slug: 'expocentre', title: 'Экспоцентр', place: 'Москва', tag: 'Выставочные конструкции' },
  { slug: 'dubna', title: 'Дубна', place: 'Московская область', tag: 'Сценический комплекс' },
  { slug: 'zavidovo', title: 'Завидово', place: 'Тверская область', tag: 'Сценический комплекс' },
  { slug: 'ta-samaya-moskva', title: '«Та самая Москва» 2025', place: 'Москва', tag: 'Интерактивная выставка' },
];

export const gelendzhik = {
  task: '[задача — от клиента]',
  solution: 'Оригинальная система подъёмного люка сцены для опускания пожарного занавеса в большом концертном зале.',
  result: '[результат, цифры — от клиента]',
};
