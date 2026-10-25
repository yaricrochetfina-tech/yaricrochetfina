import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

type Tree = { [key: string]: string | Tree };

const flatten = (tree: Tree, prefix = ''): string[] =>
  Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string' ? [prefix + key] : flatten(value, `${prefix}${key}.`)
  );

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(tsx?|ts)$/.test(name) && !/\.test\./.test(name) ? [full] : [];
  });

describe('traducciones', () => {
  const esKeys = new Set(flatten(es as Tree));
  const enKeys = new Set(flatten(en as Tree));
  const frKeys = new Set(flatten(fr as Tree));

  it('es, en y fr tienen exactamente las mismas claves', () => {
    expect([...esKeys].filter((k) => !enKeys.has(k))).toEqual([]);
    expect([...esKeys].filter((k) => !frKeys.has(k))).toEqual([]);
    expect([...enKeys].filter((k) => !esKeys.has(k))).toEqual([]);
    expect([...frKeys].filter((k) => !esKeys.has(k))).toEqual([]);
  });

  it('todas las claves usadas con t("...") en el código existen', () => {
    const files = walk(join(process.cwd(), 'src'));
    const missing: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/\bt\(\s*['"]([A-Za-z0-9_.]+)['"]/g)) {
        if (!esKeys.has(match[1])) missing.push(`${file.replace(process.cwd() + '/', '')}: ${match[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('el idioma por defecto y los textos principales no mezclan idiomas (es sin palabras en inglés típicas)', () => {
    const values = flatten(es as Tree).map(
      (key) => key.split('.').reduce<string | Tree>((acc, part) => (acc as Tree)[part], es as Tree) as string
    );
    const englishLeftovers = values.filter((v) => /\b(Loading|Cart|Checkout|Add to|Shipping|Sign in|Submit)\b/.test(v));
    expect(englishLeftovers).toEqual([]);
  });
});
