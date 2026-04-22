import axios from 'axios';
import { toast } from 'sonner';
import { normalizeApiError, getUserFriendlyErrorMessage } from '../utils/errors';

// Usa la variable de entorno o un fallback local
const API_BASE = import.meta.env.VITE_API_BASE;

// Importante: No importamos clearSession directamente si este archivo es usado por él
// para evitar dependencias circulares. En lugar de eso, lo disparamos con un evento o
// lo requerimos bajo demanda si es necesario, o lo limpiamos directamente.
const SESSION_KEY = 'bitobbu_session';
const TOKEN_KEY = 'bitobbu_token';

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ─── Storage URL normalizer ────────────────────────────────────────────────────
import { getStorageUrl } from '../utils/storage';

const STORAGE_URL_FIELDS = ['logo_url', 'url', 'file_url', 'formal_quote_url', 'payment_proof_url'];

function normalizeStorageUrls(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
        obj.forEach(normalizeStorageUrls);
        return obj;
    }
    for (const key of Object.keys(obj)) {
        if (STORAGE_URL_FIELDS.includes(key) && typeof obj[key] === 'string') {
            obj[key] = getStorageUrl(obj[key]);
        } else if (typeof obj[key] === 'object') {
            normalizeStorageUrls(obj[key]);
        }
    }
    return obj;
}

// ─── Response Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => {
        const data = response.data;
        normalizeStorageUrls(data);
        return data;
    },
    (error) => {
        // Manejo centralizado de errores
        if (error.response) {
            const status = error.response.status;
            const normalizedError = normalizeApiError(error.response.data, status);
            const userMessage = getUserFriendlyErrorMessage(normalizedError, "es");

            // Attach normalized data to the error for component use
            error.normalizedError = normalizedError;
            error.userMessage = userMessage;

            if (status === 401) {
                // No autorizado: Limpiar sesión y recargar base44 o app
                localStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(TOKEN_KEY);
                
                toast.error(userMessage);

                const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
                if (!isAuthPage) {
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                }
            } else if (status === 403) {
                toast.error(userMessage);
            } else if (status >= 500) {
                toast.error(userMessage);
            } else if (status === 404 || status === 409) {
                toast.error(userMessage);
            } else {
                // Para 400 y otros errores de negocio (o validación)
                // Depende de cómo quieras manejarlo. Por defecto lanzamos el error
                // para que la UI local del endpoint pueda parsearlo, pero podemos mostrar toast
                // si es requerido genéricamente. Aquí dejamos que lo maneje el try/catch local
                // si prefieres tener control granular en los componentes.
            }
        } else if (error.request) {
            // El request se hizo pero no se recibió respuesta (falla de red)
            toast.error('No se pudo conectar con el servidor.');
        } else {
            // Error configurando el request
            console.error('Error config request:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
