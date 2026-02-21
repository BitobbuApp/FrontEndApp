import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  bgColor = 'bg-[#D2FC31]',
  iconColor = 'text-[#1E293B]'
}) {
  const isPositive = trend === 'up';
  
  return (
    <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-[#1E293B]">{value}</p>
          {trendValue && (
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${bgColor} opacity-10`} />
    </Card>
  );
}
