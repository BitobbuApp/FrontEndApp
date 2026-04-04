import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerUser } from '../services/authApi';
import useGeographicData from '../../geographic/hooks/useGeographicData';

export default function RegisterForm({ onGoToLogin }) {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        trade_name: '',
        founding_year: '',
        country_id: '1', // Venezuela is the only default
        state_id: '',
        // city_id: '', // Hidden as per request
    });
    
    // Geographic data cascading hook
    const { states, isLoadingStates } = useGeographicData('1', form.state_id);

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name, value) => {
        setForm((prev) => {
            const newForm = { ...prev, [name]: value };
            return newForm;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.first_name || !form.last_name || !form.email || !form.password || !form.trade_name || !form.founding_year || !form.country_id || !form.state_id) {
            setError('Por favor completa todos los campos.');
            return;
        }
        setIsLoading(true);
        try {
            await registerUser(form);
            setSuccess(true);
        } catch (err) {
            if (err.details && Array.isArray(err.details)) {
                setError(err.details.join(' · '));
            } else {
                setError(err.message || 'Error al registrar. Intenta de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex-1 flex items-center justify-center bg-muted/50 p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-sm"
                >
                    <div className="w-16 h-16 bg-[#D2FC31] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-foreground font-bold text-3xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">¡Cuenta creada!</h2>
                    <p className="text-slate-500 mb-8">Tu cuenta fue registrada exitosamente.</p>
                    <Button
                        onClick={onGoToLogin}
                        className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold rounded-xl"
                    >
                        Ir al inicio de sesión
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center bg-muted/50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Logo mobile */}
                <div className="flex items-center gap-2 mb-10 lg:hidden">
                    <div className="w-10 h-10 bg-[#D2FC31] rounded-xl flex items-center justify-center">
                        <span className="text-foreground font-bold text-lg">B</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">Bitobbu</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Crear cuenta</h1>
                    <p className="text-slate-500">Completa tus datos para comenzar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name" className="text-sm font-medium text-slate-700">
                                Nombre
                            </Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={form.first_name}
                                onChange={handleChange}
                                placeholder="Carlos"
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name" className="text-sm font-medium text-slate-700">
                                Apellido
                            </Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={form.last_name}
                                onChange={handleChange}
                                placeholder="Galeano"
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Correo electrónico
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="tu@empresa.com"
                            className="h-12 bg-background border-border"
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
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                className="h-12 bg-background border-border pr-12"
                                autoComplete="new-password"
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
                    
                    <div className="space-y-4 pt-2 border-t border-border mt-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                            🏢 Datos de la Empresa
                        </h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="trade_name" className="text-sm font-medium text-slate-700">
                                Nombre de la Empresa
                            </Label>
                            <Input
                                id="trade_name"
                                name="trade_name"
                                type="text"
                                value={form.trade_name}
                                onChange={handleChange}
                                placeholder="Ej. Distribuidora Pérez C.A."
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="founding_year" className="text-sm font-medium text-slate-700">
                                Año de Fundación
                            </Label>
                            <Input
                                id="founding_year"
                                name="founding_year"
                                type="number"
                                min="1900"
                                max={new Date().getFullYear()}
                                value={form.founding_year}
                                onChange={(e) => setForm(prev => ({ ...prev, founding_year: parseInt(e.target.value) || '' }))}
                                placeholder="Ej. 2015"
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    
                    {/* Geographic Cascading Selectors */}
                    <div className="space-y-4 pt-2 border-t border-border">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                            <MapPin className="w-4 h-4" /> Ubicación
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">País</Label>
                                <Select disabled value="1">
                                    <SelectTrigger className="w-full h-12 bg-slate-50 border-border text-slate-500">
                                        <SelectValue placeholder="Venezuela" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Venezuela</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Estado / Provincia</Label>
                                <Select disabled={isLoading || isLoadingStates} value={form.state_id?.toString()} onValueChange={(val) => handleSelectChange('state_id', val)}>
                                    <SelectTrigger className="w-full h-12 bg-background border-border">
                                        <SelectValue placeholder="Selecciona el estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/*
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Ciudad</Label>
                                <Select disabled={!form.state_id || isLoading || isLoadingCities} value={form.city_id?.toString()} onValueChange={(val) => handleSelectChange('city_id', val)}>
                                    <SelectTrigger className="w-full h-12 bg-background border-border">
                                        <SelectValue placeholder="Selecciona la ciudad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                            <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            */}
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
                        className="w-full h-12 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-semibold text-base rounded-xl shadow-lg shadow-[#D2FC31]/25 transition-all mt-2"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-[#1E293B]/30 border-t-[#1E293B] rounded-full animate-spin" />
                                Creando cuenta...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5" />
                                Crear cuenta
                            </span>
                        )}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    ¿Ya tienes cuenta?{' '}
                    <button
                        onClick={onGoToLogin}
                        className="text-foreground font-semibold hover:underline"
                    >
                        Inicia sesión
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
