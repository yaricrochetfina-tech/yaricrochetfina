import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import type { ProductStyle } from '@/types';

interface TestimonialItem {
  key: 'maria' | 'ana' | 'carmen';
  rating: number;
  style: ProductStyle;
}

// Los textos y nombres están en los archivos de traducción (testimonialsData.*)
const testimonials: TestimonialItem[] = [
  { key: 'maria', rating: 5, style: 'Boho Chic' },
  { key: 'ana', rating: 5, style: 'Vintage' },
  { key: 'carmen', rating: 5, style: 'Hippie' },
];

const STYLE_CARD_COLORS: Record<ProductStyle, string> = {
  'Boho Chic': 'border-primary/20 bg-primary/5',
  Hippie: 'border-accent/20 bg-accent/5',
  Vintage: 'border-secondary/20 bg-secondary/5',
  'Shabby Chic': 'border-pink-200 bg-pink-50',
  Traditional: 'border-amber-200 bg-amber-50',
};

const STYLE_EMOJI: Record<ProductStyle, string> = {
  'Boho Chic': '🌙',
  Hippie: '🌻',
  Vintage: '🌹',
  'Shabby Chic': '🦋',
  Traditional: '🏺',
};

export const TestimonialsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="testimonios" className="py-20 bg-texture-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-section-title">{t('testimonials.title')}</h2>
          <p className="text-warm text-lg max-w-3xl mx-auto">{t('testimonials.description')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <figure
              key={testimonial.key}
              className={`card-warm relative border-2 ${STYLE_CARD_COLORS[testimonial.style]} animate-fade-in-up hover:shadow-earth transition-all duration-300`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl text-primary/30 mb-2 font-serif" aria-hidden="true">
                “
              </div>

              <div className="flex space-x-1 mb-4" role="img" aria-label={`${testimonial.rating} / 5`}>
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star
                    key={starIndex}
                    aria-hidden="true"
                    className={`h-5 w-5 ${
                      starIndex < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-warm text-lg leading-relaxed mb-6 italic">
                {t(`testimonialsData.${testimonial.key}.message`)}
              </blockquote>

              <figcaption className="pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">
                  {t(`testimonialsData.${testimonial.key}.name`)}
                </span>
                <span className="text-right">
                  <span className="block text-xs text-muted-foreground">
                    {t('testimonials.collection')}
                  </span>
                  <span className="block text-sm font-medium text-primary">
                    {t(`styles.${testimonial.style}`)}
                  </span>
                </span>
              </figcaption>

              <div className="absolute top-4 right-4 text-2xl opacity-20" aria-hidden="true">
                {STYLE_EMOJI[testimonial.style]}
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
