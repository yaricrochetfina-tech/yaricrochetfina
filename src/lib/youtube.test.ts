import { describe, expect, it } from 'vitest';
import { extractYoutubeId, getProductShortUrl, toYoutubeEmbedSrc, toYoutubeShortUrl } from './youtube';

describe('youtube', () => {
  it('extrae el id de watch, embed, shorts y youtu.be', () => {
    expect(extractYoutubeId('https://www.youtube.com/watch?v=vPoZClfWfpA')).toBe('vPoZClfWfpA');
    expect(extractYoutubeId('https://www.youtube.com/embed/vPoZClfWfpA')).toBe('vPoZClfWfpA');
    expect(extractYoutubeId('https://www.youtube.com/shorts/-YE7otRaBus')).toBe('-YE7otRaBus');
    expect(extractYoutubeId('https://youtu.be/ToCRJFbC-fY')).toBe('ToCRJFbC-fY');
    expect(extractYoutubeId('vPoZClfWfpA')).toBe('vPoZClfWfpA');
  });

  it('devuelve undefined si no hay URL válida', () => {
    expect(extractYoutubeId(undefined)).toBeUndefined();
    expect(extractYoutubeId('')).toBeUndefined();
    expect(extractYoutubeId('https://example.com/video')).toBeUndefined();
  });

  it('normaliza a la URL de Shorts', () => {
    expect(toYoutubeShortUrl('https://www.youtube.com/embed/vPoZClfWfpA')).toBe(
      'https://www.youtube.com/shorts/vPoZClfWfpA'
    );
  });

  it('arma el embed interno con autoplay y bucle del mismo Short', () => {
    const src = toYoutubeEmbedSrc('https://www.youtube.com/shorts/vPoZClfWfpA');
    expect(src).toContain('https://www.youtube-nocookie.com/embed/vPoZClfWfpA?');
    expect(src).toContain('autoplay=1');
    expect(src).toContain('rel=0');
    expect(src).toContain('loop=1');
    expect(src).toContain('playlist=vPoZClfWfpA');
  });

  it('prefiere youtubeShortUrl y usa videoUrl como respaldo', () => {
    expect(
      getProductShortUrl({
        youtubeShortUrl: 'https://www.youtube.com/shorts/CNgjXKInZEg',
        videoUrl: 'https://www.youtube.com/embed/vPoZClfWfpA',
      })
    ).toBe('https://www.youtube.com/shorts/CNgjXKInZEg');
    expect(getProductShortUrl({ videoUrl: 'https://www.youtube.com/embed/vPoZClfWfpA' })).toBe(
      'https://www.youtube.com/shorts/vPoZClfWfpA'
    );
    expect(getProductShortUrl({})).toBeUndefined();
  });

  it('oculta el Short del Chaleco Corto Vintage Azul', () => {
    expect(
      getProductShortUrl({
        name: 'Chaleco Corto Vintage Azul',
        youtubeShortUrl: 'https://www.youtube.com/shorts/CNgjXKInZEg',
        videoUrl: 'https://www.youtube.com/embed/vPoZClfWfpA',
      })
    ).toBeUndefined();
  });
});
