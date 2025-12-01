import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Validation schema with security constraints
const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().trim().email('Email inválido').max(255, 'El email no puede exceder 255 caracteres'),
  message: z.string().trim().min(1, 'El mensaje es requerido').max(1000, 'El mensaje no puede exceder 1000 caracteres')
});
export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod
    try {
      const validatedData = contactFormSchema.parse(formData);
      setIsSubmitting(true);

      // Save to database
      const {
        error
      } = await supabase.from('contact_messages').insert([{
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message
      }]);
      if (error) {
        toast({
          title: "Error al enviar",
          description: "No pudimos enviar tu mensaje. Por favor intenta de nuevo.",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto."
      });
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Error de validación",
          description: firstError.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-section-title">Hablemos de Tu Próxima Pieza</h2>
            <p className="text-warm text-lg max-w-3xl mx-auto">¿Tienes una idea especial? ¿Quieres un diseño personalizado? ¿Necesitas más información? </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in-up">
              <div className="card-warm">
                <h3 className="font-playfair text-2xl font-semibold mb-6 text-foreground">
                  Envíanos un Mensaje
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Nombre Completo
                    </label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Tu nombre" className="h-12" disabled={isSubmitting} maxLength={100} required />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" className="h-12" disabled={isSubmitting} maxLength={255} required />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mensaje
                    </label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Cuéntanos sobre tu proyecto, dudas o cualquier consulta..." className="min-h-[120px] resize-none" disabled={isSubmitting} maxLength={1000} required />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full btn-hero h-12">
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            
          </div>
        </div>
      </div>
    </section>;
};