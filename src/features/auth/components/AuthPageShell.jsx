import React from 'react';
import { motion } from 'framer-motion';
import AuthBrandPanel from './AuthBrandPanel';

/** Same two-column layout as the login: brand panel on the left, the form on the right. */
export default function AuthPageShell({ children }) {
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
            <div className="flex-1 flex items-center justify-center bg-muted/50 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="flex items-center justify-center mb-10 lg:hidden">
                        <div className="w-[60%] h-auto flex items-center justify-center overflow-hidden">
                            <img src="/assets/logo-b.svg" alt="Bitobbu" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
