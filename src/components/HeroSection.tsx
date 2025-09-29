import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-secondary/20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-20 h-20 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center z-10">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          {/* Main logo and brand */}
          <div className="mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-gradient-warm flex items-center justify-center shadow-warm">
              <span className="text-4xl md:text-5xl">🌸</span>
            </div>
            <h1 className="text-hero mb-4">
              <span className="block font-playfair">YariCrochetFina</span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-playfair font-semibold text-primary mb-6">
              "La moda audaz en Crochet"
            </h2>
          </div>

          {/* Mission statement */}
          <p className="text-xl md:text-2xl text-warm mb-8 max-w-3xl mx-auto leading-relaxed">
            Me dedico a revivir las técnicas ancestrales, creando piezas únicas con estilos étnicos y retro. 
            Mi misión es valorar el trabajo manual y promover la compra local desde Montreal.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={() => scrollToSection('colecciones')}
              className="btn-hero text-lg px-8 py-4"
            >
              Explorar Colecciones
            </Button>
            <Button
              onClick={() => scrollToSection('sobre-yaritza')}
              className="btn-outline-warm text-lg px-8 py-4"
            >
              Conoce mi Historia
            </Button>
          </div>

          {/* Key values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-warm text-center">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-playfair text-xl font-semibold mb-2">Piezas Únicas</h3>
              <p className="text-warm">Hechas a mano con amor</p>
            </div>
            <div className="card-warm text-center">
              <div className="text-3xl mb-3">🕰️</div>
              <h3 className="font-playfair text-xl font-semibold mb-2">Técnicas Ancestrales</h3>
              <p className="text-warm">Tradición en cada puntada</p>
            </div>
            <div className="card-warm text-center">
              <div className="text-3xl mb-3">💖</div>
              <h3 className="font-playfair text-xl font-semibold mb-2">Cada Pieza Cuenta</h3>
              <p className="text-warm">Una historia única</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};