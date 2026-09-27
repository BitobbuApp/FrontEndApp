import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, MessageCircle } from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="bg-[#0f1115] text-slate-300 py-12 md:py-16 mt-8">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Top Section: Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand Column */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#D2FC31]"></div>
                            <span className="text-white text-xl font-bold tracking-wide">Bitobbu</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed pr-4">
                            Conectamos empresas con fábricas, distribuidores y mayoristas certificados en Venezuela.
                        </p>
                    </div>

                    {/* Plataforma Column */}
                    <div className="flex flex-col">
                        <h4 className="text-white font-semibold mb-6">Plataforma</h4>
                        <ul className="space-y-4">
                            <li><Link to="/nosotros" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Nosotros</Link></li>
                            <li><Link to="/como-funciona" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Cómo funciona</Link></li>
                            <li><Link to="/register?role=seller" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Ser proveedor</Link></li>
                        </ul>
                    </div>

                    {/* Soporte Column */}
                    <div className="flex flex-col">
                        <h4 className="text-white font-semibold mb-6">Soporte</h4>
                        <ul className="space-y-4">
                            <li><Link to="/faq" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Preguntas frecuentes</Link></li>
                            <li><Link to="/ayuda" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Centro de ayuda</Link></li>
                            <li><Link to="/contacto" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Aviso Legal Column */}
                    <div className="flex flex-col">
                        <h4 className="text-white font-semibold mb-6">Aviso legal</h4>
                        <ul className="space-y-4">
                            <li><Link to="/terminos" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Términos y condiciones</Link></li>
                            <li><Link to="/privacidad" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Políticas de privacidad</Link></li>
                            <li><Link to="/cookies" className="text-slate-400 hover:text-[#D2FC31] transition-colors">Política de cookies</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Section: Divider & Copyright */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm text-center md:text-left">
                        © 2026 Bitobbu. Hecho en Venezuela
                    </p>
                    
                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-[#D2FC31] hover:bg-slate-800 transition-colors">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-[#D2FC31] hover:bg-slate-800 transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-[#D2FC31] hover:bg-slate-800 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
