import React from 'react';

export default function DealStatusPill({ stage }) {
    if (!stage) return null;

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${stage.tone.pill}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${stage.tone.dot}`} />
            {stage.label}
        </span>
    );
}
