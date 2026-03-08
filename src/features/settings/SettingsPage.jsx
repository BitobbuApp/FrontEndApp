import React from 'react';
import {
    Building2,
    MapPin,
    User,
    CreditCard,
    Shield,
    Bell,
    Save,
    Check,
    Loader2,
    BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import { useAuth } from '@/features/auth/AuthContext';
import { useSettingsForm } from './hooks/useSettingsForm';
import CompanyTab from './components/CompanyTab';
import LocationTab from './components/LocationTab';
import ContactTab from './components/ContactTab';
import CommercialTab from './components/CommercialTab';
import SubscriptionTab from './components/SubscriptionTab';
import VerificationTab from './components/VerificationTab';
import NotificationsTab from './components/NotificationsTab';

export default function SettingsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const defaultTab = urlParams.get('tab') || 'empresa';

    const {
        company,
        formData,
        setFormData,
        isLoading,
        saveMutation,
        uploadLogoMutation,
        handleSave,
        handleLogoChange,
        toggleCategoria,
        toggleMetodoPago,
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
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
                        Configuración
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Administra tu cuenta y preferencias
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
                >
                    {saveMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {hasCompany ? 'Guardar Cambios' : 'Crear Compañía'}
                </Button>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-6">
                <TabsList className="bg-slate-100 p-1 h-auto flex-wrap">
                    <TabsTrigger value="empresa" className="gap-2">
                        <Building2 className="w-4 h-4" />
                        Empresa
                    </TabsTrigger>
                    <TabsTrigger value="ubicacion" className="gap-2">
                        <MapPin className="w-4 h-4" />
                        Ubicación
                    </TabsTrigger>
                    <TabsTrigger value="contacto" className="gap-2">
                        <User className="w-4 h-4" />
                        Contacto
                    </TabsTrigger>
                    <TabsTrigger value="comercial" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        Comercial
                    </TabsTrigger>
                    <TabsTrigger value="suscripcion" className="gap-2">
                        <BadgeCheck className="w-4 h-4" />
                        Suscripción
                    </TabsTrigger>
                    <TabsTrigger value="verificacion" className="gap-2">
                        <Shield className="w-4 h-4" />
                        Verificación
                    </TabsTrigger>
                    <TabsTrigger value="notificaciones" className="gap-2">
                        <Bell className="w-4 h-4" />
                        Notificaciones
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="empresa">
                    <CompanyTab
                        formData={formData}
                        setFormData={setFormData}
                        handleLogoChange={handleLogoChange}
                        uploadLogoPending={uploadLogoMutation.isPending}
                    />
                </TabsContent>

                <TabsContent value="ubicacion">
                    <LocationTab formData={formData} setFormData={setFormData} />
                </TabsContent>

                <TabsContent value="contacto">
                    <ContactTab formData={formData} setFormData={setFormData} />
                </TabsContent>

                <TabsContent value="comercial">
                    <CommercialTab
                        formData={formData}
                        setFormData={setFormData}
                        toggleCategoria={toggleCategoria}
                        toggleMetodoPago={toggleMetodoPago}
                    />
                </TabsContent>

                <TabsContent value="suscripcion">
                    <SubscriptionTab company={company} />
                </TabsContent>

                <TabsContent value="verificacion">
                    <VerificationTab company={company} />
                </TabsContent>

                <TabsContent value="notificaciones">
                    <NotificationsTab formData={formData} setFormData={setFormData} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
