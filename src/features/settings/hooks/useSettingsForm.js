import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import useAppMetadata, {
    findOptionValueById,
    findOptionValueByLabel,
    toNumberIdList,
} from '@/features/appMetadata/hooks/useAppMetadata';
import { useAuth } from '@/features/auth/AuthContext';
import { companyApi } from '../services/companyApi';

const INTEREST_TO_FLAGS = {
    Comprar: { can_buy: true, can_sell: false },
    Vender: { can_buy: false, can_sell: true },
    Ambos: { can_buy: true, can_sell: true },
};

const VOLUME_UI_TO_API = {
    Pequeno: 'Small',
    Mediano: 'Medium',
    Medio: 'Medium',
    Grande: 'Large',
};

const VOLUME_API_TO_UI = {
    Small: 'Pequeno',
    Medium: 'Medio',
    Large: 'Grande',
};

const INITIAL_FORM_DATA = {
    trade_name: '',
    logo_url: '',
    sector_id: '',
    company_type_id: '',
    location_country_id: '',
    location_state_id: '',
    location_city_id: '',
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
    interest_category_ids: [],
    approximate_volume: 'Medio',
    retention_agent: false,
    works_with_credit: false,
    payment_method_ids: [],
    email_notifications: true,
    web_notifications: true,
    whatsapp_notifications: false,
};

function getInterestFromCompany(company) {
    if (company?.can_buy && company?.can_sell) {
        return 'Ambos';
    }

    if (company?.can_buy) {
        return 'Comprar';
    }

    if (company?.can_sell) {
        return 'Vender';
    }

    return company?.interest || company?.interes || 'Ambos';
}

