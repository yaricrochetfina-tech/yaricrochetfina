import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="max-w-2xl w-full shadow-2xl border-primary/20">
        <CardContent className="pt-12 pb-8 px-6 md:px-12">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping bg-green-400 rounded-full opacity-20"></div>
                <CheckCircle className="h-24 w-24 text-green-500 relative" />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground">
                {t('payment.success.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('payment.success.subtitle')}
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-primary/5 rounded-lg p-6 space-y-4 border border-primary/10">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Package className="h-5 w-5" />
                <p className="font-medium">
                  {t('payment.success.orderNumber')}
                </p>
              </div>
              {sessionId && (
                <p className="text-sm text-muted-foreground font-mono bg-background/50 rounded px-3 py-2">
                  {sessionId.slice(0, 24)}...
                </p>
              )}
            </div>

            {/* Information Cards */}
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="bg-background/50 border border-border rounded-lg p-4 space-y-2">
                <Mail className="h-6 w-6 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {t('payment.success.emailSent')}
                </p>
              </div>
              <div className="bg-background/50 border border-border rounded-lg p-4 space-y-2">
                <Package className="h-6 w-6 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {t('payment.success.processing')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full btn-hero text-lg py-6"
              >
                {t('payment.success.continueShopping')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                {t('payment.success.thankYou')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;