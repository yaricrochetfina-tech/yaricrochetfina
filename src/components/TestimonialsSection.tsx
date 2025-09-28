import { testimonials } from '@/data/mockData';
import { Star } from 'lucide-react';

export const TestimonialsSection = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStyleColor = (style: string) => {
    const colors = {
      'Boho Chic': 'border-primary/20 bg-primary/5',
      'Hippie': 'border-accent/20 bg-accent/5',
      'Vintage': 'border-secondary/20 bg-secondary/5',
      'Shabby Chic': 'border-pink-200 bg-pink-50',
      'Traditional': 'border-amber-200 bg-amber-50',
    };
    return colors[style as keyof typeof colors] || 'border-muted bg-muted/5';
  };

  return (
    <section className="py-20 bg-texture-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-section-title">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-warm text-lg max-w-3xl mx-auto">
            Cada testimonio es una historia de satisfacción, una sonrisa tejida en palabras. 
            Estas son las voces de quienes han encontrado en nuestras creaciones algo especial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`card-warm border-2 ${getStyleColor(testimonial.style)} animate-fade-in-up hover:shadow-earth transition-all duration-300`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote icon */}
              <div className="text-4xl text-primary/30 mb-4 font-serif">"</div>
              
              {/* Rating stars */}
              <div className="flex space-x-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Testimonial text */}
              <p className="text-warm text-lg leading-relaxed mb-6 italic">
                {testimonial.message}
              </p>

              {/* Customer info */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">Cliente verificada</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Colección</div>
                    <div className="text-sm font-medium text-primary">{testimonial.style}</div>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 text-2xl opacity-20">
                {testimonial.style === 'Boho Chic' && '🌙'}
                {testimonial.style === 'Hippie' && '🌻'}
                {testimonial.style === 'Vintage' && '🌹'}
                {testimonial.style === 'Shabby Chic' && '🦋'}
                {testimonial.style === 'Traditional' && '🏺'}
              </div>
            </div>
          ))}
        </div>

        {/* Customer satisfaction stats */}
        <div className="mt-16 text-center">
          <div className="card-warm max-w-4xl mx-auto">
            <h3 className="font-playfair text-2xl font-semibold mb-8 text-foreground">
              Nuestra Promesa de Satisfacción
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-3xl font-bold text-primary mb-1">4.9/5</div>
                <div className="text-sm text-muted-foreground">Calificación Promedio</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2">💝</div>
                <div className="text-3xl font-bold text-primary mb-1">250+</div>
                <div className="text-sm text-muted-foreground">Clientes Felices</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2">🔄</div>
                <div className="text-3xl font-bold text-primary mb-1">89%</div>
                <div className="text-sm text-muted-foreground">Clientes Recurrentes</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2">🎁</div>
                <div className="text-3xl font-bold text-primary mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Recomiendan la Marca</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};