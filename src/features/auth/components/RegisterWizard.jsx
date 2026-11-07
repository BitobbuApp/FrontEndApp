import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Building2, Store, Repeat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAuth } from '../AuthContext';
import useAppMetadata from '../../appMetadata/hooks/useAppMetadata';
import { Eye, EyeOff } from 'lucide-react';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;

const variants = {
    initial: (direction) => ({
        x: direction > 0 ? 50 : -50,
        opacity: 0
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: 'easeInOut'
        }
    },
    exit: (direction) => ({
        x: direction > 0 ? -50 : 50,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: 'easeInOut'
        }
    })
};

export default function RegisterWizard({ onGoToLogin }) {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { states, categoryOptions, isLoading: isLoadingMetadata } = useAppMetadata();

    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        roleType: '',
        first_name: '',
        last_name: '',
        trade_name: '',
        sector_id: '',
        state_id: '',
        email: '',
        password: '',
        confirm_password: '',
        accepted_terms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        setError('');
        if (step === 1) {
            if (!form.roleType) {
                setError('Por favor selecciona para qué usarás Bitobbu.');
                return;
            }
        }
        if (step === 2) {
            if (!form.first_name || !form.last_name || !form.trade_name || !form.sector_id || !form.state_id || !form.email) {
                setError('Por favor completa todos los campos.');
                return;
            }
        }
        setDirection(1);
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError('');
        setDirection(-1);
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (step !== 3) {
            nextStep();
            return;
        }

        if (!form.password || form.password !== form.confirm_password) {
            setError('Las contraseñas no coinciden o están vacías.');
            return;
        }
        if (!PASSWORD_REGEX.test(form.password)) {
            setError('La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.');
            return;
        }
        if (!form.accepted_terms) {
            setError('Debes aceptar los Términos de Servicio y la Política de Privacidad.');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...form,
                country_id: '1',
                can_buy: form.roleType === 'buyer_only' || form.roleType === 'both',
                can_sell: form.roleType === 'seller_only' || form.roleType === 'both',
            };
            delete payload.roleType;
            delete payload.confirm_password;
            delete payload.accepted_terms;

            await register(payload);
            
            // Redirect to marketplace automatically
            navigate('/Marketplace');
        } catch (err) {
            setError(err.message || 'Error al registrar. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate progress percentage
    const progress = (step / 3) * 100;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
            <Link 
                to="/" 
                className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 flex items-center gap-2 text-slate-500 hover:text-[#0B2046] font-semibold transition-colors z-50 bg-white/80 backdrop-blur-sm py-2 px-3 sm:px-4 rounded-xl shadow-sm border border-slate-200"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Volver</span>
            </Link>

            <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex min-h-[600px] relative z-10">
                
                {/* Left Sidebar (Hidden on Mobile) */}
                <div className="hidden lg:flex lg:w-2/5 bg-[#0B2046] p-10 flex-col relative text-white">
                    <div className="flex items-center gap-2 mb-16 z-10">
                        <div className="w-10 h-10 bg-[#D2FC31] rounded-lg flex items-center justify-center">
                            <span className="font-extrabold text-2xl text-[#0B2046]">B</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight">Bitobbu</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center z-10 text-center">
                        <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    className="text-white/20"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                                <circle
                                    className="text-[#D2FC31] transition-all duration-500 ease-in-out"
                                    strokeWidth="8"
                                    strokeDasharray={364}
                                    strokeDashoffset={364 - (364 * progress) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                            </svg>
                            <span className="text-4xl font-bold">{step}</span>
                        </div>
                        <h2 className="text-3xl font-extrabold mb-4 leading-tight">
                            Personalicemos tu experiencia en Bitobbu
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Queremos mostrarte las herramientas que realmente necesitas para hacer crecer tu negocio.
                        </p>
                    </div>
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D2FC31]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                </div>

                {/* Right Content */}
                <div className="w-full lg:w-3/5 p-8 sm:p-12 flex flex-col relative overflow-hidden bg-white">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#D2FC31] rounded-lg flex items-center justify-center">
                                <span className="font-extrabold text-xl text-[#0B2046]">B</span>
                            </div>
                            <span className="font-bold text-xl text-[#0B2046] tracking-tight">Bitobbu</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-500">
                            Paso {step} de 3
                        </span>
                    </div>

                    <div className="hidden lg:block mb-8">
                        <span className="text-sm font-semibold text-slate-500">
                            Paso {step} de 3
                        </span>
                    </div>

                    <div className="flex-1 relative">
                        <AnimatePresence custom={direction} mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    custom={direction}
                                    variants={variants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="h-full flex flex-col"
                                >
                                    <h3 className="text-3xl font-extrabold text-[#0B2046] mb-8">
                                        ¿Para qué usarás Bitobbu?
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                        <button
                                            type="button"
                                            onClick={() => handleSelectChange('roleType', 'buyer_only')}
                                            className={`p-6 text-left rounded-2xl border-2 transition-all flex flex-col relative ${
                                                form.roleType === 'buyer_only' 
                                                ? 'border-[#0B2046] bg-slate-50' 
                                                : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                        >
                                            <Building2 className={`w-8 h-8 mb-4 ${form.roleType === 'buyer_only' ? 'text-[#0B2046]' : 'text-slate-400'}`} />
                                            <h4 className="font-bold text-lg text-[#0B2046] mb-2">Comprar para negocio</h4>
                                            <p className="text-sm text-slate-500">Cotiza múltiples proveedores y abastece tu empresa al mejor precio.</p>
                                            {form.roleType === 'buyer_only' && (
                                                <div className="absolute bottom-4 right-4 text-[#0B2046]">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleSelectChange('roleType', 'seller_only')}
                                            className={`p-6 text-left rounded-2xl border-2 transition-all flex flex-col relative ${
                                                form.roleType === 'seller_only' 
                                                ? 'border-[#0B2046] bg-slate-50' 
                                                : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                        >
                                            <Store className={`w-8 h-8 mb-4 ${form.roleType === 'seller_only' ? 'text-[#0B2046]' : 'text-slate-400'}`} />
                                            <h4 className="font-bold text-lg text-[#0B2046] mb-2">Vender / Proveedor</h4>
                                            <p className="text-sm text-slate-500">Ofrece tus productos, recibe solicitudes de cotización y expande tu cartera.</p>
                                            {form.roleType === 'seller_only' && (
                                                <div className="absolute bottom-4 right-4 text-[#0B2046]">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                            )}
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => handleSelectChange('roleType', 'both')}
                                            className={`p-6 text-left rounded-2xl border-2 transition-all flex flex-col relative sm:col-span-2 ${
                                                form.roleType === 'both' 
                                                ? 'border-[#0B2046] bg-slate-50' 
                                                : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                        >
                                            <Repeat className={`w-8 h-8 mb-4 ${form.roleType === 'both' ? 'text-[#0B2046]' : 'text-slate-400'}`} />
                                            <h4 className="font-bold text-lg text-[#0B2046] mb-2">Ambos</h4>
                                            <p className="text-sm text-slate-500">Compra insumos para tu empresa y distribuye tus propios productos en el Marketplace.</p>
                                            {form.roleType === 'both' && (
                                                <div className="absolute bottom-4 right-4 text-[#0B2046]">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    custom={direction}
                                    variants={variants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="h-full flex flex-col"
                                >
                                    <h3 className="text-3xl font-extrabold text-[#0B2046] mb-8">
                                        Cuéntanos sobre ti
                                    </h3>
                                    
                                    <div className="space-y-5 flex-1">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="first_name" className="text-sm font-bold text-[#0B2046]">Nombres</Label>
                                                <Input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Ej. Carlos" className="h-11 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B2046]" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="last_name" className="text-sm font-bold text-[#0B2046]">Apellidos</Label>
                                                <Input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Ej. Pérez" className="h-11 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B2046]" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="trade_name" className="text-sm font-bold text-[#0B2046]">Nombre de la empresa</Label>
                                            <Input id="trade_name" name="trade_name" value={form.trade_name} onChange={handleChange} placeholder="Ej. Distribuidora El Sol" className="h-11 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B2046]" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="sector_id" className="text-sm font-bold text-[#0B2046]">Sector / Categoría principal</Label>
                                                <Select value={form.sector_id?.toString()} onValueChange={(val) => handleSelectChange('sector_id', val)}>
                                                    <SelectTrigger className="w-full h-11 border-slate-200">
                                                        <SelectValue placeholder="Selecciona un sector" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoryOptions?.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state_id" className="text-sm font-bold text-[#0B2046]">Estado / Ubicación</Label>
                                                <Select value={form.state_id?.toString()} onValueChange={(val) => handleSelectChange('state_id', val)}>
                                                    <SelectTrigger className="w-full h-11 border-slate-200">
                                                        <SelectValue placeholder="Selecciona el estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {states?.map((s) => (
                                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-bold text-[#0B2046]">Correo electrónico</Label>
                                            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@empresa.com" className="h-11 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B2046]" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    custom={direction}
                                    variants={variants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="h-full flex flex-col"
                                >
                                    <h3 className="text-3xl font-extrabold text-[#0B2046] mb-8">
                                        Protege tu cuenta
                                    </h3>
                                    
                                    <div className="space-y-6 flex-1">
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-bold text-[#0B2046]">Contraseña</Label>
                                            <div className="relative">
                                                <Input 
                                                    id="password" 
                                                    name="password" 
                                                    type={showPassword ? "text" : "password"} 
                                                    value={form.password} 
                                                    onChange={handleChange} 
                                                    placeholder="Mínimo 8 caracteres" 
                                                    className="h-11 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B2046] pr-10" 
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${form.password.length >= 8 ? 'bg-green-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                                                        <Check className="w-2 h-2" />
                                                    </div>
                                                    <span className={form.password.length >= 8 ? 'text-slate-700' : 'text-slate-500'}>Mínimo 8 caracteres</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${/[A-Z]/.test(form.password) ? 'bg-green-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                                                        <Check className="w-2 h-2" />
                                                    </div>
                                                    <span className={/[A-Z]/.test(form.password) ? 'text-slate-700' : 'text-slate-500'}>Una letra mayúscula</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${/[a-z]/.test(form.password) ? 'bg-green-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                                                        <Check className="w-2 h-2" />
                                                    </div>
                                                    <span className={/[a-z]/.test(form.password) ? 'text-slate-700' : 'text-slate-500'}>Una letra minúscula</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${/\d/.test(form.password) ? 'bg-green-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                                                        <Check className="w-2 h-2" />
                                                    </div>
                                                    <span className={/\d/.test(form.password) ? 'text-slate-700' : 'text-slate-500'}>Un número</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${/[@$!#%*?&]/.test(form.password) ? 'bg-green-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                                                        <Check className="w-2 h-2" />
                                                    </div>
                                                    <span className={/[@$!#%*?&]/.test(form.password) ? 'text-slate-700' : 'text-slate-500'}>Un carácter especial (@$!#%*?&)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirm_password" className="text-sm font-bold text-[#0B2046]">Confirmar contraseña</Label>
                                            <Input 
                                                id="confirm_password" 
                                                name="confirm_password" 
                                                type={showPassword ? "text" : "password"} 
                                                value={form.confirm_password} 
                                                onChange={handleChange} 
                                                placeholder="Repite tu contraseña" 
                                                className="h-11 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B2046]" 
                                            />
                                        </div>

                                        <div className="flex items-start space-x-3 pt-4">
                                            <input 
                                                type="checkbox" 
                                                id="accepted_terms" 
                                                name="accepted_terms"
                                                checked={form.accepted_terms}
                                                onChange={handleChange}
                                                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0B2046] focus:ring-[#0B2046]" 
                                            />
                                            <Label htmlFor="accepted_terms" className="text-sm text-slate-600 leading-snug font-normal">
                                                Acepto los <a href="#" className="font-bold text-[#0B2046] hover:underline">Términos de Servicio</a> y la <a href="#" className="font-bold text-[#0B2046] hover:underline">Política de Privacidad</a> de Bitobbu.
                                            </Label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        {error && (
                            <div className="mb-4 bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 font-medium">
                                {error}
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="font-bold text-slate-500 hover:text-[#0B2046] flex items-center gap-2 transition-colors"
                                >
                                    Atrás
                                </button>
                            ) : (
                                <Link to="/login" className="font-bold text-slate-500 hover:text-[#0B2046] transition-colors">
                                    Ya tengo cuenta
                                </Link>
                            )}

                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="h-12 px-8 bg-[#D2FC31] hover:bg-[#c4ed2d] text-[#0B2046] font-extrabold text-base rounded-xl transition-colors"
                            >
                                {isLoading ? (
                                    'Procesando...'
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {step === 3 ? 'Comenzar ahora' : 'Siguiente'}
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
