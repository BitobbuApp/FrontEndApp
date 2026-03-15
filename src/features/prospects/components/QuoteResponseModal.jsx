import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteResponsesApi } from '@/features/requests/services/quoteResponsesApi';
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
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

export default function QuoteResponseModal({ open, onOpenChange, request }) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    unit_price: '',
    quantity: '',
    payment_conditions: '',
    delivery_time: '',
    notes: '',
  });

  // Pre-fill quantity with the requested quantity when opened
  useEffect(() => {
    if (open && request) {
      setFormData(prev => ({
        ...prev,
        quantity: request.quantity?.toString() || '',
      }));
    }
  }, [open, request]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        request_id: request.id,
        unit_price: Number(data.unit_price),
        quantity: Number(data.quantity),
      };

      if (data.payment_conditions) payload.payment_conditions = data.payment_conditions;
      if (data.delivery_time) payload.delivery_time = data.delivery_time;
      if (data.notes) payload.notes = data.notes;

      return quoteResponsesApi.createQuoteResponse(payload);
    },
    onSuccess: () => {
      // Invalidate both quote-responses if a list exists, and the marketplace requests since it might update response count
      queryClient.invalidateQueries({ queryKey: ['quote-responses'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-requests'] });
      // Also invalidate the specific request detail so it can show updated response stats
      queryClient.invalidateQueries({ queryKey: ['requestDetail', request?.id] });
      
      toast.success('Cotización enviada exitosamente');
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Error al enviar la cotización';
      toast.error(message);
    }
  });

  const resetForm = () => {
    setFormData({
      unit_price: '',
      quantity: '',
      payment_conditions: '',
      delivery_time: '',
      notes: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.unit_price || !formData.quantity) {
      toast.error('Por favor completa el precio unitario y la cantidad');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b bg-slate-50 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-[#1E293B]">
            Enviar Cotización
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Respondiendo a: <span className="font-semibold text-slate-700">{request.product_service}</span>
          </p>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form id="quote-response-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit_price" className="text-sm font-medium">
                  Precio Unitario ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Cantidad a Ofrecer <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Ej: 100"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_conditions" className="text-sm font-medium">
                Condiciones de Pago
              </Label>
              <Input
                id="payment_conditions"
                placeholder="Ej: 30 días, Contado, 50% anticipo"
                value={formData.payment_conditions}
                onChange={(e) => setFormData({ ...formData, payment_conditions: e.target.value })}
                className="h-11"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_time" className="text-sm font-medium">
                Tiempo de Entrega
              </Label>
              <Input
                id="delivery_time"
                placeholder="Ej: 1 semana, 3 días hábiles"
                value={formData.delivery_time}
                onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                className="h-11"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notas Adicionales
              </Label>
              <Textarea
                id="notes"
                placeholder="Detalles sobre el producto, variaciones o comentarios adicionales..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[100px] resize-none"
              />
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 flex-shrink-0 border-t gap-2 bg-slate-50 rounded-b-lg">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="quote-response-form"
            disabled={createMutation.isPending}
            className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] px-6 font-medium shadow-sm"
          >
            {createMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Enviar Cotización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
