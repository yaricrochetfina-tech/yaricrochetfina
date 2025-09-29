export const AboutSection = () => {
  return (
    <section id="sobre-yaritza" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Yaritza's photo and artistic frame */}
            <div className="animate-fade-in-up">
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto lg:mx-0 relative overflow-hidden rounded-2xl shadow-warm bg-gradient-warm p-8">
                  {/* Placeholder for Yaritza's photo - will be replaced with actual photo */}
                  <div className="w-full h-full bg-card rounded-xl flex items-center justify-center text-6xl">
                    👩‍🎨
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full animate-pulse-warm"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/20 rounded-full animate-pulse-warm" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-1/4 -right-8 text-4xl animate-float">🧶</div>
                <div className="absolute bottom-1/4 -left-8 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🌸</div>
              </div>
            </div>

            {/* Content */}
            <div className="animate-fade-in-up space-y-6">
              <div>
                <h2 className="text-section-title mb-4">Conoce a Yaritza Salgado Fina</h2>
                <h3 className="text-2xl font-playfair text-primary mb-6">
                  Artesana de Corazón, Creadora de Sueños
                </h3>
              </div>

              <div className="space-y-4 text-warm text-lg leading-relaxed">
                <p>
                  Desde pequeña, encontré en el tejido no solo una pasión, sino una forma de 
                  conectar con las tradiciones familiares que pasaron de generación en generación. 
                  Con más de 15 años de experiencia, he perfeccionado técnicas ancestrales que 
                  parecían perderse en el tiempo.
                </p>

                <p>
                  Mi misión va más allá de crear hermosas piezas de crochet y tricot: busco 
                  <strong className="text-primary"> revivir el valor del trabajo artesanal</strong> en 
                  una época donde lo hecho a mano se vuelve cada vez más preciado y significativo.
                </p>

                <p>
                  Cada una de mis creaciones refleja no solo habilidad técnica, sino también 
                  <strong className="text-primary"> creatividad, imaginación y destreza manual</strong> - 
                  esa habilidad que solo viene con años de dedicación y amor por mi oficio.
                </p>
              </div>

              {/* Key values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="card-warm">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold mb-1">Misión</h4>
                  <p className="text-sm text-warm">Valorar el trabajo manual y la compra local</p>
                </div>
                <div className="card-warm">
                  <div className="text-2xl mb-2">💡</div>
                  <h4 className="font-semibold mb-1">Visión</h4>
                  <p className="text-sm text-warm">Donde lo vintage se encuentra con lo contemporáneo</p>
                </div>
                <div className="card-warm">
                  <div className="text-2xl mb-2">❤️</div>
                  <h4 className="font-semibold mb-1">Pasión</h4>
                  <p className="text-sm text-warm">Técnicas ancestrales con amor moderno</p>
                </div>
                <div className="card-warm">
                  <div className="text-2xl mb-2">🌟</div>
                  <h4 className="font-semibold mb-1">Promesa</h4>
                  <p className="text-sm text-warm">Cada pieza cuenta una historia única</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="border-l-4 border-primary pl-6 italic text-xl text-foreground font-playfair mt-8">
                "En cada puntada hay un latido, en cada creación hay un alma. 
                Esto es más que crochet, es arte que abraza."
                <footer className="text-primary text-lg mt-2 not-italic">
                  — Yaritza Salgado Fina
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};