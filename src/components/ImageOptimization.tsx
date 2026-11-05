import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
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
  thumbnailClassName = 'w-full h-64 object-contain object-center',
  enableFullView = true,
}: OptimizedImageProps) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFullResolution, setShowFullResolution] = useState(false);
  const [dialogImageLoaded, setDialogImageLoaded] = useState(false);
  const [dialogImageError, setDialogImageError] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    left: number;
    top: number;
    moved: boolean;
  } | null>(null);

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

  // Al ampliar, el recorte queda centrado para poder recorrer la prenda en las dos direcciones.
  useEffect(() => {
    if (!showFullResolution || !dialogImageLoaded) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const frame = requestAnimationFrame(() => {
      viewport.scrollLeft = Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2);
      viewport.scrollTop = Math.max(0, (viewport.scrollHeight - viewport.clientHeight) / 2);
    });
    return () => cancelAnimationFrame(frame);
  }, [showFullResolution, dialogImageLoaded]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!showFullResolution || event.pointerType !== 'mouse' || event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: event.currentTarget.scrollLeft,
      top: event.currentTarget.scrollTop,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    event.currentTarget.scrollLeft = drag.left - dx;
    event.currentTarget.scrollTop = drag.top - dy;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) suppressClickRef.current = true;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleViewportClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setShowFullResolution((value) => !value);
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
        <DialogContent className="max-h-[92dvh] w-[min(calc(100vw-1rem),64rem)] max-w-5xl overflow-hidden p-3">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">{t('common.zoomIn')}</DialogDescription>
          <div className="flex min-h-0 flex-col gap-3">
            <div
              ref={viewportRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={handleViewportClick}
              className={`relative h-[min(68dvh,720px)] w-full rounded-lg border bg-card-warm ${
                showFullResolution
                  ? 'cursor-grab overflow-auto overscroll-contain [touch-action:pan-x_pan-y] active:cursor-grabbing'
                  : 'flex items-center justify-center overflow-hidden'
              }`}
            >
              {!dialogImageLoaded && !dialogImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse rounded-lg">
                  <div className="text-muted-foreground">{t('common.loadingImage')}</div>
                </div>
              )}

              {dialogImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
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
                    ? 'block h-auto w-[200%] max-w-none select-none'
                    : 'h-auto max-h-full w-auto max-w-full object-contain select-none'
                } ${!dialogImageLoaded ? 'hidden' : ''}`}
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
