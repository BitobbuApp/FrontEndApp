import React from 'react';

export default function StageHintBar({ hint }) {
    if (!hint) return null;

    return (
        <div className="flex items-center gap-2 border-t bg-white px-4 py-2 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 flex-shrink-0 rounded-full border border-[#0B2046]/20 bg-[#D2FC31]" />
            <span className="truncate">{hint}</span>
        </div>
    );
}
