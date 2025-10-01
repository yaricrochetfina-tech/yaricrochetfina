import { useState, useEffect } from 'react';
import { Eye, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
  enableFullView = true 
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
        
        // Set thumbnail dimensions (400px max width for cards)
        const maxWidth = 400;
        const maxHeight = 400;
        
        let { width, height } = img;
        
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

    createThumbnail(src);
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-2">
          <div className="relative">
            <img
              src={showFullResolution ? fullSrc : thumbnailSrc}
              alt={alt}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              {!showFullResolution && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowFullResolution(true)}
                  className="gap-2 bg-background/90 backdrop-blur"
                >
                  <Maximize2 className="h-4 w-4" />
                  Zoom
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsDialogOpen(false);
                  setShowFullResolution(false);
                }}
                className="bg-background/90 backdrop-blur"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};