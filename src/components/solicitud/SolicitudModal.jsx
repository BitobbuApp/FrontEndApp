import React, { useState } from 'react';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from "sonner";

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

export default function SolicitudModal({ open, onOpenChange, request = null }) {
  const queryClient = useQueryClient();
  const isEditing = !!request;

  const [formData, setFormData] = useState({
    product_service: request?.product_service || '',
    quantity: request?.quantity || '',
    unit_of_measure: request?.unit_of_measure || 'Units',
    description: request?.description || '',
    category: request?.category || '',
    expiration_date: request?.expiration_date
      ? new Date(request.expiration_date).toISOString().split('T')[0]
      : '',
  });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

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
        return requestsApi.updateRequest(request.id, payload);
      }
      return requestsApi.createRequest(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success(isEditing ? 'Solicitud actualizada' : 'Solicitud publicada exitosamente');
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al procesar la solicitud';
      toast.error(message);
    }
  });

  const resetForm = () => {
    setFormData({
      product_service: '',
      quantity: '',
      unit_of_measure: 'Units',
      description: '',
      category: '',
      expiration_date: '',
    });
    setFiles([]);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh] p-0 gap-0">
        {/* Header fijo */}
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
          <DialogTitle className="text-xl font-bold text-[#1E293B]">
            {isEditing ? 'Editar Solicitud' : 'Nueva Solicitud de Cotización'}
          </DialogTitle>
        </DialogHeader>

        {/* Cuerpo scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form id="solicitud-form" onSubmit={handleSubmit} className="space-y-5">
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

            <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="descripcion" className="text-sm font-medium">
                Descripción (opcional)
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Agrega detalles adicionales sobre tu solicitud..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px] resize-none"
              />
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">Archivos adjuntos</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-[#D2FC31] transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </span>
                </label>
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 text-sm"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer fijo */}
        <DialogFooter className="px-6 py-4 flex-shrink-0 border-t gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="solicitud-form"
            disabled={createMutation.isPending || uploading}
            className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
          >
            {(createMutation.isPending || uploading) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isEditing ? 'Guardar Cambios' : 'Publicar Solicitud'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
