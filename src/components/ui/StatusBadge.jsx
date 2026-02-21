import React from 'react';
import { Badge } from "@/components/ui/badge";

const statusStyles = {
  'Activo': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Vencida': 'bg-red-100 text-red-700 border-red-200',
  'Cerrada': 'bg-slate-100 text-slate-700 border-slate-200',
  'Por expirar': 'bg-amber-100 text-amber-700 border-amber-200',
  'Concretada': 'bg-blue-100 text-blue-700 border-blue-200',
  'Pausada': 'bg-purple-100 text-purple-700 border-purple-200',
  'Pendiente': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Aceptada': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Rechazada': 'bg-red-100 text-red-700 border-red-200',
  'Negociando': 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function StatusBadge({ status }) {
  return (
    <Badge 
      variant="outline" 
      className={`font-medium ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}
    >
      {status}
    </Badge>
  );
}
