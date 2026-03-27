import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api/v1';
const SOCKET_URL = API_BASE.replace('/api/v1', '');

// Configuramos el cliente con autoConnect en false
// Esto permite que controlemos la conexión explícitamente cuando el usuario
// inicia sesión o levanta el contexto de autenticación en la app.
export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

/**
 * Conecta el socket utilizando el token JWT almacenado.
 * Ideal para llamar desde el AuthContext al autenticarse.
 */
export const connectSocket = () => {
    const token = localStorage.getItem('bitobbu_token');
    if (!token) {
        console.warn('Intento de conexión a socket abortado: No hay token provisto.');
        return;
    }

    if (!socket.connected) {
        socket.auth = { token };
        socket.connect();
    }
};

/**
 * Desconecta el socket actual de forma segura.
 * Ideal para llamar al cerrar sesión (logout).
 */
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
        console.log('Socket desconectado exitosamente');
    }
};

// Listeners globales para debugging y reconexión general si fuese necesario
socket.on('connect', () => {
    console.log('Global Socket Connected:', socket.id);
});

socket.on('connect_error', (err) => {
    console.error('Global Socket connect_error:', err.message);
});
