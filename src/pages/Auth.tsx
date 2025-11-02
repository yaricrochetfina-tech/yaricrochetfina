import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Lock, Mail, User as UserIcon } from 'lucide-react';

const authSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(72),
  name: z.string().trim().min(1, 'El nombre es requerido').max(100).optional(),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = authSchema.parse({
        email,
        password,
        name: isLogin ? undefined : name,
      });

      setLoading(true);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (error) {
          toast({
            title: 'Error al iniciar sesión',
            description: error.message === 'Invalid login credentials' 
              ? 'Email o contraseña incorrectos'
              : error.message,
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: '¡Bienvenida!',
          description: 'Has iniciado sesión exitosamente',
        });
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: validatedData.name,
            },
          },
        });

        if (error) {
          toast({
            title: 'Error al registrarse',
            description: error.message === 'User already registered'
              ? 'Este email ya está registrado'
              : error.message,
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: '¡Cuenta creada!',
          description: 'Tu cuenta ha sido creada exitosamente',
        });
        navigate('/');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Error de validación',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair font-bold text-white mb-2">
            {isLogin ? 'Bienvenida de Nuevo' : 'Crear Cuenta'}
          </h1>
          <p className="text-white/80">
            {isLogin
              ? 'Inicia sesión para continuar con tu compra'
              : 'Regístrate para empezar a comprar'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <UserIcon className="inline h-4 w-4 mr-1" />
                  Nombre Completo
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  disabled={loading}
                  maxLength={100}
                  required
                  className="h-12"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={loading}
                maxLength={255}
                required
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                maxLength={72}
                required
                className="h-12"
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 btn-hero"
            >
              {loading
                ? 'Procesando...'
                : isLogin
                ? 'Iniciar Sesión'
                : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              {isLogin
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white text-sm"
          >
            ← Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
}
