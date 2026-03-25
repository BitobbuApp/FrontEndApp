import React from 'react';

const TYPES = [
    { value: 'Producto', emoji: '📦', subtitle: 'Bienes físicos' },
    { value: 'Servicio', emoji: '🔧', subtitle: 'Conocimiento / Ejecución' },
];

/**
 * Card-style toggle for selecting Producto vs Servicio.
 * Props: value (string|null), onChange (fn)
 */
export default function TypeSelector({ value, onChange }) {
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
                ¿Qué necesitas? <span className="text-red-500">*</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
                {TYPES.map((t) => {
                    const selected = value === t.value;
                    return (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => onChange(t.value)}
                            className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all ${
                                selected
                                    ? 'border-[#D2FC31] bg-[#f8ffe6] shadow-sm'
                                    : 'border-border bg-background hover:border-slate-300 hover:bg-muted/50'
                            }`}
                        >
                            <span className="text-3xl">{t.emoji}</span>
                            <span className={`font-semibold text-sm ${selected ? 'text-foreground' : 'text-slate-600'}`}>
                                {t.value}
                            </span>
                            <span className={`text-xs ${selected ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t.subtitle}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
