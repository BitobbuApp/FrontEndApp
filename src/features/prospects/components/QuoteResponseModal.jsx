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
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuoteResponseModal({ open, onOpenChange, request }) {
  const queryClient = useQueryClient();

  const { paymentConditionOptions, deliveryMethodOptions } = useAppMetadata();

  const [formData, setFormData] = useState({
    unit_price_usd: '',
    quantity: '',
    payment_condition_id: '',
    delivery_method_id: '',
    delivery_time: '',
    notes: '',
    has_guarantee: false,
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
        unit_price_usd: Number(data.unit_price_usd),
        quantity: Number(data.quantity),
        has_guarantee: !!data.has_guarantee,
      };

      if (data.payment_condition_id) payload.payment_condition_id = data.payment_condition_id;
      if (data.delivery_method_id) payload.delivery_method_id = data.delivery_method_id;
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
      unit_price_usd: '',
      quantity: '',
      payment_condition_id: '',
      delivery_method_id: '',
      delivery_time: '',
      notes: '',
      has_guarantee: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.unit_price_usd || !formData.quantity) {
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
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b bg-muted/50 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-foreground">
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
                <Label htmlFor="unit_price_usd" className="text-sm font-medium">
                  Precio Unitario ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unit_price_usd"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.unit_price_usd}
                  onChange={(e) => setFormData({ ...formData, unit_price_usd: e.target.value })}
                  className="h-11 border-slate-200 focus:border-[#D2FC31] focus:ring-[#D2FC31]/20"
                  disabled={createMutation.isPending}
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
                  className="h-11 border-slate-200 focus:border-[#D2FC31] focus:ring-[#D2FC31]/20"
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_condition_id" className="text-sm font-medium">
                Condición de Pago
              </Label>
              <Select
                value={formData.payment_condition_id || ''}
                onValueChange={(value) => setFormData({ ...formData, payment_condition_id: value })}
                disabled={createMutation.isPending}
              >
                <SelectTrigger id="payment_condition_id" className="h-11 border-slate-200">
                  <SelectValue placeholder="Seleccionar condición" />
                </SelectTrigger>
                <SelectContent>
                  {paymentConditionOptions.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="delivery_method_id" className="text-sm font-medium">
                  Método de Envío
                </Label>
                <Select
                  value={formData.delivery_method_id || ''}
                  onValueChange={(value) => setFormData({ ...formData, delivery_method_id: value })}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger id="delivery_method_id" className="h-11 border-slate-200">
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryMethodOptions.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1">
                <Label htmlFor="has_guarantee" className="text-sm font-medium">
                  ¿Ofrece Garantía?
                </Label>
                <Select
                  value={formData.has_guarantee.toString()}
                  onValueChange={(value) => setFormData({ ...formData, has_guarantee: value === 'true' })}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger id="has_guarantee" className="h-11 border-slate-200">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí, incluye garantía</SelectItem>
                    <SelectItem value="false">No incluye garantía</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                className="h-11 border-slate-200 focus:border-[#D2FC31] focus:ring-[#D2FC31]/20"
                maxLength={100}
                disabled={createMutation.isPending}
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
                className="min-h-[100px] resize-none border-slate-200 focus:border-[#D2FC31] focus:ring-[#D2FC31]/20"
                disabled={createMutation.isPending}
              />
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 flex-shrink-0 border-t gap-2 bg-muted/50 rounded-b-lg">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="quote-response-form"
            disabled={createMutation.isPending}
            className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] px-6 font-medium shadow-sm"
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
