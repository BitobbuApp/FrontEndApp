import React from 'react';
import AuthBrandPanel from './components/AuthBrandPanel';
import RegisterForm from './components/RegisterForm';

export default function RegisterPage({ onGoToLogin }) {
    return (
        <div className="min-h-screen flex">
            <AuthBrandPanel
                title={
                    <>
                        Únete a la red B2B<br />
                        <span className="text-[#D2FC31]">que transforma</span><br />
                        los negocios.
                    </>
                }
                subtitle="Regístrate gratis y empieza a cotizar hoy."
            />
            <RegisterForm onGoToLogin={onGoToLogin} />
        </div>
    );
}
