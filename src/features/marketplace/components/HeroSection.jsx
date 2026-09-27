import React from 'react';
import { ChevronRight, Package, Truck, ShieldCheck, Zap, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection({ categories }) {
    return (
        <div className="w-full mb-10 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Categories Sidebar */}
                <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-4 text-[#0B2046]">Categorías</h3>
                    <div className="space-y-1">
                        {categories?.slice(0, 7).map((cat) => (
                            <button key={cat.id} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#0B2046] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="text-slate-400 group-hover:text-[#D2FC31]">
                                        {/* Mock icon */}
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-sm">{cat.name_es || cat.name_en}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B2046]" />
                            </button>
                        ))}
                    </div>
                    <button className="w-full mt-4 p-3 text-sm font-bold text-[#0B2046] hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2">
                        Ver todas las categorías <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Center Column: Hero Carousel & Features */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                    {/* Main Banner */}
                    <div className="bg-slate-50 rounded-2xl p-8 lg:p-12 relative overflow-hidden flex-1 shadow-sm border border-slate-100 flex items-center">
                        <div className="relative z-10 max-w-md">
                            <span className="inline-block px-3 py-1 bg-[#D2FC31]/20 text-[#0B2046] rounded-full text-xs font-bold mb-4">
                                Tecnología
                            </span>
                            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0B2046] leading-tight mb-4 tracking-tight">
                                Monitores y Equipos IT B2B
                            </h2>
                            <p className="text-slate-600 text-lg">
                                Actualiza tu flota corporativa con descuentos por volumen y garantía.
                            </p>
                        </div>
                        {/* Decorative Mock Image Area */}
                        <div className="absolute right-0 bottom-0 opacity-50 lg:opacity-100 w-1/2 h-full flex items-end justify-end pointer-events-none">
                            <div className="w-full h-full bg-gradient-to-l from-slate-200 to-transparent flex items-center justify-center">
                                <div className="w-40 h-32 bg-white rounded-lg shadow-md flex items-center justify-center border-4 border-slate-800">
                                    <span className="text-slate-300 font-bold">MONITOR</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Carousel Dots */}
                        <div className="absolute bottom-6 left-12 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <div className="w-6 h-2 rounded-full bg-[#0B2046]"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        </div>
                    </div>

                    {/* Features Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-slate-100">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <Truck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-[#0B2046] leading-tight">Fletes Nacionales</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-slate-100">
                            <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-[#0B2046] leading-tight">Proveedores Verificados</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-slate-100">
                            <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600">
                                <Zap className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-[#0B2046] leading-tight">Cotización Exprés</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm border border-slate-100">
                            <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                <PackageCheck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-[#0B2046] leading-tight">Garantía de Entrega</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recommendations */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1">
                        <h3 className="font-bold text-lg mb-4 text-[#0B2046]">Recomendados</h3>
                        <div className="space-y-4">
                            {/* Static Mock Products */}
                            <div className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <div className="w-full h-full bg-slate-300"></div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#0B2046] group-hover:text-blue-600 line-clamp-2">Cemento Portland Tipo I</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Min: 500 sacos</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <div className="w-full h-full bg-slate-300"></div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#0B2046] group-hover:text-blue-600 line-clamp-2">Tubería PVC 4"</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Min: 1200 uds</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <div className="w-full h-full bg-slate-300"></div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#0B2046] group-hover:text-blue-600 line-clamp-2">Harina de Trigo 50kg</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Min: 300 sacos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button className="w-full h-14 bg-[#0B2046] hover:bg-[#16305a] text-white font-bold text-base rounded-xl shadow-md">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Publicar Requerimiento
                    </Button>
                </div>
            </div>
        </div>
    );
}
