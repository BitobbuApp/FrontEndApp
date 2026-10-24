import React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';

/**
 * Asks for the 6-digit code of the authenticator app or, when `useRecovery` is on, a recovery code (XXXXX-XXXXX).
 * `onComplete` fires when a full 6-digit code is typed (to submit automatically).
 */
export default function TwoFactorCodeInput({ value, onChange, useRecovery, onToggleRecovery, onComplete, disabled, allowRecovery = true }) {
    return (
        <div className="space-y-3">
            {useRecovery ? (
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    placeholder="XXXXX-XXXXX"
                    autoComplete="off"
                    autoFocus
                    disabled={disabled}
                    aria-label="Código de respaldo"
                    className="h-12 bg-background border-border text-center tracking-widest font-mono"
                />
            ) : (
                <div className="flex justify-center">
                    <InputOTP
                        maxLength={6}
                        value={value}
                        onChange={onChange}
                        onComplete={onComplete}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        autoFocus
                        disabled={disabled}
                        aria-label="Código de verificación"
                    >
                        <InputOTPGroup>
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <InputOTPSlot key={i} index={i} className="h-12 w-11 text-lg" />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                </div>
            )}
            {allowRecovery && (
                <button
                    type="button"
                    onClick={onToggleRecovery}
                    className="block mx-auto text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                    {useRecovery ? 'Usar el código de mi aplicación' : 'Usar un código de respaldo'}
                </button>
            )}
        </div>
    );
}
