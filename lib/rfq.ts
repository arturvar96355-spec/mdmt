import { z } from 'zod';
import { site } from '@/content/site';

export const TASKS = ['Сцена', 'Выставка', 'Кровля', 'Подвес света', 'Другое'] as const;

export const rfqSchema = z.object({
  task: z.string().min(1, 'Выберите тип задачи'),
  w: z.string().optional(),
  d: z.string().optional(),
  h: z.string().optional(),
  load: z.string().optional(),
  date: z.string().optional(),
  place: z.string().optional(),
  company: z.string().min(2, 'Укажите компанию'),
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().regex(/^[+\d][\d\s()\-]{9,}$/, 'Укажите телефон полностью'),
  email: z.string().email('Проверьте e-mail'),
  config: z.string().optional(),
});
export type Rfq = z.infer<typeof rfqSchema>;

export function rfqText(v: Rfq, fileName?: string) {
  const size = [v.w, v.d, v.h].some(Boolean) ? `${v.w || '?'} × ${v.d || '?'} × ${v.h || '?'} м` : '—';
  return [
    'Запрос расчёта (концепт сайта)',
    `Задача: ${v.task}`,
    `Размеры (Ш × Г × В): ${size}`,
    `Нагрузка: ${v.load || '—'}`,
    `Сроки: ${v.date || '—'}`,
    `Город / площадка: ${v.place || '—'}`,
    v.config ? `Конфигурация: ${v.config}` : '',
    fileName ? `Чертёж: приложу к письму (${fileName})` : '',
    '',
    `Компания: ${v.company}`,
    `Контакт: ${v.name}, ${v.phone}, ${v.email}`,
  ].filter((x) => x !== '').join('\n');
}

export const mailtoHref = (text: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent('Запрос расчёта с сайта')}&body=${encodeURIComponent(text)}`;
