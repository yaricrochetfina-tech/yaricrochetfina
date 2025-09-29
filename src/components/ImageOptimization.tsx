import { useState, useEffect } from 'react';
import { Eye, Download, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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

  const ImageComponent = () => (
    <img
      src={thumbnailSrc}
      alt={alt}
      className={`${thumbnailClassName} ${className} transition-all duration-300 hover:scale-105`}
      loading="lazy"
    />
  );

  if (!enableFullView) {
    return <ImageComponent />;
  }

  return (
    <div className="relative group">
      <ImageComponent />
      
      {/* Zoom button - always visible on mobile, hover on desktop */}
      <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/95 hover:bg-white text-foreground shadow-lg border border-primary/20"
            >
              <Maximize2 className="h-4 w-4 mr-1" />
              + Zoom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] p-2">
            <div className="relative">
              <img
                src={fullSrc}
                alt={alt}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              
              {/* Download button for high resolution */}
              <div className="absolute top-4 right-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = fullSrc;
                    link.download = `${alt.replace(/\s/g, '_').toLowerCase()}.jpg`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar HD
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Full view overlay for center button */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none">
        <div className="pointer-events-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white/95 hover:bg-white text-foreground shadow-xl border border-primary/30"
              >
                <Maximize2 className="h-5 w-5 mr-2" />
                Ver en Alta Resolución
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] p-2">
              <div className="relative">
                <img
                  src={fullSrc}
                  alt={alt}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                />
                
                {/* Download button for high resolution */}
                <div className="absolute top-4 right-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = fullSrc;
                      link.download = `${alt.replace(/\s/g, '_').toLowerCase()}.jpg`;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descargar HD
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};