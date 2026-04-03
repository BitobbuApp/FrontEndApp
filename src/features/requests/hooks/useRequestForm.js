import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../services/requestsApi';
import { toast } from 'sonner';
import useAppMetadata, {
    findOptionValueById,
    findOptionValueByLabel,
} from '@/features/appMetadata/hooks/useAppMetadata';

const DEFAULT_PRODUCT_FORM = {
    product_service: '',
    category_id: '',
    quantity: '',
    unit_id: '',
    delivery_state: '',
    delivery_city: '',
    payment_terms: 'Negociable',
    expiration_date: '',
    description: '',
};

const DEFAULT_SERVICE_FORM = {
    product_service: '',
    category_id: '',
    project_description: '',
    execution_date: '',
    scope: '',
    execution_state: '',
    execution_city: '',
    payment_terms: 'Negociable',
    expiration_date: '',
};

export default function useRequestForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const queryClient = useQueryClient();
    const [requestType, setRequestType] = useState(null);
    const [productForm, setProductForm] = useState(DEFAULT_PRODUCT_FORM);
    const [serviceForm, setServiceForm] = useState(DEFAULT_SERVICE_FORM);
    const [files, setFiles] = useState([]);

    const {
        categoryOptions,
        unitOptions,
        defaultUnitOption,
        isLoading: isLoadingMetadata,
    } = useAppMetadata();

    const { data: requestWrapper, isLoading: isLoadingRequest } = useQuery({
        queryKey: ['request', id],
        queryFn: () => requestsApi.getRequestById(id),
        enabled: isEditing,
    });

    const requestData = requestWrapper?.data || requestWrapper;

    useEffect(() => {
        if (!defaultUnitOption?.value || isEditing) {
            return;
        }

        setProductForm((prev) => (
            prev.unit_id
                ? prev
                : { ...prev, unit_id: defaultUnitOption.value }
        ));
    }, [defaultUnitOption?.value, isEditing]);

    useEffect(() => {
        if (!isEditing || !requestData) {
            return;
        }

        const isService = requestData.request_type === 'Servicio';
        setRequestType(isService ? 'Servicio' : 'Producto');

        if (isService) {
            setServiceForm({
                product_service: requestData.product_service || '',
                category_id: findOptionValueById(categoryOptions, requestData.category_id)
                    || findOptionValueByLabel(categoryOptions, requestData.category)
                    || '',
                project_description: requestData.description || '',
                execution_date: requestData.expiration_date
                    ? new Date(requestData.expiration_date).toISOString().split('T')[0]
                    : '',
                scope: requestData.scope || '',
                execution_state: requestData.delivery_state || '',
                execution_city: requestData.delivery_city || '',
                payment_terms: requestData.payment_terms || 'Negociable',
                expiration_date: requestData.expiration_date
                    ? new Date(requestData.expiration_date).toISOString().split('T')[0]
                    : '',
            });
            return;
        }

        setProductForm({
            product_service: requestData.product_service || '',
            category_id: findOptionValueById(categoryOptions, requestData.category_id)
                || findOptionValueByLabel(categoryOptions, requestData.category)
                || '',
            quantity: requestData.quantity || '',
            unit_id: findOptionValueById(unitOptions, requestData.unit_id)
                || findOptionValueByLabel(unitOptions, requestData.unit_of_measure)
                || defaultUnitOption?.value
                || '',
            delivery_state: requestData.delivery_state || '',
            delivery_city: requestData.delivery_city || '',
            payment_terms: requestData.payment_terms || 'Negociable',
            expiration_date: requestData.expiration_date
                ? new Date(requestData.expiration_date).toISOString().split('T')[0]
                : '',
            description: requestData.description || '',
        });
    }, [
        defaultUnitOption?.value,
        categoryOptions,
        isEditing,
        requestData,
        unitOptions,
    ]);

    const mutation = useMutation({
        mutationFn: async (payload) => {
            const fileAttachments = files.map((file) => ({
                url: URL.createObjectURL(file),
                file_name: file.name,
            }));

            const data = {
                ...payload,
                files: fileAttachments.length > 0 ? fileAttachments : undefined,
            };

            Object.keys(data).forEach((key) => {
                if (data[key] === '' || data[key] === null || data[key] === undefined) {
                    delete data[key];
                }
            });

            return isEditing
                ? requestsApi.updateRequest(id, data)
                : requestsApi.createRequest(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            toast.success(isEditing ? 'Solicitud actualizada' : 'Solicitud publicada');
            navigate('/Requests');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al procesar la solicitud');
        },
    });

    const handleFileChange = (e) => {
        setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    };

    const handleSubmit = () => {
        if (!requestType) {
            toast.error('Selecciona si es Producto o Servicio');
            return;
        }

        const form = requestType === 'Producto' ? productForm : serviceForm;

        if (!form.product_service?.trim()) {
            toast.error(`El nombre del ${requestType} es requerido`);
            return;
        }

        if (requestType === 'Producto' && !productForm.quantity) {
            toast.error('La cantidad es requerida');
            return;
        }

        if (requestType === 'Servicio' && !serviceForm.project_description?.trim()) {
            toast.error('La descripción del proyecto es requerida');
            return;
        }

        const commonPayload = {
            product_service: form.product_service.trim(),
            category_id: form.category_id ? Number(form.category_id) : null,
            expiration_date: form.expiration_date || null,
        };

        if (requestType === 'Producto') {
            mutation.mutate({
                ...commonPayload,
                type: 1,
                quantity: Number(productForm.quantity),
                unit_id: productForm.unit_id ? Number(productForm.unit_id) : Number(defaultUnitOption?.id) || 1,
                description: productForm.description?.trim() || null,
            });
            return;
        }

        const details = [
            serviceForm.project_description?.trim(),
            serviceForm.scope?.trim() ? `Alcance: ${serviceForm.scope.trim()}` : '',
            serviceForm.execution_state?.trim()
                ? `Ubicación: ${serviceForm.execution_state.trim()}${serviceForm.execution_city?.trim() ? `, ${serviceForm.execution_city.trim()}` : ''}`
                : '',
            serviceForm.payment_terms?.trim() ? `Condiciones de pago: ${serviceForm.payment_terms.trim()}` : '',
            serviceForm.execution_date?.trim() ? `Fecha de ejecución: ${serviceForm.execution_date.trim()}` : '',
        ].filter(Boolean);

        mutation.mutate({
            ...commonPayload,
            type: 2,
            quantity: 1,
            unit_id: Number(defaultUnitOption?.id) || 1,
            description: details.join('\n\n') || null,
        });
    };

    return {
        isEditing,
        isLoadingRequest,
        requestType,
        setRequestType,
        productForm,
        setProductForm,
        serviceForm,
        setServiceForm,
        files,
        handleFileChange,
        removeFile,
        handleSubmit,
        isPending: mutation.isPending,
        isLoadingMetadata,
        categoryOptions,
        unitOptions,
    };
}
