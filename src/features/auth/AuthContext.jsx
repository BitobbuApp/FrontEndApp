import { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from './services/authApi';
import { connectSocket, disconnectSocket } from '@/api/socketClient';
import { queryClientInstance } from '@/lib/query-client';
import { APP_METADATA_QUERY_KEY } from '@/features/appMetadata/hooks/useAppMetadata';

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

    /** Stores a full session (login, 2FA challenge, enrollment) and opens the app for that user */
    const completeLogin = (session) => {
        authApi.saveSession(session);

        setUser(session);
        setIsAuthenticated(true);
        setAuthError(null);
        connectSocket(); // Conectar socket inmediatamente después del login

        // Invalidate metadata cache to trigger re-fetch with new token (for delivery methods, etc)
        queryClientInstance.invalidateQueries({ queryKey: [APP_METADATA_QUERY_KEY] });

        return session;
    };

    /**
     * First step of the login. Resolves to:
     *  - { status: 'authenticated', user }
     *  - { status: 'mfa_required', mfaToken }: the user has 2FA, a code is needed (verifyLogin2Fa)
     *  - { status: 'enrollment_required', enrollmentToken }: the company requires 2FA and the user must set it up
     * Nothing is stored until a full session exists.
     */
    const login = async (email, password) => {
        const result = await authApi.loginUser(email, password);
        if (result?.mfa_required) return { status: 'mfa_required', mfaToken: result.mfa_token };
        if (result?.two_factor_enrollment_required) return { status: 'enrollment_required', enrollmentToken: result.enrollment_token };
        return { status: 'authenticated', user: completeLogin(result) };
    };

    /** Adopts a fresh JWT for the current session (password change, 2FA enabled/disabled bump token_version) */
    const refreshToken = (token) => authApi.saveToken(token);

    const register = async (userData) => {
        const registeredUser = await authApi.registerUser(userData);
        authApi.saveSession(registeredUser);

        setUser(registeredUser);
        setIsAuthenticated(true);
        setAuthError(null);
        connectSocket();
        
        queryClientInstance.invalidateQueries({ queryKey: [APP_METADATA_QUERY_KEY] });

        return registeredUser;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        authApi.clearSession();
        disconnectSocket(); // Asegurar desconexión local e impedir memory leaks en sockets inactivos
        
        // Invalidate metadata on logout so it re-fetches public version (without private methods)
        queryClientInstance.invalidateQueries({ queryKey: [APP_METADATA_QUERY_KEY] });

        // Redirect to marketplace/root
        window.location.href = '/';
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
            completeLogin,
            refreshToken,
            register,
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
