import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useAppMetadata from '../../appMetadata/hooks/useAppMetadata';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import tooltips from '@/constants/tooltips.json';

export default function LocationTab({ formData, setFormData }) {
    const { states, isLoading: isLoadingStates } = useAppMetadata();
    
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>Ubicación</CardTitle>
                <CardDescription>Dirección y cobertura de tu empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label className="flex items-center">
                        Dirección Fiscal *
                        <InfoTooltip content={tooltips.settings.location.tax_address} />
                    </Label>
                    <Textarea
                        value={formData.tax_address}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, tax_address: e.target.value }))
                        }
                        placeholder="Av. Principal, Edificio..."
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Estado *</Label>
                        <Select
                            value={formData.location_state_id?.toString()}
                            onValueChange={(v) => {
                                const selectedState = states.find(s => s.id.toString() === v);
                                setFormData((prev) => ({ 
                                    ...prev, 
                                    location_state_id: v,
                                    location_state: selectedState?.name || ''
                                }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                {states.map((e) => (
                                    <SelectItem key={e.id} value={e.id.toString()}>
                                        {e.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Ciudad</Label>
                        <Input
                            value={formData.location_city}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, location_city: e.target.value }))
                            }
                            placeholder="Caracas"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                        <p className="font-medium text-foreground flex items-center">
                            Cobertura Nacional
                            <InfoTooltip content={tooltips.settings.location.national_coverage} />
                        </p>
                        <p className="text-sm text-slate-500">¿Tu empresa opera en todo el país?</p>
                    </div>
                    <Switch
                        checked={formData.national_coverage}
                        onCheckedChange={(v) =>
                            setFormData((prev) => ({ ...prev, national_coverage: v }))
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}
