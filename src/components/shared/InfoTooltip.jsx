import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Reusable Information Tooltip component.
 * Displays an info icon (ⓘ) that shows a tooltip on hover.
 */
export const InfoTooltip = ({ content, side = "top", className = "" }) => {
  if (!content) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            type="button" 
            className={`inline-flex items-center justify-center ml-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none ${className}`}
            onClick={(e) => e.preventDefault()}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-[250px] text-center bg-slate-900 text-white border-none shadow-lg py-2 px-3">
          <p className="text-xs leading-relaxed">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
