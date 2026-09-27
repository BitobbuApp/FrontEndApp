import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketplaceProduct } from './hooks/useMarketplaceProduct';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, User, Building, MapPin, Truck, Package, Package2, Lock, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoginModal from '@/features/auth/components/LoginModal';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { product, isLoading, error } = useMarketplaceProduct(id);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('Caracteristicas');
    
    // Modals
    const [authModalOpen, setAuthModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2046]"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-slate-800">Producto no encontrado</h2>
                <Button onClick={() => navigate('/Marketplace')} className="mt-4">
                    Volver al Marketplace
                </Button>
            </div>
        );
    }

    const { 
        name, 
        category, 
        photos, 
        pricing_tiers, 
        moq, 
        std_delivery_time, 
        rating, 
        description, 
        company_details 
    } = product;

    const allPhotos = photos?.length > 0 ? photos.sort((a, b) => a.sort_order - b.sort_order) : [{ url: 'https://via.placeholder.com/600' }];
    const mainPhotoUrl = allPhotos[selectedImageIndex]?.url;

    const handleRequestQuote = () => {
        if (!isAuthenticated) {
            setAuthModalOpen(true);
        } else {
            navigate('/Requests/new', { state: { product: name } });
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-slate-500 mb-6 gap-2">
                <button onClick={() => navigate('/Marketplace')} className="hover:text-[#0B2046]">Marketplace</button>
                <ChevronRight className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{category || 'Categoría'}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                
                {/* Left: Image Gallery (Col span 5) */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                        <img 
                            src={mainPhotoUrl} 
                            alt={name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {allPhotos.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {allPhotos.map((photo, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                                        selectedImageIndex === index ? 'border-[#0B2046] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={photo.url} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Center: Details (Col span 4) */}
                <div className="lg:col-span-4 flex flex-col">
                    {company_details?.trade_name && (
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            {company_details.trade_name}
                        </div>
                    )}
                    <h1 className="text-3xl font-extrabold text-[#0B2046] leading-tight mb-2">
                        {name}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                        <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 font-bold text-slate-800">{Number(company_details?.average_rating || rating || 0).toFixed(1)}</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <span>({company_details?.review_count || 0} reseñas)</span>
                    </div>

                    {/* Volume Pricing */}
                    {pricing_tiers?.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-semibold text-slate-800 mb-3">Precios por Volumen Estimados:</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {pricing_tiers.map((tier, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                                        <div className="font-bold text-[#0B2046] text-lg">
                                            ${Number(tier.price_usd).toFixed(2)}
                                            <span className="text-xs font-normal text-slate-500 ml-1">/unid</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {tier.min_quantity} {tier.max_quantity ? `- ${tier.max_quantity}` : '+'} unid
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-3 flex items-start gap-1">
                                <span className="w-4 h-4 inline-flex items-center justify-center border border-slate-400 rounded-full text-[10px]">i</span>
                                Estos precios son referenciales. El precio final dependerá de la logística, fecha de pago y negociaciones formales.
                            </p>
                        </div>
                    )}

                    {/* Logistics */}
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Pedido Mínimo</div>
                                <div className="font-semibold text-slate-800">{moq} unid</div>
                            </div>
                        </div>
                        {std_delivery_time && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Tiempo Estimado</div>
                                    <div className="font-semibold text-slate-800">{std_delivery_time}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Action Card (Col span 3) */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
                        <h3 className="text-lg font-bold text-[#0B2046] mb-2">Iniciar Negociación</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Solicita una cotización formal para obtener el precio real basado en tu volumen y ubicación.
                        </p>
                        
                        <Button 
                            onClick={handleRequestQuote}
                            className="w-full bg-[#D2FC31] hover:bg-[#c4ed2d] text-[#0B2046] font-bold text-base h-12 rounded-xl shadow-lg shadow-[#D2FC31]/20 mb-3"
                        >
                            Solicitar Cotización <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>

                        <div className="flex gap-2 mt-6 p-3 bg-green-50 text-green-700 rounded-lg text-xs leading-relaxed">
                            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p>Tus datos están protegidos. El proveedor solo recibirá la información necesaria para preparar la oferta.</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Tabs Section */}
            <div className="mt-8">
                <div className="flex border-b border-slate-200">
                    {['Caracteristicas', 'Reseñas', 'Proveedor', 'Descripción'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === tab 
                                ? 'border-[#0B2046] text-[#0B2046]' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-8 border border-t-0 border-slate-200 rounded-b-2xl bg-white min-h-[300px]">
                    
                    {activeTab === 'Caracteristicas' && (
                        <div>
                            <h3 className="font-bold text-slate-800 mb-6">Especificaciones Principales</h3>
                            {/* Static table until backend supports dynamic properties */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <div className="grid grid-cols-3 border-b border-slate-200">
                                    <div className="col-span-1 bg-slate-50 p-4 font-semibold text-slate-700 text-sm">Categoría</div>
                                    <div className="col-span-2 p-4 text-sm text-slate-600 bg-white">{category || '-'}</div>
                                </div>
                                <div className="grid grid-cols-3">
                                    <div className="col-span-1 bg-slate-50 p-4 font-semibold text-slate-700 text-sm">Estado</div>
                                    <div className="col-span-2 p-4 text-sm text-slate-600 bg-white">Nuevo</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Reseñas' && (
                        <div>
                            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-slate-100">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Reseñas de compradores</h3>
                                    <p className="text-sm text-slate-500">Basado en {company_details?.review_count || 0} calificaciones</p>
                                </div>
                                <div className="ml-auto flex items-center text-3xl font-black text-[#0B2046]">
                                    {Number(company_details?.average_rating || 0).toFixed(1)} 
                                    <div className="flex ml-3">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} className={`w-6 h-6 ${i <= Math.round(company_details?.average_rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'fill-slate-200 text-slate-200'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {company_details?.recent_reviews?.length > 0 ? (
                                <div className="space-y-6">
                                    {company_details.recent_reviews.map(review => (
                                        <div key={review.id} className="border border-slate-200 rounded-xl p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#0B2046] flex items-center justify-center text-white font-bold text-sm">
                                                        {review.author_name?.substring(0, 2).toUpperCase() || 'CV'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{review.author_name}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Reciente'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[1,2,3,4,5].map(i => (
                                                        <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'fill-slate-200 text-slate-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 italic">No hay reseñas recientes.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'Proveedor' && (
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                {company_details?.logo_url ? (
                                    <img src={company_details.logo_url} alt="Logo" className="w-16 h-16 rounded-lg object-contain border border-slate-200" />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <Building className="w-8 h-8 text-slate-400" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-xl text-[#0B2046]">{company_details?.trade_name || 'Proveedor Anónimo'}</h3>
                                    {company_details?.legal_name && (
                                        <p className="text-sm text-slate-500">{company_details.legal_name}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Descripción' && (
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4">Descripción Detallada</h3>
                            <div className="prose prose-sm text-slate-600 max-w-none">
                                {description ? (
                                    <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }} />
                                ) : (
                                    <p className="italic">No se proporcionó una descripción detallada.</p>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modals */}
            <LoginModal 
                open={authModalOpen} 
                onOpenChange={setAuthModalOpen} 
            />

        </div>
    );
}
