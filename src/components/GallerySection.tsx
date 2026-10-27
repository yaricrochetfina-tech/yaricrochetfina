import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import fashionShoot1 from '@/assets/fashion-shoot-1.jpg';
import fashionShoot2 from '@/assets/fashion-shoot-2.jpg';
import fashionShoot3 from '@/assets/fashion-shoot-3.jpg';
import fashionShoot4 from '@/assets/fashion-shoot-4.jpg';
import fashionShoot5 from '@/assets/fashion-shoot-5.jpg';
import fashionShoot6 from '@/assets/fashion-shoot-6.jpg';
import fashionShoot7 from '@/assets/fashion-shoot-7.jpg';
import fashionShoot8 from '@/assets/fashion-shoot-8.jpg';
import runwayShow1 from '@/assets/runway-show-1.jpg';
import runwayShow2 from '@/assets/runway-show-2.jpg';

interface GalleryImage {
  id: string;
  src: string;
  category: 'editorial' | 'runway';
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: fashionShoot1,
    category: 'editorial',
  },
  {
    id: '2',
    src: fashionShoot2,
    category: 'editorial',
  },
  {
    id: '3',
    src: fashionShoot3,
    category: 'editorial',
  },
  {
    id: '4',
    src: fashionShoot4,
    category: 'editorial',
  },
  {
    id: '5',
    src: fashionShoot5,
    category: 'editorial',
  },
  {
    id: '6',
    src: runwayShow1,
    category: 'runway',
  },
  {
    id: '7',
    src: fashionShoot6,
    category: 'editorial',
  },
  {
    id: '8',
    src: fashionShoot7,
    category: 'editorial',
  },
  {
    id: '9',
    src: runwayShow2,
    category: 'runway',
  },
  {
    id: '10',
    src: fashionShoot8,
    category: 'editorial',
  }
];

export const GallerySection = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<'all' | 'editorial' | 'runway'>('all');

  const filteredImages =
    filter === 'all' ? galleryImages : galleryImages.filter((image) => image.category === filter);

  const filters = [
    { value: 'all', label: t('gallery.allFilter') },
    { value: 'editorial', label: t('gallery.editorialFilter') },
    { value: 'runway', label: t('gallery.runwayFilter') },
  ] as const;

  return (
    <section id="galeria" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-section-title">{t('gallery.title')}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12" role="group" aria-label={t('gallery.title')}>
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`filter-chip ${filter === item.value ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => {
            const title = t(`gallery.items.${image.id}.title`);
            const alt = t(`gallery.items.${image.id}.alt`);
            return (
              <button
                type="button"
                key={image.id}
                className="group relative overflow-hidden rounded-lg text-left transform transition-all duration-300 hover:scale-105 hover:shadow-elegant focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setSelectedImage(image)}
                aria-label={`${t('gallery.imageDetail')}: ${title}`}
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  {/* Degradado en los bordes para difuminar el texto que traen algunas fotos */}
                  <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/80 to-transparent"></div>
                    <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-background/80 to-transparent"></div>
                    <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-background/80 to-transparent"></div>
                  </div>
                  <img
                    src={image.src}
                    alt={alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* En pantallas táctiles no existe "hover": el título se muestra siempre en la parte inferior */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/10 to-transparent md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-medium text-sm mb-1">{title}</h3>
                    <span className="inline-block px-2 py-1 bg-primary/80 text-primary-foreground text-xs rounded-full">
                      {image.category === 'editorial'
                        ? t('gallery.editorialFilter')
                        : t('gallery.runwayFilter')}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 border-0 [&>button]:text-white [&>button]:z-20">
          {selectedImage && (
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
              <img
                src={selectedImage.src}
                alt={t(`gallery.items.${selectedImage.id}.alt`)}
                className="w-full h-full object-contain"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <DialogTitle className="text-white text-xl font-semibold mb-2">
                  {t(`gallery.items.${selectedImage.id}.title`)}
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  {t(`gallery.items.${selectedImage.id}.alt`)}
                </DialogDescription>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
