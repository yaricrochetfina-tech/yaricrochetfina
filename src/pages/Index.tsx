import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '@/components/HeroSection';
import { ProductsSection } from '@/components/ProductsSection';
import { GallerySection } from '@/components/GallerySection';
import { ProcessSection } from '@/components/ProcessSection';
import { AboutSection } from '@/components/AboutSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  const { hash } = useLocation();

  // Permite enlaces como /#contacto, también al llegar desde otras páginas.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <main className="pt-20">
      <HeroSection />
      <ProductsSection />
      <GallerySection />
      <ProcessSection />
      <AboutSection />
      <TestimonialsSection />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
