import React from 'react';
import { motion } from 'framer-motion';

/** "{name} está escribiendo…" bubble with animated dots, shown at the end of the message list. */
export default function TypingBubble({ name }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
            aria-live="polite"
        >
            <div className="flex items-center gap-2 bg-slate-100 rounded-2xl rounded-bl-sm px-3 py-2">
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-slate-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </div>
                <span className="text-xs text-slate-500">{name || 'La otra parte'} está escribiendo…</span>
            </div>
        </motion.div>
    );
}
