# МДМ-Технология — сайт-концепт

Статический концепт сайта для ООО «МДМ-Технология». Не является официальным сайтом, закрыт от индексации.

## Запуск

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # статическая сборка в out/
npx serve out        # проверить сборку локально
npm run placeholders # список заглушек [... — уточнить]
```

Стек: Next.js 16 (`output: 'export'`), React 19, TypeScript, Tailwind v4, three.js + React Three Fiber, GSAP ScrollTrigger, Lenis, Motion.

## Где что лежит

- `content/` — все тексты, контакты, серии, проекты, отзывы. Заглушки — в квадратных скобках.
- `lib/truss/` — генератор фермы (`build.ts`) и изометрия для SVG-фолбэка.
- `components/three/` — 3D-сцены (hero, сборка/портал, конфигуратор).
- `components/sections/` — секции главной. `components/widgets/Configurator.tsx` — конфигуратор.
- `docs/` — бриф, дизайн, план, решения.

## Деплой

**Cloudflare Pages:** подключить репозиторий, build command `npm run build`, output directory `out`.
**GitHub Pages (резерв):** собрать `out/`; если сайт не в корне домена, добавить `basePath` в `next.config.ts`.
После деплоя открыть сайт с мобильного интернета из России без VPN и проверить шрифты, формы, 3D.

## Принципы

Ничего не выдумывать: неизвестное — видимая заглушка. Размеры в 3D условные («Схема. Размеры условные»). Нет чужих логотипов, цен и нагрузок.
