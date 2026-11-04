import React from 'react';
import { DEAL_STEPS } from '../utils/dealStage';

/** Six-segment progress: done = navy, current = lime, pending = slate. */
export default function DealStepper({ step }) {
    if (step == null) return null;

    return (
        <div className="grid grid-cols-6 gap-1.5">
            {DEAL_STEPS.map((label, index) => {
                const isDone = index < step;
                const isCurrent = index === step;
                return (
                    <div key={label} className="min-w-0">
                        <div
                            className={`h-1 rounded-full ${
                                isDone ? 'bg-[#0B2046]' : isCurrent ? 'bg-[#D2FC31]' : 'bg-slate-200'
                            }`}
                        />
                        <p
                            className={`mt-1 truncate text-[10px] ${
                                isCurrent ? 'font-semibold text-[#0B2046]' : 'text-slate-400'
                            } ${isCurrent ? '' : 'hidden sm:block'}`}
                        >
                            {label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
