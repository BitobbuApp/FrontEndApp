import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useSettingsForm() {
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
    });

    const { data: companyData, isLoading } = useQuery({
        queryKey: ['myCompany', user?.email],
        queryFn: () => base44.entities.Company.filter({ created_by: user?.email }),
        enabled: !!user?.email,
    });

    const company = companyData?.[0];

    const [formData, setFormData] = useState({
        nombre_comercial: '',
        logo_url: '',
        sector: '',
        tipo_empresa: '',
        ubicacion_estado: '',
        ubicacion_ciudad: '',
        cobertura_nacional: false,
        bio: '',
        nombre_legal: '',
        rif: '',
        ano_fundacion: '',
        direccion_fiscal: '',
        persona_encargada: '',
        cargo: '',
        whatsapp: '',
        email_corporativo: '',
        interes: 'Ambos',
        categorias_interes: [],
        volumen_aproximado: 'Medio',
        agente_retencion: false,
        trabaja_credito: false,
        metodos_pago: [],
        notificaciones_email: true,
        notificaciones_web: true,
        notificaciones_whatsapp: false,
    });

    useEffect(() => {
        if (company) {
            setFormData((prev) => ({
                ...prev,
                ...company,
                categorias_interes: company.categorias_interes || [],
                metodos_pago: company.metodos_pago || [],
            }));
        }
    }, [company]);

    const saveMutation = useMutation({
        mutationFn: async (data) => {
            if (company) {
                return base44.entities.Company.update(company.id, data);
            }
            return base44.entities.Company.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myCompany'] });
            toast.success('Configuración guardada');
        },
        onError: () => {
            toast.error('Error al guardar');
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
        const current = formData.categorias_interes || [];
        if (current.includes(cat)) {
            setFormData((prev) => ({
                ...prev,
                categorias_interes: current.filter((c) => c !== cat),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                categorias_interes: [...current, cat],
            }));
        }
    };

    const toggleMetodoPago = (metodo) => {
        const current = formData.metodos_pago || [];
        if (current.includes(metodo)) {
            setFormData((prev) => ({
                ...prev,
                metodos_pago: current.filter((m) => m !== metodo),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                metodos_pago: [...current, metodo],
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
