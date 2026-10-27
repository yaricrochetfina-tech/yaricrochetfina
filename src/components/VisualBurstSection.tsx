import { useTranslation } from 'react-i18next';
import { VISUAL_BURST_ROW_A, VISUAL_BURST_ROW_B } from '@/lib/visualBurst';

const MarqueeRow = ({
  images,
  reverse,
  alts,
}: {
  images: readonly string[];
  reverse?: boolean;
  alts: string[];
}) => {
  const loop = [...images, ...images];
  return (
    <div className="overflow-hidden">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`}>
        {loop.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={alts[index % alts.length]}
            className="h-40 w-32 shrink-0 rounded-xl object-cover shadow-soft sm:h-52 sm:w-40 md:h-64 md:w-48"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export const VisualBurstSection = () => {
  const { t } = useTranslation();
  const alt = t('visualBurst.alt');

  return (
    <section className="bg-card-warm py-6 md:py-10" aria-label={t('visualBurst.label')}>
      <div className="flex flex-col gap-3 md:gap-4">
        <MarqueeRow images={VISUAL_BURST_ROW_A} alts={[alt]} />
        <MarqueeRow images={VISUAL_BURST_ROW_B} reverse alts={[alt]} />
      </div>
    </section>
  );
};
