import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
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
  alt: string;
  category: 'editorial' | 'runway';
  title: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: fashionShoot1,
    alt: 'Modelo llevando top de crochet naranja en sesión editorial',
    category: 'editorial',
    title: 'Editorial Magazine - Montreal'
  },
  {
    id: '2',
    src: fashionShoot2,
    alt: 'Modelo con poncho blanco de crochet en sesión de moda',
    category: 'editorial',
    title: 'Fashion Editorial'
  },
  {
    id: '3',
    src: fashionShoot3,
    alt: 'Vestido blanco de crochet en sesión editorial',
    category: 'editorial',
    title: 'Vestido Editorial'
  },
  {
    id: '4',
    src: fashionShoot4,
    alt: 'Top blanco de crochet con kimono amarillo',
    category: 'editorial',
    title: 'Sesión Boho Chic'
  },
  {
    id: '5',
    src: fashionShoot5,
    alt: 'Chaleco amarillo de crochet en sesión urbana',
    category: 'editorial',
    title: 'Street Style Editorial'
  },
  {
    id: '6',
    src: runwayShow1,
    alt: 'Modelo en pasarela con chaleco de crochet',
    category: 'runway',
    title: 'Desfile Montreal Fashion Week'
  },
  {
    id: '7',
    src: fashionShoot6,
    alt: 'Kimono rosa de crochet en sesión fashion',
    category: 'editorial',
    title: 'Kimono Collection'
  },
  {
    id: '8',
    src: fashionShoot7,
    alt: 'Cardigan de crochet en sesión al atardecer',
    category: 'editorial',
    title: 'Golden Hour Session'
  },
  {
    id: '9',
    src: runwayShow2,
    alt: 'Top halter de crochet en pasarela',
    category: 'runway',
    title: 'Runway Show Montreal'
  },
  {
    id: '10',
    src: fashionShoot8,
    alt: 'Shorts de crochet con blazer turquesa',
    category: 'editorial',
    title: 'Urban Fashion Editorial'
  }
];

export const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<'all' | 'editorial' | 'runway'>('all');

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === filter);

  return (
    <section id="galeria" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-section-title">Galería de Modelos</h2>
          <p className="text-warm text-lg max-w-3xl mx-auto">
            Descubre cómo nuestras creaciones cobran vida en editoriales de moda y desfiles internacionales. 
            Cada pieza cuenta una historia de elegancia y sofisticación artesanal.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('editorial')}
            className={`filter-chip ${filter === 'editorial' ? 'active' : ''}`}
          >
            Editoriales
          </button>
          <button
            onClick={() => setFilter('runway')}
            className={`filter-chip ${filter === 'runway' ? 'active' : ''}`}
          >
            Pasarelas
          </button>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-elegant"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-medium text-sm mb-1">
                    {image.title}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-primary/80 text-primary-foreground text-xs rounded-full">
                    {image.category === 'editorial' ? 'Editorial' : 'Pasarela'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured text */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              YariCrochetFina en los Medios
            </h3>
            <p className="text-warm leading-relaxed">
              Nuestras creaciones han sido destacadas en importantes revistas de moda y desfiles 
              internacionales en Montreal, demostrando que el crochet artesanal puede competir 
              en las más altas esferas de la moda contemporánea.
            </p>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 border-0">
          {selectedImage && (
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-contain"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {selectedImage.alt}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};