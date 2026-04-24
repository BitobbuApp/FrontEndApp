import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerUser } from '../services/authApi';
import useAppMetadata from '../../appMetadata/hooks/useAppMetadata';
import { Check } from 'lucide-react';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;

const PasswordStrengthMeter = ({ password }) => {
    const checks = [
        { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
        { label: 'Mayúsculas y minúsculas', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
        { label: 'Al menos un número', met: /\d/.test(password) },
        { label: 'Carácter especial (@$!#%*?&)', met: /[@$!#%*?&]/.test(password) },
    ];

    const metCount = checks.filter(c => c.met).length;
    
    return (
        <div className="mt-3 space-y-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100 transition-all">
            <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((step) => (
                    <div 
                        key={step}
                        className={`flex-1 rounded-full transition-all duration-500 ${
                            step <= metCount 
                                ? metCount <= 2 ? 'bg-orange-400' : metCount === 3 ? 'bg-blue-400' : 'bg-[#D2FC31]'
                                : 'bg-slate-200'
                        }`}
                    />
                ))}
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2">
                        {check.met ? (
                            <Check className="w-3.5 h-3.5 text-[#a8cc27]" />
                        ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                        <span className={`text-[11px] leading-none ${check.met ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                            {check.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function RegisterForm({ onGoToLogin }) {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        trade_name: '',
        country_id: '1', // Venezuela is the only default
        state_id: '',
        sector_id: '',
        roleType: 'both',
    });
    
    // Geographic data cascading hook
    const { states, categoryOptions, isLoading: isLoadingMetadata } = useAppMetadata();

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
        if (!form.first_name || !form.last_name || !form.email || !form.password || !form.trade_name || !form.country_id || !form.state_id || !form.sector_id) {
            setError('Por favor completa todos los campos.');
            return;
        }

        if (!PASSWORD_REGEX.test(form.password)) {
            setError('La contraseña no cumple con los requisitos de seguridad.');
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                ...form,
                can_buy: form.roleType === 'buyer_only' || form.roleType === 'both',
                can_sell: form.roleType === 'seller_only' || form.roleType === 'both',
            };
            delete payload.roleType;
            await registerUser(payload);
            setSuccess(true);
        } catch (err) {
            if (err.details && Array.isArray(err.details)) {
                // setError(err.details.join(' · '));
            } else {
                // setError(err.message || 'Error al registrar. Intenta de nuevo.');
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
                                placeholder="Crea una contraseña segura"
                                className={`h-12 bg-background border-border pr-12 transition-all ${
                                    form.password && !PASSWORD_REGEX.test(form.password) 
                                        ? 'border-orange-200 focus-visible:ring-orange-200' 
                                        : form.password && PASSWORD_REGEX.test(form.password)
                                        ? 'border-[#D2FC31] focus-visible:ring-[#D2FC31]'
                                        : ''
                                }`}
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
                        {form.password && <PasswordStrengthMeter password={form.password} />}
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
                            <Label htmlFor="sector_id" className="text-sm font-medium text-slate-700">
                                Sector / Categoría
                            </Label>
                            <Select 
                                disabled={isLoading || isLoadingMetadata} 
                                value={form.sector_id?.toString()} 
                                onValueChange={(val) => handleSelectChange('sector_id', val)}
                            >
                                <SelectTrigger className="w-full h-12 bg-background border-border">
                                    <SelectValue placeholder="Selecciona el sector" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions && categoryOptions.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="roleType" className="text-sm font-medium text-slate-700">
                                ¿Qué quieres hacer en Bitobbu?
                            </Label>
                            <Select 
                                disabled={isLoading} 
                                value={form.roleType} 
                                onValueChange={(val) => handleSelectChange('roleType', val)}
                            >
                                <SelectTrigger className="w-full h-12 bg-background border-border">
                                    <SelectValue placeholder="Selecciona tu interés principal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="both">Comprar y Vender</SelectItem>
                                    <SelectItem value="buyer_only">Solo Comprar</SelectItem>
                                    <SelectItem value="seller_only">Solo Vender</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {/* Geographic Section */}
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
                                <Select disabled={isLoading || isLoadingMetadata} value={form.state_id?.toString()} onValueChange={(val) => handleSelectChange('state_id', val)}>
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
