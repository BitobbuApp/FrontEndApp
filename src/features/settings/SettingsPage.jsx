import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Building2,
    MapPin,
    User,
    CreditCard,
    Shield,
    ShieldCheck,
    Bell,
    Save,
    Loader2,
    BadgeCheck,
    Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/features/auth/AuthContext';
import { useSettingsForm } from './hooks/useSettingsForm';
import CompanyTab from './components/CompanyTab';
import LocationTab from './components/LocationTab';
import ContactTab from './components/ContactTab';
import CommercialTab from './components/CommercialTab';
import SubscriptionTab from './components/SubscriptionTab';
import VerificationTab from './components/VerificationTab';
import NotificationsTab from './components/NotificationsTab';
import SecurityTab from './components/SecurityTab';
import SocialMediaTab from './components/SocialMediaTab';

const NAV_GROUPS = [
    {
        label: 'Empresa',
        items: [
            { value: 'empresa', label: 'Empresa', icon: Building2 },
            { value: 'ubicacion', label: 'Ubicación', icon: MapPin },
            { value: 'contacto', label: 'Contacto', icon: User },
            { value: 'comercial', label: 'Comercial', icon: CreditCard },
            { value: 'redes', label: 'Redes sociales', icon: Share2 },
        ],
    },
    {
        label: 'Cuenta',
        items: [
            { value: 'seguridad', label: 'Seguridad', icon: Shield },
            { value: 'notificaciones', label: 'Notificaciones', icon: Bell },
        ],
    },
    {
        label: 'Plan',
        items: [
            { value: 'suscripcion', label: 'Suscripción', icon: BadgeCheck },
            { value: 'verificacion', label: 'Verificación', icon: ShieldCheck },
        ],
    },
];

// Pestañas cuyo contenido no se guarda con el formulario principal
const TABS_WITHOUT_SAVE = ['seguridad', 'suscripcion', 'verificacion'];

function SettingsNav({ activeTab, onTabChange }) {
    return (
        <nav className="rounded-3xl border border-border bg-background p-4 shadow-sm lg:sticky lg:top-4">
            <p className="hidden px-3 pb-2 text-sm text-slate-500 lg:block">
                Administra tu cuenta y preferencias
            </p>
            <div className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label} className="flex gap-1 lg:block lg:pt-3">
                        <p className="hidden px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 lg:block">
                            {group.label}
                        </p>
                        <div className="flex gap-1 lg:flex-col lg:gap-0.5">
                            {group.items.map((item) => {
                                const isActive = activeTab === item.value;
                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => onTabChange(item.value)}
                                        className={`relative flex flex-shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                            isActive
                                                ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white'
                                                : 'font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                        }`}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-[#D2FC31]" />
                                        )}
                                        <item.icon className="h-4 w-4 flex-shrink-0" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    );
}

export default function SettingsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'empresa';

    const onTabChange = (value) => {
        setSearchParams({ tab: value });
    };

    const {
        company,
        formData,
        setFormData,
        foundingYearError,
        setFoundingYearError,
        isLoading,
        saveMutation,
        logoPreview,
        handleSave,
        handleLogoChange,
        toggleCategoria,
        toggleSubcategoria,
        toggleMetodoPago,
        categoryOptions,
        getSubcategoryOptions,
        companyTypeOptions,
        paymentMethodOptions,
        companySizeOptions,
        estimatedMonthlyTransactionOptions,
    } = useSettingsForm();

    const { user } = useAuth();
    const hasCompany = user?.has_company || !!company?.id;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <aside className="lg:w-64 lg:flex-shrink-0">
                    <SettingsNav activeTab={activeTab} onTabChange={onTabChange} />
                </aside>

                <section className="min-w-0 flex-1 space-y-4">
                    {activeTab === 'empresa' && (
                        <CompanyTab
                            formData={formData}
                            setFormData={setFormData}
                            foundingYearError={foundingYearError}
                            setFoundingYearError={setFoundingYearError}
                            handleLogoChange={handleLogoChange}
                            uploadLogoPending={saveMutation.isPending}
                            sectorOptions={categoryOptions}
                            companyTypeOptions={companyTypeOptions}
                        />
                    )}
                    {activeTab === 'ubicacion' && (
                        <LocationTab formData={formData} setFormData={setFormData} />
                    )}
                    {activeTab === 'contacto' && (
                        <ContactTab formData={formData} setFormData={setFormData} />
                    )}
                    {activeTab === 'comercial' && (
                        <CommercialTab
                            formData={formData}
                            setFormData={setFormData}
                            toggleCategoria={toggleCategoria}
                            toggleSubcategoria={toggleSubcategoria}
                            toggleMetodoPago={toggleMetodoPago}
                            categoryOptions={categoryOptions}
                            getSubcategoryOptions={getSubcategoryOptions}
                            paymentMethodOptions={paymentMethodOptions}
                            companySizeOptions={companySizeOptions}
                            estimatedMonthlyTransactionOptions={estimatedMonthlyTransactionOptions}
                        />
                    )}
                    {activeTab === 'suscripcion' && <SubscriptionTab company={company} />}
                    {activeTab === 'verificacion' && <VerificationTab company={company} />}
                    {activeTab === 'notificaciones' && (
                        <NotificationsTab formData={formData} setFormData={setFormData} />
                    )}
                    {activeTab === 'seguridad' && <SecurityTab company={company} />}
                    {activeTab === 'redes' && (
                        <SocialMediaTab formData={formData} setFormData={setFormData} />
                    )}

                    {!TABS_WITHOUT_SAVE.includes(activeTab) && (
                        <div className="sticky bottom-20 z-10 flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:bottom-4">
                            <p className="text-sm text-slate-500">
                                Se guardan los datos de Empresa, Ubicación, Contacto, Comercial,
                                Redes sociales y Notificaciones.
                            </p>
                            <Button
                                onClick={handleSave}
                                disabled={saveMutation.isPending}
                                className="h-11 rounded-xl bg-[#D2FC31] px-6 font-semibold text-slate-900 hover:bg-[#c4ed2d]"
                            >
                                {saveMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {hasCompany ? 'Guardar cambios' : 'Crear compañía'}
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
