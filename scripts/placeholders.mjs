import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'content';
const re = /\[[^\]\n]*(уточнить|от клиента|из каталога|подобрать|данные|политика)[^\]\n]*\]/gi;
let total = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
  const found = new Set(readFileSync(join(dir, f), 'utf8').match(re) ?? []);
  if (!found.size) continue;
  console.log(`\n${f}`);
  found.forEach((m) => console.log('  ' + m));
  total += found.size;
}
console.log(`\nВсего уникальных заглушек: ${total}`);
