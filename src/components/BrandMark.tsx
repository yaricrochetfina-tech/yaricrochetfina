import logoYariCrochet from '@/assets/logo-yari-crochet.png';

type BrandMarkProps = {
  alt: string;
  className?: string;
};

export const BrandMark = ({ alt, className = 'h-12 w-12' }: BrandMarkProps) => (
  <span className={`brand-mark ${className}`}>
    <img src={logoYariCrochet} alt={alt} />
  </span>
);
