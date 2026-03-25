import React from 'react';
import { Button } from "@/components/ui/button";

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
