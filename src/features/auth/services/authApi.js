// src/features/auth/services/authApi.js
// All auth-related HTTP calls and session management live here.

import apiClient from '@/api/axiosClient';

const SESSION_KEY = 'bitobbu_session';
const TOKEN_KEY = 'bitobbu_token';

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/users/login
 * Returns one of:
 *  - a full session (has `token`)
 *  - { mfa_required: true, mfa_token }: the user has 2FA, ask for a code (verifyLogin2Fa)
 *  - { two_factor_enrollment_required: true, enrollment_token }: the company requires 2FA and the user has none yet
 */
export async function loginUser(email, password) {
    const responseBody = await apiClient.post('/users/login', { email, password });
    return responseBody.data;
}

/**
 * POST /api/v1/auth/login/2fa
 * Completes login challenge with TOTP code or recovery code
 */
export async function verifyLogin2Fa({ mfa_token, code }) {
    const responseBody = await apiClient.post('/auth/login/2fa', { mfa_token, code }, { silent: true });
    return responseBody.data;
}

/**
 * POST /api/v1/users/register
 * Returns: { id, first_name, last_name, email, token }
 */
export async function registerUser({
    first_name,
    last_name,
    email,
    password,
    trade_name,
    country_id,
    state_id,
    sector_id,
    can_buy,
    can_sell
}) {
    const responseBody = await apiClient.post('/users/register', {
        first_name,
        last_name,
        email,
        password,
        trade_name,
        country_id,
        state_id,
        sector_id,
        can_buy,
        can_sell
    });
    return responseBody.data;
}

/**
 * POST /api/v1/auth/password/forgot
 * Requests reset email (always returns generic 202 message)
 */
export async function requestPasswordReset(email) {
    const responseBody = await apiClient.post('/auth/password/forgot', { email }, { silent: true });
    return responseBody;
}

/**
 * POST /api/v1/auth/password/reset/validate
 * Validates token without consuming it
 */
export async function validateResetToken(token) {
    const responseBody = await apiClient.post('/auth/password/reset/validate', { token }, { silent: true });
    return responseBody.data;
}

/**
 * POST /api/v1/auth/password/reset
 * Consumes token, checks TOTP if required, enforces 5-history, changes password
 */
export async function resetPasswordWithToken({
    token,
    new_password,
    confirm_password,
    totp_code,
    recovery_code
}) {
    const responseBody = await apiClient.post('/auth/password/reset', {
        token,
        new_password,
        confirm_password,
        totp_code,
        recovery_code
    }, { silent: true });
    return responseBody.data;
}

/**
 * POST /api/v1/users/change-password
 * Updates the password; returns { token } (the current session must adopt it: AuthContext.refreshToken)
 */
export async function changePassword({ currentPassword, newPassword, confirmPassword }) {
    const responseBody = await apiClient.post('/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
    }, { silent: true });
    return responseBody.data;
}

// ─── 2FA Management ──────────────────────────────────────────────────────────

/** Bearer override for the enrollment token a user gets at login when the company requires 2FA */
const withToken = (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {});

/**
 * GET /api/v1/auth/2fa/status
 * { enabled, enabled_at, recovery_codes_remaining, company_requires_2fa, password_changed_at }
 */
export async function getTwoFactorStatus() {
    const responseBody = await apiClient.get('/auth/2fa/status');
    return responseBody.data;
}

/**
 * POST /api/v1/auth/2fa/setup
 * Returns { secret, otpauth_url }. Pass { token } to use an enrollment token instead of the session.
 */
export async function setup2Fa({ token } = {}) {
    const responseBody = await apiClient.post('/auth/2fa/setup', undefined, { silent: true, ...withToken(token) });
    return responseBody.data;
}

/**
 * POST /api/v1/auth/2fa/enable
 * Returns { recovery_codes, session }: `session` is a fresh login (enabling 2FA revokes the previous token).
 */
export async function enable2Fa(code, { token } = {}) {
    const responseBody = await apiClient.post('/auth/2fa/enable', { code }, { silent: true, ...withToken(token) });
    return responseBody.data;
}

/**
 * POST /api/v1/auth/2fa/disable
 * Returns { token } (fresh token for the current session: AuthContext.refreshToken)
 */
export async function disable2Fa({ password, code }) {
    const responseBody = await apiClient.post('/auth/2fa/disable', { password, code }, { silent: true });
    return responseBody.data;
}

/**
 * POST /api/v1/auth/2fa/recovery-codes
 */
export async function regenerateRecoveryCodes(code) {
    const responseBody = await apiClient.post('/auth/2fa/recovery-codes', { code }, { silent: true });
    return responseBody.data;
}

// ─── Session helpers ──────────────────────────────────────────────────────────

/** Save user session data (without the token) and token separately */
export function saveSession(userData) {
    const { token, ...user } = userData;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(TOKEN_KEY, token);
}

/** Replace only the JWT (the session user is unchanged), e.g. after a password or 2FA change */
export function saveToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
}

/** Load the current session from localStorage, or throw if missing */
export function loadSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
        const err = new Error('auth_required');
        err.type = 'auth_required';
        throw err;
    }
    return JSON.parse(raw);
}

/** Clear all session data */
export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
}
