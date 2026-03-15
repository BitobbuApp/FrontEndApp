import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Values sent to the API → Spanish labels for the UI
const UNIT_OPTIONS = [
  { value: 'Units', label: 'Unidades' },
  { value: 'Kg', label: 'Kg' },
  { value: 'Liters', label: 'Litros' },
  { value: 'Meters', label: 'Metros' },
  { value: 'Boxes', label: 'Cajas' },
  { value: 'Pallets', label: 'Paletas' },
  { value: 'Tons', label: 'Toneladas' },
  { value: 'Gallons', label: 'Galones' },
];

const CATEGORIAS = [
  'Alimentos', 'Ferreteria', 'Salud', 'IT', 'Automotriz', 'Embalaje',
  'Quimicos', 'Oficina', 'Textil', 'Logistica', 'Mantenimiento',
  'Seguridad', 'Marketing', 'Legal', 'RRHH',
];

export default function RequestFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    product_service: '',
    quantity: '',
    unit_of_measure: 'Units',
    description: '',
    category: '',
    expiration_date: '',
  });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch request data if editing
  const { data: requestWrapper, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['request', id],
    queryFn: () => requestsApi.getRequestById(id),
    enabled: isEditing,
  });

  // Extract the actual request data from the wrapper if needed, or use directly
  const requestData = requestWrapper?.data || requestWrapper;

  useEffect(() => {
    if (isEditing && requestData) {
      setFormData({
        product_service: requestData.product_service || '',
        quantity: requestData.quantity || '',
        unit_of_measure: requestData.unit_of_measure || 'Units',
        description: requestData.description || '',
        category: requestData.category || '',
        expiration_date: requestData.expiration_date
          ? new Date(requestData.expiration_date).toISOString().split('T')[0]
          : '',
      });
      // Handle existing files if they are returned by the API
      // if (requestData.files) ...
    }
  }, [isEditing, requestData]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Build file attachments
      let fileAttachments = [];

      if (files.length > 0) {
        setUploading(true);
        // TODO: Replace with a proper file upload API when available
        // For now, files are not uploaded — only metadata is stored
        for (const file of files) {
          fileAttachments.push({
            url: URL.createObjectURL(file), // Temporary — replace with real upload
            file_name: file.name,
          });
        }
        setUploading(false);
      }

      const payload = {
        ...data,
        quantity: Number(data.quantity),
        files: fileAttachments.length > 0 ? fileAttachments : undefined,
      };

      // Remove empty optional fields
      if (!payload.description) delete payload.description;
      if (!payload.category) delete payload.category;
      if (!payload.expiration_date) delete payload.expiration_date;

      if (isEditing) {
        return requestsApi.updateRequest(id, payload);
      }
      return requestsApi.createRequest(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success(isEditing ? 'Solicitud actualizada' : 'Solicitud publicada exitosamente');
      navigate('/Requests'); // Redirect back to requests page
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al procesar la solicitud';
      toast.error(message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.product_service || !formData.quantity) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  if (isEditing && isLoadingRequest) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-[#1E293B]">
          {isEditing ? 'Editar Solicitud' : 'Nueva Solicitud de Cotización'}
        </h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form id="solicitud-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="producto" className="text-sm font-medium">
                Producto o Servicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="producto"
                placeholder="Ej: Papel bond carta 75g"
                value={formData.product_service}
                onChange={(e) => setFormData({ ...formData, product_service: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cantidad" className="text-sm font-medium">
                  Cantidad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cantidad"
                  type="number"
                  placeholder="100"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Unidad</Label>
                <Select
                  value={formData.unit_of_measure}
                  onValueChange={(value) => setFormData({ ...formData, unit_of_measure: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha límite (opcional)</Label>
                <Input
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm font-medium">
                Descripción (opcional)
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Agrega detalles adicionales sobre tu solicitud..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Archivos adjuntos</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-[#D2FC31] transition-colors bg-slate-50">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center gap-3 cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-slate-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">Haz clic o arrastra los archivos aquí</p>
                    <p className="text-xs text-slate-500 mt-1">Soporta PDF, JPG, PNG u hojas de cálculo</p>
                  </div>
                </label>
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 text-sm border shadow-sm"
                    >
                      <span className="truncate max-w-[200px] font-medium">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || uploading}
                className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] px-8 font-medium shadow-sm"
              >
                {(createMutation.isPending || uploading) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isEditing ? 'Guardar Cambios' : 'Publicar Solicitud'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
