import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { toast } from 'sonner';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const openCart = useCart((state) => state.openCart);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectToCart = searchParams.get('redirect') === 'cart';

  /** Tras autenticarse, vuelve a la tienda y reabre el carrito si venía del checkout. */
  const finishAuth = () => {
    navigate('/');
    if (redirectToCart) {
      // ShoppingCart está montado a nivel de App; openCart restaura el drawer con los ítems persistidos.
      openCart();
    }
  };

  // Si ya hay sesión iniciada no tiene sentido mostrar el formulario.
  useEffect(() => {
    if (!authLoading && user) {
      if (redirectToCart) openCart();
      navigate('/', { replace: true });
    }
  }, [authLoading, user, navigate, openCart, redirectToCart]);

  const mapAuthError = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('invalid login credentials')) return t('auth.invalidCredentials');
    if (lower.includes('email not confirmed')) return t('auth.emailNotConfirmed');
    if (lower.includes('already registered')) return t('auth.alreadyRegistered');
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const schema = z.object({
      email: z.string().trim().email(t('auth.emailInvalid')).max(255),
      password: z.string().min(6, t('auth.passwordMin')).max(72),
      name: z.string().trim().min(1, t('auth.nameRequired')).max(100).optional(),
    });

    const parsed = schema.safeParse({ email, password, name: isLogin ? undefined : name });
    if (!parsed.success) {
      toast.error(t('auth.validationTitle'), { description: parsed.error.errors[0].message });
      return;
    }
    const validated = parsed.data;

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validated.email,
          password: validated.password,
        });

        if (error) {
          toast.error(t('auth.loginError'), { description: mapAuthError(error.message) });
          return;
        }

        toast.success(t('auth.welcome'), { description: t('auth.welcomeDescription') });
        finishAuth();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: validated.email,
          password: validated.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: validated.name },
          },
        });

        const switchToLogin = () => {
          setIsLogin(true);
          setPassword('');
          setName('');
        };

        // Correo ya registrado: error explícito, o respuesta "fantasma" sin identities (anti-enumeración de Supabase).
        const alreadyRegistered =
          (!!error && error.message.toLowerCase().includes('already registered')) ||
          (!error && !!data.user && (data.user.identities?.length ?? 0) === 0);

        if (alreadyRegistered) {
          toast.error(t('auth.alreadyRegisteredTitle'), {
            description: t('auth.alreadyRegistered'),
          });
          switchToLogin();
          return;
        }

        if (error) {
          toast.error(t('auth.signupError'), { description: mapAuthError(error.message) });
          return;
        }

        if (data.session) {
          toast.success(t('auth.accountCreated'), { description: t('auth.accountCreatedDescription') });
          finishAuth();
        } else {
          // Con la confirmación por correo activada no hay sesión hasta que se confirma la cuenta.
          toast.success(t('auth.confirmEmailTitle'), { description: t('auth.confirmEmailDescription') });
          switchToLogin();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(t('common.error'), { description: t('common.unexpectedError') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-earth flex items-center justify-center px-4 pt-32 pb-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair font-bold text-white mb-2">
            {isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}
          </h1>
          <p className="text-white/80">
            {isLogin ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {!isLogin && (
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-foreground mb-2">
                  <UserIcon className="inline h-4 w-4 mr-1" aria-hidden="true" />
                  {t('auth.fullName')}
                </label>
                <Input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('auth.namePlaceholder')}
                  disabled={loading}
                  maxLength={100}
                  required
                  className="h-12"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-foreground mb-2">
                <Mail className="inline h-4 w-4 mr-1" aria-hidden="true" />
                {t('auth.email')}
              </label>
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                disabled={loading}
                maxLength={255}
                required
                className="h-12"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-foreground mb-2">
                <Lock className="inline h-4 w-4 mr-1" aria-hidden="true" />
                {t('auth.password')}
              </label>
              <Input
                id="auth-password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                maxLength={72}
                required
                className="h-12"
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-1">{t('auth.passwordHint')}</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 btn-hero">
              {loading
                ? t('common.processing')
                : isLogin
                ? t('auth.submitLogin')
                : t('auth.submitSignup')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setName('');
                setPassword('');
              }}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              {isLogin ? t('auth.switchToSignup') : t('auth.switchToLogin')}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white text-sm"
          >
            ← {t('common.backToStore')}
          </button>
        </div>
      </div>
    </main>
  );
}
