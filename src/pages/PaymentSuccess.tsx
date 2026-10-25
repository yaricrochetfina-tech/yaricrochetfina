import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Package, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { normalizeLanguage } from '@/i18n/config';
import { formatPrice, getCountryName } from '@/lib/store';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  products: { name: string; image: string } | null;
}

interface Order {
  id: string;
  customer_name: string | null;
  total_amount: number;
  shipping_cost: number;
  shipping_country: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const MAX_POLL_ATTEMPTS = 15;
const POLL_INTERVAL_MS = 2000;

const PaymentSuccess = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const clearCart = useCart((state) => state.clearCart);
  const sessionId = searchParams.get('session_id');
  const token = searchParams.get('token');
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const hasReference = Boolean(sessionId || token);

  // El carrito solo se vacía si venimos realmente de Stripe (con session_id).
  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  // El webhook de Stripe puede tardar unos segundos en crear el pedido: se consulta varias veces.
  const { data: order } = useQuery({
    queryKey: ['order', sessionId ?? token],
    enabled: hasReference,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (query) =>
      query.state.data || query.state.dataUpdateCount + query.state.errorUpdateCount >= MAX_POLL_ATTEMPTS
        ? false
        : POLL_INTERVAL_MS,
    queryFn: async (): Promise<Order | null> => {
      const { data, error } = await supabase.functions.invoke('get-order', {
        body: sessionId ? { session_id: sessionId } : { token },
      });
      if (error) {
        // 404: el pedido aún no existe (el webhook no ha terminado). Se vuelve a intentar.
        return null;
      }
      return (data?.order as Order) ?? null;
    },
  });

  const orderNumber = order ? order.id.slice(0, 8).toUpperCase() : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-28 pb-12 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="max-w-2xl w-full shadow-2xl border-primary/20">
        <CardContent className="pt-12 pb-8 px-6 md:px-12">
          {!hasReference ? (
            <div className="text-center space-y-6">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" aria-hidden="true" />
              <p className="text-muted-foreground">{t('payment.success.invalidLink')}</p>
              <Button asChild className="btn-hero">
                <Link to="/">{t('payment.success.continueShopping')}</Link>
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping bg-green-400 rounded-full opacity-20"></div>
                  <CheckCircle className="h-24 w-24 text-green-500 relative" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground">
                  {t('payment.success.title')}
                </h1>
                <p className="text-xl text-muted-foreground">{t('payment.success.subtitle')}</p>
              </div>

              {/* Resumen del pedido */}
              <div className="bg-primary/5 rounded-lg p-6 space-y-4 border border-primary/10 text-left">
                <div className="flex items-center justify-center space-x-2 text-primary">
                  <Package className="h-5 w-5" aria-hidden="true" />
                  <p className="font-medium">{t('payment.success.orderNumber')}</p>
                </div>

                {order ? (
                  <>
                    <p className="text-center font-mono text-lg">#{orderNumber}</p>

                    <div className="space-y-2 pt-2 border-t border-primary/10">
                      <h2 className="font-semibold text-sm">{t('payment.success.details')}</h2>
                      <ul className="space-y-2 text-sm">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex justify-between gap-4">
                            <span>
                              {item.products?.name ?? '—'}{' '}
                              <span className="text-muted-foreground">
                                ({t('payment.success.quantityShort')} {item.quantity})
                              </span>
                            </span>
                            <span className="whitespace-nowrap">
                              {formatPrice(item.price_at_purchase * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <dl className="space-y-1 text-sm pt-2 border-t border-primary/10">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">{t('payment.success.subtotal')}</dt>
                        <dd>{formatPrice(order.total_amount - order.shipping_cost)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">
                          {t('payment.success.shipping')} ({getCountryName(order.shipping_country, language)})
                        </dt>
                        <dd>{formatPrice(order.shipping_cost)}</dd>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-1">
                        <dt>{t('payment.success.total')}</dt>
                        <dd className="text-primary">{formatPrice(order.total_amount)}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <div className="text-center space-y-2" role="status">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" aria-hidden="true" />
                    <p className="text-sm font-medium">{t('payment.success.confirming')}</p>
                    <p className="text-xs text-muted-foreground">{t('payment.success.confirmingHint')}</p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="bg-background/50 border border-border rounded-lg p-4 space-y-2">
                  <Mail className="h-6 w-6 text-primary mx-auto" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">{t('payment.success.emailSent')}</p>
                </div>
                <div className="bg-background/50 border border-border rounded-lg p-4 space-y-2">
                  <Package className="h-6 w-6 text-primary mx-auto" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">{t('payment.success.processing')}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button asChild className="w-full btn-hero text-lg py-6">
                  <Link to="/">
                    {t('payment.success.continueShopping')}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>

                <p className="text-sm text-muted-foreground">{t('payment.success.thankYou')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default PaymentSuccess;
