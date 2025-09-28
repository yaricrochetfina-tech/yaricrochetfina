import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, ingresa un email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-section-title">Hablemos de Tu Próxima Pieza</h2>
            <p className="text-warm text-lg max-w-3xl mx-auto">
              ¿Tienes una idea especial? ¿Quieres un diseño personalizado? ¿Necesitas más información? 
              Estamos aquí para ayudarte a crear la pieza perfecta para ti.
            </p>
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
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="h-12"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="h-12"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mensaje
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Cuéntanos sobre tu proyecto, dudas o cualquier consulta..."
                      className="min-h-[120px] resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-hero h-12"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="animate-fade-in-up space-y-8">
              <div className="card-warm">
                <h3 className="font-playfair text-2xl font-semibold mb-6 text-foreground">
                  Información de Contacto
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-warm">yaritza@yaricrochetfina.com</p>
                      <p className="text-sm text-muted-foreground">Te respondemos en menos de 24 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Teléfono</h4>
                      <p className="text-warm">+1 (555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">WhatsApp disponible</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Ubicación</h4>
                      <p className="text-warm">Atelier YariCrochetFina</p>
                      <p className="text-sm text-muted-foreground">Envíos a toda la región</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Horarios de Atención</h4>
                      <p className="text-warm">Lunes a Viernes: 9:00 - 18:00</p>
                      <p className="text-warm">Sábados: 10:00 - 16:00</p>
                      <p className="text-sm text-muted-foreground">Domingos cerrado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="card-warm">
                <h3 className="font-playfair text-xl font-semibold mb-4 text-foreground">
                  Preguntas Frecuentes
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">¿Hacen diseños personalizados?</h4>
                    <p className="text-sm text-warm">Sí, nos encanta crear piezas únicas según tus ideas y medidas.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">¿Cuánto tiempo toma un pedido?</h4>
                    <p className="text-sm text-warm">Entre 1-3 semanas dependiendo de la complejidad de la pieza.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">¿Envían a domicilio?</h4>
                    <p className="text-sm text-warm">Sí, realizamos envíos seguros con empaque especial para cuidar tu pieza.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};