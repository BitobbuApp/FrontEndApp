import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Mail, Lock, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginModal({ open, onOpenChange }) {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            onOpenChange(false);
        } catch (err) {
            // Error is handled by context/toaster, but we can set local if needed
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterClick = () => {
        onOpenChange(false);
        navigate('/register');
    };

    const handleForgotPasswordClick = () => {
        onOpenChange(false);
        // navigate('/forgot-password');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <div className="p-8 pb-6 text-center">
                    <h2 className="text-2xl font-extrabold text-[#0B2046] mb-2 tracking-tight">
                        Bienvenido de vuelta
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Ingresa para gestionar tus compras y ventas B2B
                    </p>
                </div>

                <div className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-[#0B2046]">
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@empresa.com"
                                    className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B2046]"
                                    autoComplete="email"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-bold text-[#0B2046]">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B2046]"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={handleForgotPasswordClick}
                                    className="text-xs font-bold text-[#0B2046] hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2 text-center font-medium">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-[#0B2046] font-extrabold text-base rounded-xl transition-colors mt-2"
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-500">
                        ¿No tienes cuenta?{' '}
                        <button
                            onClick={handleRegisterClick}
                            className="text-[#0B2046] font-bold hover:underline"
                        >
                            Crear cuenta gratis
                        </button>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
