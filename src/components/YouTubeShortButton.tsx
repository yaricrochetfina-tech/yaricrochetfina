import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toYoutubeShortUrl } from '@/lib/youtube';

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
  const href = toYoutubeShortUrl(url);
  if (!href) return null;

  const label = t('products.watchShortAria', { name: productName });
  const stopCardClick = (event: MouseEvent) => event.stopPropagation();

  if (variant === 'overlay') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        onClick={stopCardClick}
        className={cn('btn-youtube-short-overlay', className)}
      >
        <YouTubeIcon className="h-4 w-4 shrink-0" />
        <span>{t('products.watchShort')}</span>
      </a>
    );
  }

  return (
    <Button asChild className={cn('tracking-wide shadow-earth transition-all duration-300 hover:shadow-warm hover:-translate-y-0.5', className)}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} onClick={stopCardClick}>
        <YouTubeIcon className="h-4 w-4" />
        {t('products.watchShort')}
      </a>
    </Button>
  );
};
