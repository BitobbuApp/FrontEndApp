import { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from './services/authApi';
import { connectSocket, disconnectSocket } from '@/api/socketClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [appPublicSettings, setAppPublicSettings] = useState(null);

    useEffect(() => {
        checkAppState();
    }, []);

    const checkAppState = async () => {
        try {
            setIsLoadingAuth(true);
            setAuthError(null);

            // Load session from localStorage (JWT-based)
            const currentUser = await authApi.loadSession();
            setUser(currentUser);
            setIsAuthenticated(true);
            connectSocket(); // Conectar socket tras verificar sesión existosa
        } catch (error) {
            const errorType = error.type ?? (error.message === 'auth_required' ? 'auth_required' : 'unknown');
            setAuthError({ type: errorType, message: error.message });
            setIsAuthenticated(false);
            setUser(null);
            disconnectSocket(); // Desconectar si la sesión es inválida
        } finally {
            setIsLoadingAuth(false);
        }
    };

    const login = async (email, password) => {
        const loggedUser = await authApi.loginUser(email, password);
        authApi.saveSession(loggedUser);

        setUser(loggedUser);
        setIsAuthenticated(true);
        setAuthError(null);
        connectSocket(); // Conectar socket inmediatamente después del login
        return loggedUser;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        authApi.clearSession();
        disconnectSocket(); // Asegurar desconexión local e impedir memory leaks en sockets inactivos
        // Redirect to login page
        window.location.href = '/login';
    };

    const updateSession = (updates) => {
        const newUser = { ...user, ...updates };
        setUser(newUser);

        // Persist to localStorage
        const raw = localStorage.getItem('bitobbu_session');
        if (raw) {
            const current = JSON.parse(raw);
            localStorage.setItem('bitobbu_session', JSON.stringify({ ...current, ...updates }));
        } else {
            localStorage.setItem('bitobbu_session', JSON.stringify(updates));
        }
    };

    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            isLoadingPublicSettings,
            authError,
            appPublicSettings,
            login,
            logout,
            updateSession,
            navigateToLogin,
            checkAppState,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
