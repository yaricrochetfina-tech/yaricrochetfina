import { useState } from 'react';
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
  const [hasError, setHasError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFullResolution, setShowFullResolution] = useState(false);

  const resolvedSrc = resolveProductImage(src);

  if (hasError) {
    return (
      <div className={`${thumbnailClassName} bg-muted rounded-lg flex items-center justify-center`}>
        <div className="text-muted-foreground text-sm">Imagen no disponible</div>
      </div>
    );
  }

  if (!enableFullView) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        className={`${thumbnailClassName} ${className}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <>
      {/* Imagen con botón "Ver" */}
      <div className="relative group">
        {!isLoaded && !hasError && (
          <div className={`${thumbnailClassName} bg-muted animate-pulse rounded-lg flex items-center justify-center absolute inset-0`}>
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        )}
        <img
          src={resolvedSrc}
          alt={alt}
          className={`${thumbnailClassName} ${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
        {isLoaded && (
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
        )}
      </div>

      {/* Modal con Zoom */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setShowFullResolution(false);
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-3">
          <div className="flex flex-col gap-3">
            <div
              className={`relative rounded-lg border bg-background ${
                showFullResolution ? 'h-[75vh] overflow-auto' : ''
              }`}
            >
              <img
                src={resolvedSrc}
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
