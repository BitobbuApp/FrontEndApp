import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';
import { useAuth } from '@/features/auth/AuthContext';

/**
 * RoleGuard Component
 * 
 * @param {string} require - 'buy' or 'sell'
 */
export default function RoleGuard({ children, require }) {
    const { user, isAuthenticated } = useAuth();
    const { data: company, isLoading } = useMyCompany();

    // While loading company data, show nothing or a small spinner if needed
    // But since App.jsx already waits for isLoadingCompany, this should be fast
    if (isLoading) return null;

    if (!isAuthenticated || !company) {
        return <Navigate to="/login" replace />;
    }

    if (require === 'buy' && !company.can_buy) {
        console.warn('Unauthorized access to buyer route. Redirecting...');
        return <Navigate to="/Dashboard" replace />;
    }

    if (require === 'sell' && !company.can_sell) {
        console.warn('Unauthorized access to seller route. Redirecting...');
        return <Navigate to="/Dashboard" replace />;
    }

    return children;
}
