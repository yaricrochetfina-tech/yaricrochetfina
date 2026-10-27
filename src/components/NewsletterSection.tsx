import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Gift, Sparkles, Lightbulb } from 'lucide-react';
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
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Mail className="h-8 w-8 text-white" aria-hidden="true" />
            </div>

            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              {t('newsletter.title')}
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">{t('newsletter.description')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Gift className="h-8 w-8 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold mb-2">{t('newsletter.offersTitle')}</h3>
              <p className="text-sm text-white/80">{t('newsletter.offersDescription')}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Sparkles className="h-8 w-8 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold mb-2">{t('newsletter.newTitle')}</h3>
              <p className="text-sm text-white/80">{t('newsletter.newDescription')}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Lightbulb className="h-8 w-8 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold mb-2">{t('newsletter.secretsTitle')}</h3>
              <p className="text-sm text-white/80">{t('newsletter.secretsDescription')}</p>
            </div>
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
