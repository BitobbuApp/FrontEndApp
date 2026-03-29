import axios from 'axios';
import { toast } from 'sonner';

// Usa la variable de entorno o un fallback local
const API_BASE = 'https://backendapp-k6x2.onrender.com/api/v1';

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

// ─── Response Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => {
        // Axios siempre envuelve la data en "response.data". 
        // Nuestro backend devuelve usualmente { data: { ... } }, así que si quieres
        // aplanarlo, podrías retornar response.data.data (opcional), pero 
        // para mantener compatibilidad con lo actual retornamos la res entera de Axios
        // o mapeamos de acuerdo a cómo devolvía el handleResponse anterior.
        // El handleResponse anterior retornaba `json`, y luego el frontend hacía `json.data`.
        // Así que aquí retornamos la respuesta parseada del body directo.
        return response.data;
    },
    (error) => {
        // Manejo centralizado de errores
        if (error.response) {
            const status = error.response.status;
            // Mensaje que viene del backend o uno genérico
            const message = error.response.data?.message || error.response.data?.error || 'Ha ocurrido un error';

            if (status === 401) {
                // No autorizado: Limpiar sesión y recargar base44 o app
                localStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(TOKEN_KEY);

                toast.error('Sesión expirada. Por favor ingresa nuevamente.');

                // Pequeño delay para que se vea el toast antes de desmotar
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            } else if (status === 403) {
                toast.error('No tienes permisos suficientes para esta acción.');
            } else if (status >= 500) {
                toast.error('Error en el servidor. Intenta de nuevo más tarde.');
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
