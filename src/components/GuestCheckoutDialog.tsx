import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

const emailSchema = z.string().trim().email().max(255);

interface GuestCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => void;
  isProcessing: boolean;
}

export const GuestCheckoutDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isProcessing,
}: GuestCheckoutDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const closeCart = useCart((state) => state.closeCart);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(t('cart.guestCheckout.invalidEmail'));
      return;
    }

    onSubmit(result.data);
  };

  /** Cierra overlays y navega a login; navigate evita que Radix Dialog/Sheet cancelen el Link. */
  const handleLoginClick = () => {
    onOpenChange(false);
    closeCart();
    navigate('/auth?redirect=cart');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl">
            {t('cart.guestCheckout.title')}
          </DialogTitle>
          <DialogDescription>
            {t('cart.guestCheckout.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest-email">{t('contact.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="guest-email"
                type="email"
                placeholder={t('cart.guestCheckout.emailPlaceholder')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="pl-10"
                disabled={isProcessing}
                autoComplete="email"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full btn-hero"
            disabled={isProcessing || !email}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? t('common.processing') : t('cart.guestCheckout.continue')}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <span>{t('cart.guestCheckout.orLogin')} </span>
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={handleLoginClick}
              disabled={isProcessing}
            >
              {t('cart.guestCheckout.loginLink')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
