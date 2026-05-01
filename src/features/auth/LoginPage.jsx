import React, { useState } from 'react';
import AuthBrandPanel from './components/AuthBrandPanel';
import LoginForm from './components/LoginForm';
import ResetPasswordForm from './components/ResetPasswordForm';

export default function LoginPage({ onGoToRegister }) {
    const [view, setView] = useState('login'); // 'login' | 'reset'
    return (
        <div className="min-h-screen flex">
            <AuthBrandPanel
                title={
                    <>
                        La plataforma B2B<br />
                        <span className="text-[#D2FC31]">que conecta compradores</span><br />
                        con proveedores.
                    </>
                }
                subtitle="Cotiza, negocia y cierra negocios en minutos."
            />
            {view === 'login' ? (
                <LoginForm 
                    onGoToRegister={onGoToRegister} 
                    onGoToResetPassword={() => setView('reset')} 
                />
            ) : (
                <ResetPasswordForm 
                    onGoToLogin={() => setView('login')} 
                />
            )}
        </div>
    );
}
