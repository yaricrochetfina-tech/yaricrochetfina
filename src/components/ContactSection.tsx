import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { normalizeLanguage } from '@/i18n/config';
import { CONTACT_EMAIL } from '@/lib/store';

export const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const schema = z.object({
      name: z.string().trim().min(1, t('contact.nameRequired')).max(100, t('contact.nameMax')),
      email: z.string().trim().email(t('contact.emailInvalid')).max(255, t('contact.emailMax')),
      message: z.string().trim().min(1, t('contact.messageRequired')).max(1000, t('contact.messageMax')),
    });

    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      toast.error(t('contact.validationTitle'), { description: parsed.error.errors[0].message });
      return;
    }
    const validatedData = parsed.data;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([
        { name: validatedData.name, email: validatedData.email, message: validatedData.message },
      ]);

      if (error) {
        console.error('Contact message error:', error);
        toast.error(t('contact.error'), { description: t('contact.errorDescription') });
        return;
      }

      // El mensaje ya está guardado; el envío de correos no debe bloquear al usuario.
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: { ...validatedData, language: normalizeLanguage(i18n.resolvedLanguage || i18n.language) },
      });
      if (emailError) {
        console.error('Email sending failed:', emailError);
      }

      toast.success(t('contact.success'), { description: t('contact.successDescription') });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(t('contact.error'), { description: t('contact.errorDescription') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-section-title">{t('contact.heading')}</h2>
            <p className="text-warm text-lg max-w-3xl mx-auto">{t('contact.intro')}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="card-warm hover:!translate-y-0">
                <h3 className="font-playfair text-2xl font-semibold mb-6 text-foreground">
                  {t('contact.formTitle')}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.name')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.namePlaceholder')}
                      className="h-12"
                      disabled={isSubmitting}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.email')}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.emailPlaceholder')}
                      className="h-12"
                      disabled={isSubmitting}
                      maxLength={255}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.message')}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.messagePlaceholder')}
                      className="min-h-[120px] resize-none"
                      disabled={isSubmitting}
                      maxLength={1000}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full btn-hero h-12">
                    {isSubmitting ? t('contact.sending') : t('contact.send')}
                  </Button>
                </form>
              </div>
            </div>

            <aside className="card-warm hover:!translate-y-0 h-fit space-y-6">
              <h3 className="font-playfair text-2xl font-semibold text-foreground">
                {t('contact.infoTitle')}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground hover:text-primary break-all">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="text-foreground">{t('contact.location')}</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">{t('contact.responseTime')}</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};
