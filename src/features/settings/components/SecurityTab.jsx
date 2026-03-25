import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

/**
 * SecurityTab - Component for handling password changes in Settings.
 * Implements validation requirements and UI feedback.
 */
export default function SecurityTab() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [requirements, setRequirements] = useState({
        minLength: false,
        alphanumeric: false,
        match: false
    });

    // Validates password requirements as user types
    useEffect(() => {
        const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
        
        setRequirements({
            minLength: passwords.new.length >= 8,
            alphanumeric: alphanumericRegex.test(passwords.new),
            match: passwords.new !== '' && passwords.new === passwords.confirm
        });
    }, [passwords.new, passwords.confirm]);

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswords(prev => ({ ...prev, [id]: value }));
    };

    const isFormValid = requirements.minLength && requirements.alphanumeric && requirements.match && passwords.current !== '';

    const handleSave = () => {
        if (!isFormValid) return;
        
        // Mock save logic
        toast.success('Contraseña actualizada correctamente', {
            description: 'Tu sesión permanecerá activa.',
            icon: <Check className="w-4 h-4 text-emerald-500" />
        });
        
        // Reset form
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const RequirementItem = ({ met, text }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-emerald-600' : 'text-slate-400'}`}>
            {met ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            {text}
        </div>
    );

    return (
        <div className="space-y-6">
            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5 text-foreground" />
                        Cambiar Contraseña
                    </CardTitle>
                    <CardDescription>
                        Asegúrate de usar una contraseña que no utilices en otros sitios.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="current">Contraseña Actual</Label>
                        <div className="relative">
                            <Input
                                id="current"
                                type={showCurrent ? "text" : "password"}
                                value={passwords.current}
                                onChange={handlePasswordChange}
                                className="pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="new">Nueva Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="new"
                                    type={showNew ? "text" : "password"}
                                    value={passwords.new}
                                    onChange={handlePasswordChange}
                                    className="pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="confirm"
                                    type={showConfirm ? "text" : "password"}
                                    value={passwords.confirm}
                                    onChange={handlePasswordChange}
                                    className="pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Completion Indicators / Requirements */}
                    <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-3">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Requerimientos
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                            <RequirementItem met={requirements.minLength} text="Mínimo 8 caracteres" />
                            <RequirementItem met={requirements.alphanumeric} text="Solo caracteres alfanuméricos" />
                            <RequirementItem met={requirements.match} text="Las contraseñas coinciden" />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button 
                            onClick={handleSave} 
                            disabled={!isFormValid}
                            className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]"
                        >
                            Actualizar Contraseña
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
