import React from 'react';
import AuthBrandPanel from './components/AuthBrandPanel';
import LoginForm from './components/LoginForm';

export default function LoginPage({ onGoToRegister }) {
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
            <LoginForm onGoToRegister={onGoToRegister} />
        </div>
    );
}
