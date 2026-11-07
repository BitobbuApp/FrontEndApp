import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Password input with a show/hide toggle. */
export default function PasswordField({ id, label, value, onChange, autoComplete, placeholder = '••••••••', disabled, size = 'lg' }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="space-y-2">
            {label && <Label htmlFor={id} className={size === 'md' ? undefined : 'text-sm font-medium text-slate-700'}>{label}</Label>}
            <div className="relative">
                <Input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    className={size === 'md' ? 'h-10 pr-10' : 'h-12 bg-background border-border pr-12'}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
