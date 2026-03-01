// src/api/apiClient.js
// HTTP client for all calls to the Bitobbu Fastify backend.

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api/v1';

const SESSION_KEY = 'bitobbu_session';

// ─── HTTP helpers ──────────────────────────────────────────────────────────────

async function handleResponse(res) {
    const json = await res.json();
    if (!res.ok) {
        // Map backend error format to a standard JS Error
        const message = json.message ?? json.error ?? 'Unknown error';
        const err = new Error(message);
        err.status = res.status;
        err.details = json.details ?? null;
        throw err;
    }
    return json;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/users/login
 * Returns: { id, first_name, last_name, email, is_active, last_access, token }
 */
export async function loginUser(email, password) {
    const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    // { success, message, data: { id, first_name, ..., token } }
    const json = await handleResponse(res);
    return json.data;
}

/**
 * POST /api/v1/users/register
 * Returns: { id, first_name, last_name, email }
 */
export async function registerUser({ first_name, last_name, email, password }) {
    const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, password }),
    });
    const json = await handleResponse(res);
    return json.data;
}

// ─── Session helpers ──────────────────────────────────────────────────────────

/** Save user session data (without the token) and token separately */
export function saveSession(userData) {
    const { token, ...user } = userData;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (token) localStorage.setItem('bitobbu_token', token);
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
    localStorage.removeItem('bitobbu_token');
}
