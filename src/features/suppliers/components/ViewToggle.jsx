import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

/**
 * Reusable view-mode toggle: grid vs list.
 * Props: mode ('grid' | 'list'), onChange (fn)
 */
export default function ViewToggle({ mode, onChange }) {
    return (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
                type="button"
                onClick={() => onChange('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                    mode === 'grid'
                        ? 'bg-white text-[#1E293B] shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Vista en cuadrícula"
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => onChange('list')}
                className={`p-1.5 rounded-md transition-colors ${
                    mode === 'list'
                        ? 'bg-white text-[#1E293B] shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Vista en lista"
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    );
}
