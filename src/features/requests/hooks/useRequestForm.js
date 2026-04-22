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
    country_id: '',
    state_id: '',
    city_id: '',
    payment_condition_id: '',
    expiration_date: '',
    description: '',
};

const DEFAULT_SERVICE_FORM = {
    product_service: '',
    category_id: '',
    description: '',
    execution_date: '',
    reach_service: '',
    country_id: '',
    state_id: '',
    city_id: '',
    payment_condition_id: '',
    expiration_date: '',
};

export default function useRequestForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const queryClient = useQueryClient();
    const [requestType, setRequestType] = useState('Producto');
    const [productForm, setProductForm] = useState(DEFAULT_PRODUCT_FORM);
    const [serviceForm, setServiceForm] = useState(DEFAULT_SERVICE_FORM);
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);

    const {
        categoryOptions,
        unitOptions,
        defaultUnitOption,
        paymentConditionOptions,
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
        
        if (requestData.files) {
            setExistingFiles(requestData.files);
        }

        if (isService) {
            setServiceForm({
                product_service: requestData.product_service || '',
                category_id: findOptionValueById(categoryOptions, requestData.category_id)
                    || findOptionValueByLabel(categoryOptions, requestData.category)
                    || '',
                description: requestData.description || '',
                execution_date: requestData.expiration_date
                    ? new Date(requestData.expiration_date).toISOString().split('T')[0]
                    : '',
                reach_service: requestData.reach_service || '',
                country_id: requestData.country_id || '',
                state_id: requestData.state_id || '',
                city_id: requestData.city_id || '',
                payment_condition_id: requestData.payment_condition_id || '',
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
            country_id: requestData.country_id || '',
            state_id: requestData.state_id || '',
            city_id: requestData.city_id || '',
            payment_condition_id: requestData.payment_condition_id || '',
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
            const { raw_files_payload, ...data } = payload;

            Object.keys(data).forEach((key) => {
                if (data[key] === '' || data[key] === null || data[key] === undefined) {
                    delete data[key];
                }
            });

            if (isEditing) {
                return requestsApi.updateRequest(id, data);
            }

            const formData = new FormData();
            formData.append('payload', JSON.stringify(data));

            if (raw_files_payload && raw_files_payload.length > 0) {
                raw_files_payload.forEach((file) => {
                    formData.append('files', file);
                });
            }

            return requestsApi.createRequest(formData);
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
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const selectedFiles = Array.from(e.target.files);
        
        const validFiles = selectedFiles.filter(f => allowedTypes.includes(f.type));
        
        if (validFiles.length < selectedFiles.length) {
            toast.error('Algunos archivos fueron ignorados. Solo se admite PDF, JPG y PNG.');
        }

        if(validFiles.length > 0) {
            setFiles((prev) => [...prev, ...validFiles]);
        }
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

        if (requestType === 'Servicio' && !serviceForm.description?.trim()) {
            toast.error('La descripción del proyecto es requerida');
            return;
        }

        const commonPayload = {
            product_service: form.product_service.trim(),
            category_id: form.category_id ? Number(form.category_id) : null,
            expiration_date: form.expiration_date || null,
            description: form.description?.trim() || null,
        };

        if (requestType === 'Producto') {
            mutation.mutate({
                ...commonPayload,
                type: 1,
                quantity: Number(productForm.quantity),
                unit_id: productForm.unit_id ? Number(productForm.unit_id) : Number(defaultUnitOption?.id) || 1,
                payment_condition_id: productForm.payment_condition_id || null,
                country_id: productForm.country_id ? Number(productForm.country_id) : 1, // Defaulting to VENEZUELA_ID if tracking allows
                state_id: productForm.state_id ? Number(productForm.state_id) : null,
                city_id: productForm.city_id ? Number(productForm.city_id) : null,
                raw_files_payload: files
            });
            return;
        }

        mutation.mutate({
            ...commonPayload,
            type: 2,
            quantity: 1,
            unit_id: Number(defaultUnitOption?.id) || 1,
            reach_service: serviceForm.reach_service?.trim() || null,
            payment_condition_id: serviceForm.payment_condition_id || null,
            country_id: serviceForm.country_id ? Number(serviceForm.country_id) : 1,
            state_id: serviceForm.state_id ? Number(serviceForm.state_id) : null,
            city_id: serviceForm.city_id ? Number(serviceForm.city_id) : null,
            raw_files_payload: files
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
        existingFiles,
        handleFileChange,
        removeFile,
        handleSubmit,
        isPending: mutation.isPending,
        isLoadingMetadata,
        categoryOptions,
        unitOptions,
        paymentConditionOptions,
    };
}
