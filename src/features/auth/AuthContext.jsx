import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import * as authApi from './services/authApi';

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

            // Try to load session from Bitobbu API or localStorage
            const currentUser = await authApi.loadSession();

            // Also keep base44 in sync if still used
            try {
                const b44User = await base44.auth.me();
                setUser({ ...currentUser, ...b44User });
            } catch (e) {
                // If base44 fails, we still have the Bitobbu user
                setUser(currentUser);
            }

            setIsAuthenticated(true);
        } catch (error) {
            const errorType = error.type ?? (error.message === 'auth_required' ? 'auth_required' : 'unknown');
            setAuthError({ type: errorType, message: error.message });
            setIsAuthenticated(false);
            setUser(null);
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
        return loggedUser;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        authApi.clearSession();
        base44.auth.logout();
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
        base44.auth.redirectToLogin(window.location.href);
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
