import { artisanProcess } from '@/data/mockData';

export const ProcessSection = () => {
  return (
    <section id="proceso" className="py-20 bg-texture-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-section-title">Mi Proceso Artesanal</h2>
          <p className="text-warm text-lg max-w-3xl mx-auto">
            Cada pieza que creo es el resultado de un proceso cuidadoso que honra las tradiciones 
            ancestrales del tejido, combinando técnicas milenarias con mi creatividad contemporánea.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {artisanProcess.map((step, index) => (
            <div
              key={step.step}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Connection line */}
              {index < artisanProcess.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-px bg-gradient-to-r from-primary to-transparent z-0"></div>
              )}

              <div className="card-warm text-center relative z-10 hover:shadow-earth transition-all duration-300">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className="text-6xl mb-4 animate-pulse-warm">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="font-playfair text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-warm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quality assurance section */}
        <div className="mt-16 text-center">
          <div className="card-warm max-w-4xl mx-auto">
            <h3 className="font-playfair text-2xl font-semibold mb-4 text-foreground">
              Garantía de Calidad Artesanal
            </h3>
            <p className="text-warm text-lg leading-relaxed mb-6">
              Cada pieza pasa por mi riguroso control de calidad. Reviso cada puntada, 
              cada detalle, asegurándome de que cada creación refleje la excelencia y 
              el amor que pongo en mi trabajo.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Hecho a Mano</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">15+</div>
                <div className="text-sm text-muted-foreground">Años de Experiencia</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Piezas Creadas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Clientes Satisfechos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};