export function useSettingsForm() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user, updateSession } = useAuth();
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const {
        categoryOptions,
        companyTypeOptions,
        paymentMethodOptions,
    } = useAppMetadata();

    const { data: companyData, isLoading } = useQuery({
        queryKey: ['myCompany', user?.company_id || user?.id],
        queryFn: async () => {
            if (user?.company_id) {
                const response = await companyApi.getCompanyById(user.company_id);
                return response.data;
            }

            if (user?.has_company) {
                const response = await companyApi.getMyCompany();
                return response.data;
            }

            return null;
        },
        enabled: !!user,
    });

    const company = companyData;

    useEffect(() => {
        if (!company) {
            return;
        }

        const mainLocation = company.locations?.[0] || {};
        const primaryContact = company.contacts?.[0] || {};
        const commercial = company.commercial_profile || {};
        const settings = company.settings || {};

        setFormData((prev) => ({
            ...prev,
            trade_name: company.trade_name || company.nombre_comercial || '',
            logo_url: company.logo_url || '',
            sector_id: findOptionValueByLabel(categoryOptions, company.sector),
            company_type_id: findOptionValueByLabel(companyTypeOptions, company.company_type),
            bio: company.bio || '',
            legal_name: company.legal_name || company.nombre_legal || '',
            tax_id: company.tax_id || company.rif || '',
            founding_year: company.founding_year || company.ano_fundacion || '',
            interest: getInterestFromCompany(company),
            approximate_volume: VOLUME_API_TO_UI[company.approximate_volume] || company.volumen_aproximado || 'Medio',
            location_country_id: mainLocation.country_id ? String(mainLocation.country_id) : '',
            location_state_id: mainLocation.state_id ? String(mainLocation.state_id) : '',
            location_city_id: mainLocation.city_id ? String(mainLocation.city_id) : '',
            location_state: mainLocation.state?.name || mainLocation.location_state || company.ubicacion_estado || '',
            location_city: mainLocation.city?.name || mainLocation.location_city || company.ubicacion_ciudad || '',
            tax_address: mainLocation.tax_address || company.direccion_fiscal || '',
            national_coverage: mainLocation.national_coverage ?? company.cobertura_nacional ?? false,
            contact_person: primaryContact.contact_person || company.persona_encargada || '',
            contact_role: primaryContact.position || company.cargo || '',
            whatsapp: primaryContact.whatsapp || company.whatsapp || '',
            corporate_email: primaryContact.corporate_email || company.email_corporativo || '',
            retention_agent: commercial.retention_agent ?? company.agente_retencion ?? false,
            works_with_credit: commercial.works_with_credit ?? company.trabaja_credito ?? false,
            email_notifications: settings.email_notifications ?? company.notificaciones_email ?? true,
            web_notifications: settings.web_notifications ?? company.notificaciones_web ?? true,
            whatsapp_notifications: settings.whatsapp_notifications ?? company.notificaciones_whatsapp ?? false,
            payment_method_ids: (company.payment_methods || [])
                .map((paymentMethod) => {
                    if (typeof paymentMethod === 'string') {
                        return findOptionValueByLabel(paymentMethodOptions, paymentMethod);
                    }

                    return findOptionValueById(paymentMethodOptions, paymentMethod.id)
                        || findOptionValueByLabel(paymentMethodOptions, paymentMethod.name || paymentMethod.method);
                })
                .filter(Boolean),
            interest_category_ids: (company.categories_of_interest || [])
                .map((category) => {
                    if (typeof category === 'string') {
                        return findOptionValueByLabel(categoryOptions, category);
                    }

                    return findOptionValueById(categoryOptions, category.id)
                        || findOptionValueByLabel(categoryOptions, category.name || category.category);
                })
                .filter(Boolean),
        }));
    }, [
        categoryOptions,
        company,
        companyTypeOptions,
        paymentMethodOptions,
    ]);

    const saveMutation = useMutation({
        mutationFn: async (data) => {
            const interestFlags = INTEREST_TO_FLAGS[data.interest] || INTEREST_TO_FLAGS.Ambos;
            const payload = {
                trade_name: data.trade_name,
                legal_name: data.legal_name || null,
                tax_id: data.tax_id || null,
                founding_year: data.founding_year ? Number(data.founding_year) : null,
                bio: data.bio || null,
                logo_url: data.logo_url || null,
                sector_id: data.sector_id ? Number(data.sector_id) : null,
                company_type_id: data.company_type_id ? Number(data.company_type_id) : null,
                can_buy: interestFlags.can_buy,
                can_sell: interestFlags.can_sell,
                approximate_volume: VOLUME_UI_TO_API[data.approximate_volume] || 'Medium',
                country_id: data.location_country_id ? Number(data.location_country_id) : null,
                state_id: data.location_state_id ? Number(data.location_state_id) : null,
                city_id: data.location_city_id ? Number(data.location_city_id) : null,
                tax_address: data.tax_address || null,
                national_coverage: !!data.national_coverage,
                contact_person: data.contact_person || null,
                contact_role: data.contact_role || null,
                whatsapp: data.whatsapp || null,
                corporate_email: data.corporate_email || null,
                retention_agent: !!data.retention_agent,
                works_with_credit: !!data.works_with_credit,
                email_notifications: !!data.email_notifications,
                web_notifications: !!data.web_notifications,
                whatsapp_notifications: !!data.whatsapp_notifications,
                payment_method_ids: toNumberIdList(data.payment_method_ids),
                interest_category_ids: toNumberIdList(data.interest_category_ids),
            };

            if (company?.id) {
                return companyApi.updateCompany(company.id, payload);
            }

            return companyApi.createCompany(payload);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['myCompany'] });

            if (!company?.id && response?.data?.id) {
                updateSession({
                    has_company: true,
                    company_id: response.data.id,
                });
            }

            toast.success('Compania guardada con exito');

            setTimeout(() => {
                navigate('/Dashboard');
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

    const toggleCategoria = (categoryId) => {
        const current = formData.interest_category_ids || [];
        if (current.includes(categoryId)) {
            setFormData((prev) => ({
                ...prev,
                interest_category_ids: current.filter((value) => value !== categoryId),
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            interest_category_ids: [...current, categoryId],
        }));
    };

    const toggleMetodoPago = (paymentMethodId) => {
        const current = formData.payment_method_ids || [];
        if (current.includes(paymentMethodId)) {
            setFormData((prev) => ({
                ...prev,
                payment_method_ids: current.filter((value) => value !== paymentMethodId),
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            payment_method_ids: [...current, paymentMethodId],
        }));
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
        categoryOptions,
        companyTypeOptions,
        paymentMethodOptions,
    };
}
