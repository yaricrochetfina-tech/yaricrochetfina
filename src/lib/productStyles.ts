const STYLE_BADGE_COLORS: Record<string, string> = {
  'Boho Chic': 'bg-primary/10 text-primary',
  Hippie: 'bg-accent/10 text-accent',
  Vintage: 'bg-secondary/10 text-secondary',
  'Shabby Chic': 'bg-pink-100 text-pink-700',
  Traditional: 'bg-amber-100 text-amber-700',
};

export const getStyleBadgeColor = (style: string): string =>
  STYLE_BADGE_COLORS[style] || 'bg-muted text-muted-foreground';
