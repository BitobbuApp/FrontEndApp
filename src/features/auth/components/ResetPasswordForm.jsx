import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword } from '../services/authApi';

export default function ResetPasswordForm({ onGoToLogin }) {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !newPassword || !confirmPassword) {
            setError('Por favor completa todos los campos.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await resetPassword({ email, newPassword, confirmPassword });
            setSuccess('Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.');
            // Opcional: auto-redirigir despues de unos segundos
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Error al restaurar contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center bg-muted/50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <button
                    onClick={onGoToLogin}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al login
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Restaurar contraseña</h1>
                    <p className="text-slate-500">Ingresa tu correo electrónico y tu nueva contraseña.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="reset-email" className="text-sm font-medium text-slate-700">
                            Correo electrónico
                        </Label>
                        <Input
                            id="reset-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@empresa.com"
                            className="h-12 bg-background border-border"
                            disabled={isLoading || success}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-sm font-medium text-slate-700">
                            Nueva Contraseña
                        </Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-12 bg-background border-border pr-12"
                                disabled={isLoading || success}
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

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">
                            Confirmar Contraseña
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-12 bg-background border-border pr-12"
                                disabled={isLoading || success}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3"
                        >
                            {success}
                        </motion.div>
                    )}

                    {!success && (
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold text-base rounded-xl shadow-lg shadow-[#D2FC31]/25 transition-all"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-[#1E293B]/30 border-t-[#1E293B] rounded-full animate-spin" />
                                    Actualizando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <KeyRound className="w-5 h-5" />
                                    Actualizar Contraseña
                                </span>
                            )}
                        </Button>
                    )}
                    
                    {success && (
                         <Button
                            type="button"
                            onClick={onGoToLogin}
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base rounded-xl transition-all"
                        >
                            Ir a Iniciar Sesión
                        </Button>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
