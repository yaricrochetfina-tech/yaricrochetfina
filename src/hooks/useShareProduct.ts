import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getSiteUrl } from '@/lib/store';

/** Comparte un producto con la API nativa del móvil o, si no existe, copia el enlace. */
export const useShareProduct = (productId: string, title: string, text: string) => {
  const { t } = useTranslation();
  const [linkCopied, setLinkCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const share = useCallback(async () => {
    const url = `${getSiteUrl()}/colecciones?product=${encodeURIComponent(productId)}`;
    const shareData = { title, text, url };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // Si el usuario cancela no hacemos nada; si falla, se copia el enlace.
        if ((error as Error).name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast.success(t('products.linkCopied'));
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error(t('products.copyError'));
    }
  }, [productId, title, text, t]);

  return { share, linkCopied };
};
