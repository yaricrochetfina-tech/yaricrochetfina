import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { HeroSection } from '@/components/HeroSection';
import { VisualBurstSection } from '@/components/VisualBurstSection';
import { CollectionsExploreSection } from '@/components/CollectionsExploreSection';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const product = searchParams.get('product');
    if (!product) return;
    navigate(`/colecciones?product=${encodeURIComponent(product)}`, { replace: true });
  }, [navigate, searchParams]);

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <main>
      <HeroSection />
      <VisualBurstSection />
      <CollectionsExploreSection />
      <AboutSection />
      <Footer />
    </main>
  );
};

export default Index;
