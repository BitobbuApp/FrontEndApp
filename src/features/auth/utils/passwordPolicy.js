// Mirrors the backend password policy (shared/application/validation/password.schema.ts) so the user sees the
// rules while typing. The backend stays the authority: it also checks the last 5 passwords and personal data.

const MAX_PASSWORD_BYTES = 72; // bcrypt truncates beyond this

export function evaluatePassword(password, confirmation) {
    return {
        minLength: password.length >= 10,
        hasLetter: /[A-Za-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        withinMaxBytes: new TextEncoder().encode(password).length <= MAX_PASSWORD_BYTES,
        matches: password.length > 0 && password === confirmation,
    };
}

export const isPasswordValid = (checks) => Object.values(checks).every(Boolean);

// The real limit is 72 bytes: a few accented letters or symbols take more than one, so a password slightly
// under 72 characters can still be too long. Shown only when that happens.
export const TOO_LONG_HINT = 'Es demasiado larga: acórtala un poco.';

export const PASSWORD_REQUIREMENT_LABELS = [
    ['minLength', 'Al menos 10 caracteres'],
    ['hasLetter', 'Una letra'],
    ['hasNumber', 'Un número'],
    ['withinMaxBytes', 'Máximo 72 caracteres'],
    ['matches', 'Las contraseñas coinciden'],
];
