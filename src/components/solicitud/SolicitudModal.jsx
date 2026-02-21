import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
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

const UNIDADES = ['Unidades', 'Kg', 'Litros', 'Metros', 'Cajas', 'Paletas', 'Toneladas', 'Galones'];
const CATEGORIAS = ['Alimentos', 'Ferretería', 'Salud', 'IT', 'Automotriz', 'Embalaje', 'Químicos', 'Oficina', 'Textil', 'Logística', 'Mantenimiento', 'Seguridad', 'Marketing', 'Legal', 'RRHH'];

export default function SolicitudModal({ open, onOpenChange, solicitud = null }) {
  const queryClient = useQueryClient();
  const isEditing = !!solicitud;
  
  const [formData, setFormData] = useState({
    producto_servicio: solicitud?.producto_servicio || '',
    cantidad: solicitud?.cantidad || '',
    unidad_medida: solicitud?.unidad_medida || 'Unidades',
    descripcion: solicitud?.descripcion || '',
    categoria: solicitud?.categoria || '',
    fecha_vencimiento: solicitud?.fecha_vencimiento || '',
  });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      let archivos_adjuntos = [];
      
      if (files.length > 0) {
        setUploading(true);
        for (const file of files) {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          archivos_adjuntos.push(file_url);
        }
        setUploading(false);
      }

      const payload = {
        ...data,
        archivos_adjuntos,
        estado: 'Activo',
        numero_ofertas: 0,
      };

      if (isEditing) {
        return base44.entities.Solicitud.update(solicitud.id, payload);
      }
      return base44.entities.Solicitud.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      toast.success(isEditing ? 'Solicitud actualizada' : 'Solicitud publicada exitosamente');
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast.error('Error al procesar la solicitud');
    }
  });

  const resetForm = () => {
    setFormData({
      producto_servicio: '',
      cantidad: '',
      unidad_medida: 'Unidades',
      descripcion: '',
      categoria: '',
      fecha_vencimiento: '',
    });
    setFiles([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.producto_servicio || !formData.cantidad) {
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1E293B]">
            {isEditing ? 'Editar Solicitud' : 'Nueva Solicitud de Cotización'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="producto" className="text-sm font-medium">
              Producto o Servicio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="producto"
              placeholder="Ej: Papel bond carta 75g"
              value={formData.producto_servicio}
              onChange={(e) => setFormData({ ...formData, producto_servicio: e.target.value })}
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
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: parseFloat(e.target.value) })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Unidad</Label>
              <Select
                value={formData.unidad_medida}
                onValueChange={(value) => setFormData({ ...formData, unidad_medida: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES.map((unidad) => (
                    <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Categoría</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => setFormData({ ...formData, categoria: value })}
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
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Fecha límite (opcional)</Label>
            <Input
              type="date"
              value={formData.fecha_vencimiento}
              onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
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

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || uploading}
              className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
            >
              {(createMutation.isPending || uploading) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isEditing ? 'Guardar Cambios' : 'Publicar Solicitud'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
