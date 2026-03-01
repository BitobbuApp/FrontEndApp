import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ShoppingBag, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FEATURES = [
  { icon: ShoppingBag, text: 'Marketplace mayorista B2B' },
  { icon: Users, text: 'Red de proveedores verificados' },
  { icon: TrendingUp, text: 'Cotizaciones en tiempo real' },
  { icon: Zap, text: 'Negocia directamente con proveedores' },
];

export default function Login({ onGoToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('dev@bitobbu.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Panel izquierdo (marca) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E293B] flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-[#D2FC31] rounded-2xl flex items-center justify-center">
              <span className="text-[#1E293B] font-bold text-2xl">B</span>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Bitobbu</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              La plataforma B2B<br />
              <span className="text-[#D2FC31]">que conecta compradores</span><br />
              con proveedores.
            </h2>
            <p className="text-slate-400 text-lg mb-12">
              Cotiza, negocia y cierra negocios en minutos.
            </p>

            <div className="space-y-4">
              {FEATURES.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-[#D2FC31]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#D2FC31]" />
                  </div>
                  <span className="text-slate-300">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-slate-600 text-sm">
          © 2026 Bitobbu · Todos los derechos reservados
        </p>
      </div>

      {/* ── Panel derecho (formulario) ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-[#D2FC31] rounded-xl flex items-center justify-center">
              <span className="text-[#1E293B] font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-[#1E293B]">Bitobbu</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Bienvenido de vuelta</h1>
            <p className="text-slate-500">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="h-12 bg-white border-slate-200"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 bg-white border-slate-200 pr-12"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-[#1E293B] font-semibold text-base rounded-xl shadow-lg shadow-[#D2FC31]/25 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1E293B]/30 border-t-[#1E293B] rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onGoToRegister}
              className="text-[#1E293B] font-semibold hover:underline"
            >
              Regístrate gratis
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
