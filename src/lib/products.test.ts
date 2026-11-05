import { describe, expect, it } from 'vitest';
import { sortProductsWithShortsFirst } from './products';

const piece = (name: string, youtubeShortUrl?: string) => ({
  name,
  youtubeShortUrl,
  videoUrl: undefined,
});

describe('sortProductsWithShortsFirst', () => {
  it('pone primero las piezas con Short y conserva el orden dentro de cada grupo', () => {
    const sorted = sortProductsWithShortsFirst([
      piece('Sin video A'),
      piece('Con video B', 'https://www.youtube.com/shorts/vPoZClfWfpA'),
      piece('Sin video C'),
      piece('Con video D', 'https://www.youtube.com/embed/abcdefghijk'),
    ]);

    expect(sorted.map((product) => product.name)).toEqual([
      'Con video B',
      'Con video D',
      'Sin video A',
      'Sin video C',
    ]);
  });

  it('no trata como Short una URL vacía o rota', () => {
    const sorted = sortProductsWithShortsFirst([
      piece('Roto', 'https://example.com/no-es-youtube'),
      piece('Vacío', '   '),
      piece('Real', 'https://www.youtube.com/shorts/vPoZClfWfpA'),
    ]);

    expect(sorted.map((product) => product.name)).toEqual(['Real', 'Roto', 'Vacío']);
  });
});
