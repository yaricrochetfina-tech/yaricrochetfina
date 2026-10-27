import { useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toYoutubeEmbedSrc } from '@/lib/youtube';

interface YouTubeShortButtonProps {
  url?: string | null;
  productName: string;
  variant?: 'default' | 'overlay';
  className?: string;
}

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.38.48A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12C4.5 20.4 12 20.4 12 20.4s7.5 0 9.38-.48a3 3 0 0 0 2.12-2.12A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8Z"
    />
    <path fill="hsl(var(--secondary))" d="M9.75 15.5v-7L16.2 12l-6.45 3.5Z" />
  </svg>
);

export const YouTubeShortButton = ({
  url,
  productName,
  variant = 'default',
  className,
}: YouTubeShortButtonProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const embedSrc = toYoutubeEmbedSrc(url);
  if (!embedSrc) return null;

  const label = t('products.watchShortAria', { name: productName });

  const openPlayer = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      {variant === 'overlay' ? (
        <button
          type="button"
          onClick={openPlayer}
          aria-label={label}
          className={cn('btn-youtube-short-overlay', className)}
        >
          <YouTubeIcon className="h-4 w-4 shrink-0" />
          <span>{t('products.watchShort')}</span>
        </button>
      ) : (
        <Button
          type="button"
          onClick={openPlayer}
          aria-label={label}
          className={cn(
            'tracking-wide shadow-earth transition-all duration-300 hover:shadow-warm hover:-translate-y-0.5',
            className
          )}
        >
          <YouTubeIcon className="h-4 w-4" />
          {t('products.watchShort')}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          overlayClassName="z-[70]"
          className="z-[80] flex w-[min(calc(100vw-1.5rem),24rem)] max-h-[95dvh] flex-col gap-3 overflow-hidden border-0 bg-secondary p-4 text-primary-foreground sm:rounded-2xl [&>button]:right-3 [&>button]:top-3 [&>button]:text-primary-foreground"
          onClick={(event) => event.stopPropagation()}
          onPointerDownOutside={(event) => event.stopPropagation()}
        >
          <DialogTitle className="pr-8 font-playfair text-lg leading-snug">
            {productName}
          </DialogTitle>
          <DialogDescription className="sr-only">{label}</DialogDescription>

          <div className="mx-auto aspect-[9/16] w-full max-w-[min(100%,calc(70dvh*9/16))] overflow-hidden rounded-xl bg-black">
            <iframe
              src={embedSrc}
              title={label}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>

          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="btn-hero w-full hover:!scale-100"
          >
            {t('products.keepShopping')}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
