import { useState, useEffect } from 'react';
import { Eye, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { resolveProductImage } from '@/lib/imageResolver';
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  thumbnailClassName?: string;
  enableFullView?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  thumbnailClassName = 'w-full h-64 object-cover',
  enableFullView = true,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [fullSrc, setFullSrc] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFullResolution, setShowFullResolution] = useState(false);

  useEffect(() => {
    // Create a canvas to generate optimized thumbnail
    const createThumbnail = (imageSrc: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set thumbnail dimensions (400px max for cards)
        const maxWidth = 400;
        const maxHeight = 400;

        let { width, height } = img as HTMLImageElement;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        // Create optimized thumbnail (lower quality for faster loading)
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setThumbnailSrc(thumbnailDataUrl);
        setFullSrc(imageSrc); // Keep original for full view
        setIsLoaded(true);
      };
      img.src = imageSrc;
    };

    const resolvedSrc = resolveProductImage(src);
    createThumbnail(resolvedSrc);
  }, [src]);

  if (!isLoaded) {
    return (
      <div className={`${thumbnailClassName} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!enableFullView) {
    return (
      <img
        src={thumbnailSrc}
        alt={alt}
        className={`${thumbnailClassName} ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <>
      {/* Imagen con botón "Ver" */}
      <div className="relative group">
        <img
          src={thumbnailSrc}
          alt={alt}
          className={`${thumbnailClassName} ${className}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver
          </Button>
        </div>
      </div>

      {/* Modal con Zoom visible siempre */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setShowFullResolution(false);
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-3">
          <div className="flex flex-col gap-3">
            {/* Contenedor de imagen */}
            <div
              className={`relative rounded-lg border bg-background ${
                showFullResolution ? 'h-[75vh] overflow-auto' : ''
              }`}
            >
              <img
                src={showFullResolution ? fullSrc : thumbnailSrc}
                alt={alt}
                className={
                  showFullResolution
                    ? 'max-w-none h-auto select-none cursor-zoom-out'
                    : 'w-full h-auto max-h-[75vh] object-contain select-none'
                }
                onClick={() => setShowFullResolution((v) => !v)}
                draggable={false}
              />
            </div>

            {/* Barra de acciones */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {showFullResolution
                  ? 'Arrastra para mover. Click para alejar.'
                  : 'Click en Zoom para ver a máxima resolución.'}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowFullResolution(true)}
                  disabled={showFullResolution}
                  className="gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  Zoom
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setShowFullResolution(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
