// src/features/auth/services/authApi.js
// All auth-related HTTP calls and session management live here.

import apiClient from '@/api/axiosClient';

const SESSION_KEY = 'bitobbu_session';
const TOKEN_KEY = 'bitobbu_token';

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/users/login
 * Returns: { id, first_name, last_name, email, is_active, last_access, token }
 */
export async function loginUser(email, password) {
    // apiClient already maps response to response.data (which represents the body)
    // and expects the body to have { data: {...} } based on our backend responses.
    const responseBody = await apiClient.post('/users/login', { email, password });
    return responseBody.data;
}

/**
 * POST /api/v1/users/register
 * Returns: { id, first_name, last_name, email }
 */
export async function registerUser({
    first_name,
    last_name,
    email,
    password,
    trade_name,
    country_id,
    state_id,
    sector_id
}) {
    const responseBody = await apiClient.post('/users/register', {
        first_name,
        last_name,
        email,
        password,
        trade_name,
        country_id,
        state_id,
        sector_id
    });
    return responseBody.data;
}

// ─── Session helpers ──────────────────────────────────────────────────────────

/** Save user session data (without the token) and token separately */
export function saveSession(userData) {
    const { token, ...user } = userData;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
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
