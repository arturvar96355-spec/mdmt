export const site = {
  name: 'МДМ-Технология',
  legalName: 'ООО «МДМ-Технология»',
  since: 2004,
  tagline: 'Конструкции, на которых стоят арены.',
  lead: 'Алюминиевые фермы, сцены и подъёмные системы. Собственное производство в Москве с 2004 года.',
  phone: '+7 (495) 975-40-50',
  phoneHref: 'tel:+74959754050',
  email: 'info@mdmt.ru',
  address: '107497, Москва, ул. Иркутская, д. 11, корп. 2',
  district: 'Гольяново, ВАО',
  route: 'От метро «Щёлковская» автобус 171 до остановки «2-й Иртышский проезд»',
  hours: 'пн–пт 9:00–17:30',
  hoursNote: 'суббота и воскресенье — выходные',
  mapUrl: 'https://yandex.com/maps/org/mdm_technology/1353001352/',
  reviewsUrl: 'https://yandex.com/maps/org/mdm_technology/1353001352/reviews/',
  gispUrl: 'https://gisp.gov.ru/pp719v2/pub/orgprod/1077761345420/',
  telegram: 'https://t.me/mdmtechnology',
  vk: 'https://vk.com/mdm_technology',
  rutube: 'https://rutube.ru/channel/30979390',
  whatsapp: null as string | null,
  requisites: { inn: '7718669785', kpp: '771801001', ogrn: '1077761345420' },
  rating: { value: 4.8, votes: 73, reviews: 15 },
  alloys: ['АД35 Т1', '6082 Т6'],
  conceptNote:
    'Концепт сайта, подготовлен для «МДМ-Технология» студией Kovagor. Не является официальным сайтом компании.',
} as const;

export const nav = [
  { label: 'Фермы', href: '/#catalog' },
  { label: 'Сцены', href: '/stages/' },
  { label: 'Проекты', href: '/projects/' },
  { label: 'Производство', href: '/production/' },
  { label: '3D-модели', href: '/#production' },
  { label: 'Контакты', href: '/contacts/' },
] as const;

export const ticker = [
  'Геленджик Арена',
  'Экспоцентр',
  'Дубна',
  'Завидово',
  '«Та самая Москва» 2025',
  'Ташир Арена, Ереван',
] as const;

export const facts = [
  { value: 2004, prefix: 'с ', unit: '', label: 'Производим в Москве', format: 'year' },
  { value: 7, prefix: '', unit: '', label: 'Серий алюминиевых ферм', format: 'num' },
  { value: 2, prefix: '', unit: '', label: 'Сплава: АД35 Т1 и 6082 Т6', format: 'num' },
  { value: 0, prefix: '', unit: 'ГИСП', label: 'Российский производитель в реестре', format: 'text' },
] as const;

export const alsoMake = [
  'Подиумы и сценические площадки',
  'Клиновые леса типа Layher',
  'Подъёмные системы и лебёдки',
  'Башни пультовые и звуковые',
  'Барьеры безопасности',
  'Кофры и кейсы',
  'Конструкции для монтажа экранов',
  'Тентовые конструкции',
] as const;
