import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFullResolution, setShowFullResolution] = useState(false);
  const [dialogImageLoaded, setDialogImageLoaded] = useState(false);
  const [dialogImageError, setDialogImageError] = useState(false);

  const resolvedSrc = resolveProductImage(src);

  // Si cambia la imagen (p. ej. al elegir otra miniatura) se reinicia el estado de carga.
  const [lastSrc, setLastSrc] = useState(resolvedSrc);
  if (lastSrc !== resolvedSrc) {
    setLastSrc(resolvedSrc);
    setIsLoaded(false);
    setHasError(false);
  }

  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setDialogImageLoaded(false);
      setDialogImageError(false);
    } else {
      setShowFullResolution(false);
    }
  };

  if (hasError) {
    return (
      <div
        className={`${thumbnailClassName} bg-muted rounded-lg flex items-center justify-center`}
        role="img"
        aria-label={alt}
      >
        <div className="text-muted-foreground text-sm">{t('common.imageUnavailable')}</div>
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
      {/* Toda la imagen es pulsable para ampliarla (funciona también en pantallas táctiles) */}
      <div className="relative group">
        {!isLoaded && (
          <div
            className={`${thumbnailClassName} bg-muted animate-pulse rounded-lg flex items-center justify-center absolute inset-0`}
          >
            <div className="text-muted-foreground">{t('common.loading')}</div>
          </div>
        )}
        <button
          type="button"
          onClick={() => handleDialogOpen(true)}
          aria-label={`${t('common.enlargeImage')}: ${alt}`}
          className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
        >
          <img
            src={resolvedSrc}
            alt={alt}
            className={`${thumbnailClassName} ${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </button>
        {isLoaded && (
          <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/50 p-2 text-white">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-3">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">{t('common.zoomIn')}</DialogDescription>
          <div className="flex flex-col gap-3">
            <div
              className={`relative rounded-lg border bg-background ${
                showFullResolution ? 'h-[75vh] overflow-auto' : ''
              }`}
            >
              {!dialogImageLoaded && !dialogImageError && (
                <div className="w-full h-[50vh] bg-muted animate-pulse rounded-lg flex items-center justify-center">
                  <div className="text-muted-foreground">{t('common.loadingImage')}</div>
                </div>
              )}

              {dialogImageError && (
                <div className="w-full h-[50vh] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-muted-foreground text-center">
                    <p className="mb-2">{t('common.imageLoadError')}</p>
                    <p className="text-xs">{t('common.tryAgainLater')}</p>
                  </div>
                </div>
              )}

              <img
                src={resolvedSrc}
                alt={alt}
                className={`${
                  showFullResolution
                    ? 'max-w-none h-auto select-none cursor-zoom-out'
                    : 'w-full h-auto max-h-[75vh] object-contain select-none cursor-zoom-in'
                } ${!dialogImageLoaded ? 'hidden' : ''}`}
                onClick={() => setShowFullResolution((v) => !v)}
                draggable={false}
                onLoad={() => setDialogImageLoaded(true)}
                onError={() => setDialogImageError(true)}
              />
            </div>

            <div className="flex items-center justify-between gap-2 pr-8">
              <div className="text-xs text-muted-foreground">
                {showFullResolution ? t('common.zoomOut') : t('common.zoomIn')}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowFullResolution(true)}
                  disabled={showFullResolution || !dialogImageLoaded}
                  className="gap-2"
                >
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  {t('common.zoom')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDialogOpen(false)}
                  aria-label={t('common.close')}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
