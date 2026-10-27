import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

export const NewsletterSection = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubscribing) return;

    const schema = z.object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email(t('newsletter.error'))
        .max(255, t('newsletter.emailMax')),
    });

    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(t('newsletter.invalidTitle'), { description: parsed.error.errors[0].message });
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: parsed.data.email }]);

      if (error) {
        if (error.code === '23505') {
          // Correo ya registrado: no es un error para el usuario.
          toast.info(t('newsletter.alreadyTitle'), { description: t('newsletter.alreadyDescription') });
          setEmail('');
        } else {
          console.error('Newsletter subscription error:', error);
          toast.error(t('newsletter.errorTitle'), { description: t('newsletter.errorDescription') });
        }
        return;
      }

      toast.success(t('newsletter.success'), { description: t('newsletter.successDescription') });
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(t('newsletter.errorTitle'), { description: t('newsletter.errorDescription') });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section id="comunidad" className="py-20 bg-gradient-earth relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-white/5 animate-pulse-warm"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-white/5 animate-pulse-warm"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-3/4 left-3/4 w-24 h-24 rounded-full bg-white/5 animate-pulse-warm"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="mb-10">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Mail className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h2 className="mb-3 font-playfair text-4xl font-bold text-white md:text-5xl">
              {t('newsletter.title')}
            </h2>
            <p className="mx-auto max-w-xl text-lg text-white/80">{t('newsletter.description')}</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto" noValidate>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    {t('newsletter.placeholder')}
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('newsletter.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 h-14 text-lg"
                    disabled={isSubscribing}
                    maxLength={255}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-white text-secondary hover:bg-white/90 h-14 px-8 text-lg font-semibold"
                >
                  {isSubscribing ? t('newsletter.subscribing') : t('newsletter.button')}
                </Button>
              </div>

              <p className="text-white/70 text-sm mt-4">📧 {t('newsletter.noSpam')}</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
