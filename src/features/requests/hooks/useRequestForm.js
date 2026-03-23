import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../services/requestsApi';
import { toast } from 'sonner';

const DEFAULT_PRODUCT_FORM = {
    product_service: '',
    category: '',
    quantity: '',
    unit_of_measure: 'Units',
    delivery_state: '',
    delivery_city: '',
    payment_terms: 'Negociable',
    expiration_date: '',
    description: '',
};

const DEFAULT_SERVICE_FORM = {
    product_service: '',
    category: '',
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

    const [requestType, setRequestType] = useState(null); // 'Producto' | 'Servicio'
    const [productForm, setProductForm] = useState(DEFAULT_PRODUCT_FORM);
    const [serviceForm, setServiceForm] = useState(DEFAULT_SERVICE_FORM);
    const [files, setFiles] = useState([]);

    // ── Fetch existing request when editing ──
    const { data: requestWrapper, isLoading: isLoadingRequest } = useQuery({
        queryKey: ['request', id],
        queryFn: () => requestsApi.getRequestById(id),
        enabled: isEditing,
    });

    const requestData = requestWrapper?.data || requestWrapper;

    useEffect(() => {
        if (isEditing && requestData) {
            const isService = requestData.request_type === 'Servicio';
            setRequestType(isService ? 'Servicio' : 'Producto');
            if (isService) {
                setServiceForm({
                    product_service: requestData.product_service || '',
                    category: requestData.category || '',
                    project_description: requestData.description || '',
                    execution_date: requestData.expiration_date
                        ? new Date(requestData.expiration_date).toISOString().split('T')[0] : '',
                    scope: requestData.scope || '',
                    execution_state: requestData.delivery_state || '',
                    execution_city: requestData.delivery_city || '',
                    payment_terms: requestData.payment_terms || 'Negociable',
                    expiration_date: requestData.expiration_date
                        ? new Date(requestData.expiration_date).toISOString().split('T')[0] : '',
                });
            } else {
                setProductForm({
                    product_service: requestData.product_service || '',
                    category: requestData.category || '',
                    quantity: requestData.quantity || '',
                    unit_of_measure: requestData.unit_of_measure || 'Units',
                    delivery_state: requestData.delivery_state || '',
                    delivery_city: requestData.delivery_city || '',
                    payment_terms: requestData.payment_terms || 'Negociable',
                    expiration_date: requestData.expiration_date
                        ? new Date(requestData.expiration_date).toISOString().split('T')[0] : '',
                    description: requestData.description || '',
                });
            }
        }
    }, [isEditing, requestData]);

    // ── Mutation ──
    const mutation = useMutation({
        mutationFn: async (payload) => {
            let fileAttachments = files.map((f) => ({
                url: URL.createObjectURL(f),
                file_name: f.name,
            }));

            const data = {
                ...payload,
                request_type: requestType,
                files: fileAttachments.length > 0 ? fileAttachments : undefined,
            };

            // Strip empty optional fields
            Object.keys(data).forEach((k) => {
                if (data[k] === '' || data[k] === null || data[k] === undefined) delete data[k];
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

    // ── File handlers ──
    const handleFileChange = (e) => {
        setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    };
    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Submit ──
    const handleSubmit = () => {
        if (!requestType) { toast.error('Selecciona si es Producto o Servicio'); return; }
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
        mutation.mutate(form);
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
    };
}
