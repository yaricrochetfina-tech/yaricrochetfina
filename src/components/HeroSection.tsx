import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/BrandMark';

const HERO_VIDEO_ID = 'FXOMRCV1M4A';
const HERO_VIDEO_SRC = `https://www.youtube-nocookie.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_VIDEO_ID}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`;

export const HeroSection = () => {
  const { t } = useTranslation();

  const scrollToCollections = () => {
    document.getElementById('colecciones')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden text-white">
      <div className="hero-video-wrap" aria-hidden="true">
        <iframe
          src={HERO_VIDEO_SRC}
          title=""
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          className="hero-video-frame"
        />
      </div>
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pt-16 text-center">
        <BrandMark alt={t('header.logoAlt')} className="mb-6 h-32 w-32 md:h-44 md:w-44" />
        <p className="mb-8 font-playfair text-3xl font-bold leading-tight drop-shadow-lg md:text-5xl">
          {t('hero.tagline')}
        </p>
        <Button onClick={scrollToCollections} className="btn-hero text-lg">
          {t('hero.cta')}
        </Button>
      </div>
    </section>
  );
};
