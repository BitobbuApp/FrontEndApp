import React from 'react';
import { Check, X } from 'lucide-react';
import { PASSWORD_REQUIREMENT_LABELS, TOO_LONG_HINT } from '../utils/passwordPolicy';

/** Live checklist of the password rules. `checks` comes from evaluatePassword(). */
export default function PasswordRequirements({ checks, showMatch = true, password = '' }) {
    const items = PASSWORD_REQUIREMENT_LABELS.filter(([key]) => showMatch || key !== 'matches');

    return (
        <ul className="space-y-1.5" aria-label="Requisitos de la contraseña">
            {items.map(([key, label]) => (
                <li key={key} className={`flex items-center gap-2 text-xs ${checks[key] ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {checks[key] ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    {key === 'withinMaxBytes' && !checks[key] && password.length <= 72 ? TOO_LONG_HINT : label}
                </li>
            ))}
        </ul>
    );
}
