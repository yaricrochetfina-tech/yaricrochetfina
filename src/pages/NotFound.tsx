import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.warn('404: ruta inexistente:', location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-28 pb-12 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center max-w-md space-y-4">
        <p className="text-7xl font-playfair font-bold text-primary">404</p>
        <h1 className="text-3xl font-playfair font-semibold text-foreground">{t('notFound.title')}</h1>
        <p className="text-warm">{t('notFound.message')}</p>
        <Button asChild className="btn-hero">
          <Link to="/">{t('notFound.back')}</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
