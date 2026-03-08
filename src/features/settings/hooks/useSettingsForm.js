import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { companyApi } from '../services/companyApi';
import { toast } from 'sonner';

export function useSettingsForm() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user, updateSession } = useAuth();

    const { data: companyData, isLoading } = useQuery({
        queryKey: ['myCompany', user?.company_id || user?.id],
        queryFn: async () => {
            if (user?.company_id) {
                const response = await companyApi.getCompanyById(user.company_id);
                return response.data; // Return the specific company object
            }
            // Fallback to filter by user if ID is missing but has_company is true (safety)
            if (user?.has_company) {
                const response = await companyApi.getMyCompany();
                return response.data;
            }
            return null;
        },
        enabled: !!user,
    });

    const company = companyData;

    const [formData, setFormData] = useState({
        trade_name: '',
        logo_url: '',
        sector: '',
        company_type: '',
        location_state: '',
        location_city: '',
        national_coverage: false,
        bio: '',
        legal_name: '',
        tax_id: '',
        founding_year: '',
        tax_address: '',
        contact_person: '',
        contact_role: '',
        whatsapp: '',
        corporate_email: '',
        interest: 'Ambos',
        interest_categories: [],
        approximate_volume: 'Medio',
        retention_agent: false,
        works_with_credit: false,
        payment_methods: [],
        email_notifications: true,
        web_notifications: true,
        whatsapp_notifications: false,
    });

    useEffect(() => {
        if (company) {
            const mainLocation = company.locations?.[0] || {};
            const primaryContact = company.contacts?.[0] || {};
            const commercial = company.commercial_profile || {};
            const settings = company.settings || {};

            setFormData((prev) => ({
                ...prev,
                trade_name: company.trade_name || company.nombre_comercial || '',
                logo_url: company.logo_url || '',
                sector: company.sector || '',
                company_type: company.company_type || company.tipo_empresa || '',
                bio: company.bio || '',
                legal_name: company.legal_name || company.nombre_legal || '',
                tax_id: company.tax_id || company.rif || '',
                founding_year: company.founding_year || company.ano_fundacion || '',
                interest: company.interest || company.interes || 'Ambos',
                approximate_volume: company.approximate_volume || company.volumen_aproximado || 'Medio',

                // Locations (Flat mapping from nested response)
                location_state: mainLocation.location_state || company.ubicacion_estado || '',
                location_city: mainLocation.location_city || company.ubicacion_ciudad || '',
                tax_address: mainLocation.tax_address || company.direccion_fiscal || '',
                national_coverage: mainLocation.national_coverage ?? company.cobertura_nacional ?? false,

                // Contacts (Flat mapping from nested response)
                contact_person: primaryContact.contact_person || company.persona_encargada || '',
                contact_role: primaryContact.position || company.cargo || '',
                whatsapp: primaryContact.whatsapp || company.whatsapp || '',
                corporate_email: primaryContact.corporate_email || company.email_corporativo || '',

                // Commercial Profile (Flat mapping from nested response)
                retention_agent: commercial.retention_agent ?? company.agente_retencion ?? false,
                works_with_credit: commercial.works_with_credit ?? company.trabaja_credito ?? false,

                // Settings (Flat mapping from nested response)
                email_notifications: settings.email_notifications ?? company.notificaciones_email ?? true,
                web_notifications: settings.web_notifications ?? company.notificaciones_web ?? true,
                whatsapp_notifications: settings.whatsapp_notifications ?? company.notificaciones_whatsapp ?? false,

                // Arrays (Map from nested response objects to simple strings)
                payment_methods: company.payment_methods?.map(pm => typeof pm === 'string' ? pm : pm.method) || company.metodos_pago || [],
                interest_categories: company.categories_of_interest?.map(cat => typeof cat === 'string' ? cat : cat.category) || company.categorias_interes || [],
            }));
        }
    }, [company]);

    const saveMutation = useMutation({
        mutationFn: async (data) => {
            if (company?.id) {
                return companyApi.updateCompany(company.id, data);
            }
            return companyApi.createCompany(data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['myCompany'] });

            // If we just created the company, we must update the session!
            // response.data will have { id, trade_name... } based on CreateCompanyOutput
            if (!company?.id && response?.data?.id) {
                updateSession({
                    has_company: true,
                    company_id: response.data.id
                });
            }

            toast.success('Compañía guardada con éxito');

            // Small delay so they read the toast, then redirect
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Error al guardar';
            toast.error(message);
        },
    });

    const uploadLogoMutation = useMutation({
        mutationFn: async (file) => {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            return file_url;
        },
        onSuccess: (url) => {
            setFormData((prev) => ({ ...prev, logo_url: url }));
            toast.success('Logo cargado');
        },
    });

    const handleSave = () => {
        saveMutation.mutate(formData);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadLogoMutation.mutate(file);
        }
    };

    const toggleCategoria = (cat) => {
        const current = formData.interest_categories || [];
        if (current.includes(cat)) {
            setFormData((prev) => ({
                ...prev,
                interest_categories: current.filter((c) => c !== cat),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                interest_categories: [...current, cat],
            }));
        }
    };

    const toggleMetodoPago = (metodo) => {
        const current = formData.payment_methods || [];
        if (current.includes(metodo)) {
            setFormData((prev) => ({
                ...prev,
                payment_methods: current.filter((m) => m !== metodo),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                payment_methods: [...current, metodo],
            }));
        }
    };

    return {
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
    };
}
