import React from 'react';
import { Check, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SubscriptionTab({ company }) {
    return (
        <div className="space-y-6">
            <Card
                className={`border-2 ${company?.subscription_plan === 'Premium'
                    ? 'border-[#D2FC31]'
                    : 'border-slate-200'
                    }`}
            >
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-16 h-16 rounded-xl flex items-center justify-center ${company?.subscription_plan === 'Premium'
                                    ? 'bg-[#D2FC31]'
                                    : 'bg-slate-100'
                                    }`}
                            >
                                <BadgeCheck
                                    className={`w-8 h-8 ${company?.subscription_plan === 'Premium'
                                        ? 'text-[#1E293B]'
                                        : 'text-slate-400'
                                        }`}
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1E293B]">
                                    Plan {company?.subscription_plan || 'Gratuito'}
                                </h3>
                                {company?.founding_badge && (
                                    <Badge className="bg-[#1E293B] text-white mt-1">
                                        Badge Fundador - 3 meses gratis
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {company?.subscription_plan !== 'Premium' && (
                            <Button className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
                                Actualizar a Premium
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="font-semibold text-[#1E293B] mb-4">Plan Gratuito</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Perfil básico
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500" />
                                5 mensajes por día
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500" />
                                3 solicitudes activas
                            </li>
                        </ul>
                        <p className="mt-4 text-2xl font-bold text-[#1E293B]">$0/mes</p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-[#D2FC31] shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-[#1E293B]">Plan Premium</h4>
                            <Badge className="bg-[#D2FC31] text-[#1E293B]">Recomendado</Badge>
                        </div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Sello verificado
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Prioridad en búsquedas
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Catálogo activo ilimitado
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Chat ilimitado
                            </li>
                            <li className="flex items-center gap-2 text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Solicitudes ilimitadas
                            </li>
                        </ul>
                        <div className="mt-4">
                            <p className="text-2xl font-bold text-[#1E293B]">$25/mes</p>
                            <p className="text-sm text-emerald-600">$240/año (20% descuento)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
