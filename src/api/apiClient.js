// Re-export from canonical location (features/auth/services/authApi).
// Kept for backward compatibility so base44Client.js and others still work.
export {
    loginUser,
    registerUser,
    saveSession,
    loadSession,
    clearSession,
} from '@/features/auth/services/authApi';
