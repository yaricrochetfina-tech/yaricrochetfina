import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, ingresa un email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Pronto recibirás nuestras novedades y ofertas especiales.",
      });
      setEmail('');
      setIsSubscribing(false);
    }, 1500);
  };

  return (
    <section className="py-20 bg-gradient-earth relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-white/5 animate-pulse-warm"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-white/5 animate-pulse-warm" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-3/4 w-24 h-24 rounded-full bg-white/5 animate-pulse-warm" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Mantente Conectada
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Sé la primera en conocer nuestras nuevas colecciones, técnicas exclusivas 
              y ofertas especiales creadas especialmente para amantes del crochet.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <Gift className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Ofertas Exclusivas</h3>
              <p className="text-sm text-white/80">Descuentos especiales solo para suscriptores</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="text-2xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">Nuevas Colecciones</h3>
              <p className="text-sm text-white/80">Sé la primera en ver nuestros diseños únicos</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="text-2xl mb-3">💡</div>
              <h3 className="font-semibold mb-2">Tips y Tutoriales</h3>
              <p className="text-sm text-white/80">Aprende técnicas ancestrales de crochet</p>
            </div>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Tu email aquí..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 h-14 text-lg"
                    disabled={isSubscribing}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-white text-secondary hover:bg-white/90 h-14 px-8 text-lg font-semibold"
                >
                  {isSubscribing ? 'Suscribiendo...' : 'Suscribirse'}
                </Button>
              </div>
              
              <p className="text-white/70 text-sm mt-4">
                📧 Prometemos no enviarte spam. Solo contenido valioso sobre crochet artesanal.
              </p>
            </div>
          </form>

          {/* Social proof */}
          <div className="mt-12 text-white/80">
            <p className="text-sm mb-4">Únete a más de 1,500 artesanas que ya reciben nuestro newsletter</p>
            <div className="flex justify-center space-x-4 text-xs">
              <span>⭐ María G. - "Contenido increíble"</span>
              <span>⭐ Ana R. - "Tips muy útiles"</span>
              <span>⭐ Carmen L. - "Ofertas exclusivas"</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};