import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

const PaymentCancel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openCart } = useCart();

  const handleBackToCart = () => {
    openCart();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-destructive/5">
      <Card className="max-w-2xl w-full shadow-2xl border-destructive/20">
        <CardContent className="pt-12 pb-8 px-6 md:px-12">
          <div className="text-center space-y-6">
            {/* Cancel Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl"></div>
                <XCircle className="h-24 w-24 text-destructive relative" />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground">
                {t('payment.cancel.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('payment.cancel.subtitle')}
              </p>
            </div>

            {/* Information */}
            <div className="bg-destructive/5 rounded-lg p-6 border border-destructive/10">
              <p className="text-muted-foreground">
                {t('payment.cancel.message')}
              </p>
            </div>

            {/* Reassurance */}
            <div className="bg-background/50 border border-border rounded-lg p-4 space-y-2">
              <ShoppingBag className="h-6 w-6 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                {t('payment.cancel.cartPreserved')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <Button 
                onClick={handleBackToCart} 
                className="w-full btn-hero text-lg py-6"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('payment.cancel.backToCart')}
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="w-full text-lg py-6"
              >
                {t('payment.cancel.continueShopping')}
              </Button>
            </div>

            {/* Help Message */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                {t('payment.cancel.needHelp')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;