import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  User,
  CreditCard,
  Shield,
  Bell,
  Upload,
  Save,
  Check,
  AlertCircle,
  Clock,
  BadgeCheck,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const ESTADOS_VENEZUELA = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo',
  'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'Lara',
  'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre',
  'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'
];

const SECTORES = ['Alimentos', 'Ferretería', 'Salud', 'IT', 'Automotriz', 'Embalaje', 'Químicos', 'Oficina', 'Textil', 'Logística', 'Mantenimiento', 'Seguridad', 'Marketing', 'Legal', 'RRHH'];
const TIPOS_EMPRESA = ['Fabricante', 'Mayorista', 'Distribuidor', 'Prestador de Servicios', 'Minorista'];
const METODOS_PAGO = ['Transferencia', 'Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Criptomoneda', 'Pago Móvil', 'Zelle'];

export default function Configuracion() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'empresa';

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: companyData, isLoading } = useQuery({
    queryKey: ['myCompany', user?.email],
    queryFn: () => base44.entities.Company.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const company = companyData?.[0];

  const [formData, setFormData] = useState({
    nombre_comercial: '',
    logo_url: '',
    sector: '',
    tipo_empresa: '',
    ubicacion_estado: '',
    ubicacion_ciudad: '',
    cobertura_nacional: false,
    bio: '',
    nombre_legal: '',
    rif: '',
    ano_fundacion: '',
    direccion_fiscal: '',
    persona_encargada: '',
    cargo: '',
    whatsapp: '',
    email_corporativo: '',
    interes: 'Ambos',
    categorias_interes: [],
    volumen_aproximado: 'Medio',
    agente_retencion: false,
    trabaja_credito: false,
    metodos_pago: [],
    notificaciones_email: true,
    notificaciones_web: true,
    notificaciones_whatsapp: false,
  });

  useEffect(() => {
    if (company) {
      setFormData(prev => ({
        ...prev,
        ...company,
        categorias_interes: company.categorias_interes || [],
        metodos_pago: company.metodos_pago || [],
      }));
    }
  }, [company]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (company) {
        return base44.entities.Company.update(company.id, data);
      }
      return base44.entities.Company.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      toast.success('Configuración guardada');
    },
    onError: () => {
      toast.error('Error al guardar');
    }
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      return file_url;
    },
    onSuccess: (url) => {
      setFormData(prev => ({ ...prev, logo_url: url }));
      toast.success('Logo cargado');
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadLogoMutation.mutate(file);
    }
  };

  const toggleCategoria = (cat) => {
    const current = formData.categorias_interes || [];
    if (current.includes(cat)) {
      setFormData(prev => ({ ...prev, categorias_interes: current.filter(c => c !== cat) }));
    } else {
      setFormData(prev => ({ ...prev, categorias_interes: [...current, cat] }));
    }
  };

  const toggleMetodoPago = (metodo) => {
    const current = formData.metodos_pago || [];
    if (current.includes(metodo)) {
      setFormData(prev => ({ ...prev, metodos_pago: current.filter(m => m !== metodo) }));
    } else {
      setFormData(prev => ({ ...prev, metodos_pago: [...current, metodo] }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
            Configuración
          </h1>
          <p className="text-slate-500 mt-1">
            Administra tu cuenta y preferencias
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 h-auto flex-wrap">
          <TabsTrigger value="empresa" className="gap-2">
            <Building2 className="w-4 h-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="ubicacion" className="gap-2">
            <MapPin className="w-4 h-4" />
            Ubicación
          </TabsTrigger>
          <TabsTrigger value="contacto" className="gap-2">
            <User className="w-4 h-4" />
            Contacto
          </TabsTrigger>
          <TabsTrigger value="comercial" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Comercial
          </TabsTrigger>
          <TabsTrigger value="suscripcion" className="gap-2">
            <BadgeCheck className="w-4 h-4" />
            Suscripción
          </TabsTrigger>
          <TabsTrigger value="verificacion" className="gap-2">
            <Shield className="w-4 h-4" />
            Verificación
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Empresa Tab */}
        <TabsContent value="empresa">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
              <CardDescription>Datos principales de tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200">
                  {formData.logo_url ? (
                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={handleLogoChange}
                  />
                  <label htmlFor="logo-upload">
                    <Button variant="outline" asChild className="cursor-pointer">
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadLogoMutation.isPending ? 'Cargando...' : 'Cambiar Logo'}
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-slate-500 mt-2">PNG, JPG hasta 5MB</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nombre Comercial *</Label>
                  <Input
                    value={formData.nombre_comercial}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre_comercial: e.target.value }))}
                    placeholder="Mi Empresa C.A."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre Legal *</Label>
                  <Input
                    value={formData.nombre_legal}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre_legal: e.target.value }))}
                    placeholder="Mi Empresa, C.A."
                  />
                </div>
                <div className="space-y-2">
                  <Label>RIF *</Label>
                  <Input
                    value={formData.rif}
                    onChange={(e) => setFormData(prev => ({ ...prev, rif: e.target.value }))}
                    placeholder="J-12345678-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Año de Fundación</Label>
                  <Input
                    type="number"
                    value={formData.ano_fundacion}
                    onChange={(e) => setFormData(prev => ({ ...prev, ano_fundacion: parseInt(e.target.value) }))}
                    placeholder="2010"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sector *</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, sector: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Empresa</Label>
                  <Select
                    value={formData.tipo_empresa}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, tipo_empresa: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_EMPRESA.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio / Descripción</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Describe tu empresa, productos y servicios..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ubicación Tab */}
        <TabsContent value="ubicacion">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
              <CardDescription>Dirección y cobertura de tu empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Dirección Fiscal *</Label>
                <Textarea
                  value={formData.direccion_fiscal}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion_fiscal: e.target.value }))}
                  placeholder="Av. Principal, Edificio..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Estado *</Label>
                  <Select
                    value={formData.ubicacion_estado}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, ubicacion_estado: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_VENEZUELA.map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ciudad *</Label>
                  <Input
                    value={formData.ubicacion_ciudad}
                    onChange={(e) => setFormData(prev => ({ ...prev, ubicacion_ciudad: e.target.value }))}
                    placeholder="Caracas"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-[#1E293B]">Cobertura Nacional</p>
                  <p className="text-sm text-slate-500">¿Tu empresa opera en todo el país?</p>
                </div>
                <Switch
                  checked={formData.cobertura_nacional}
                  onCheckedChange={(v) => setFormData(prev => ({ ...prev, cobertura_nacional: v }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacto Tab */}
        <TabsContent value="contacto">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>Persona y datos de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Persona Encargada *</Label>
                  <Input
                    value={formData.persona_encargada}
                    onChange={(e) => setFormData(prev => ({ ...prev, persona_encargada: e.target.value }))}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo *</Label>
                  <Input
                    value={formData.cargo}
                    onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                    placeholder="Gerente de Compras"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp *</Label>
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="+58 412 1234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Corporativo *</Label>
                  <Input
                    type="email"
                    value={formData.email_corporativo}
                    onChange={(e) => setFormData(prev => ({ ...prev, email_corporativo: e.target.value }))}
                    placeholder="contacto@empresa.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comercial Tab */}
        <TabsContent value="comercial">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Perfil Comercial</CardTitle>
              <CardDescription>Información sobre tu actividad comercial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Interés Principal *</Label>
                <RadioGroup
                  value={formData.interes}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, interes: v }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Comprar" id="comprar" />
                    <Label htmlFor="comprar">Comprar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vender" id="vender" />
                    <Label htmlFor="vender">Vender</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ambos" id="ambos" />
                    <Label htmlFor="ambos">Ambos</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Categorías de Interés</Label>
                <div className="flex flex-wrap gap-2">
                  {SECTORES.map(cat => (
                    <Badge
                      key={cat}
                      variant={formData.categorias_interes?.includes(cat) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-colors ${
                        formData.categorias_interes?.includes(cat) 
                          ? 'bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]' 
                          : 'hover:bg-slate-100'
                      }`}
                      onClick={() => toggleCategoria(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Volumen Aproximado</Label>
                <Select
                  value={formData.volumen_aproximado}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, volumen_aproximado: v }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pequeño">Pequeño</SelectItem>
                    <SelectItem value="Medio">Medio</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-[#1E293B]">Confianza y Pagos</h4>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-[#1E293B]">¿Agente de Retención?</p>
                    <p className="text-sm text-slate-500">¿Tu empresa es agente de retención de IVA?</p>
                  </div>
                  <Switch
                    checked={formData.agente_retencion}
                    onCheckedChange={(v) => setFormData(prev => ({ ...prev, agente_retencion: v }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-[#1E293B]">¿Trabajas con Crédito?</p>
                    <p className="text-sm text-slate-500">¿Ofreces o aceptas pagos a crédito?</p>
                  </div>
                  <Switch
                    checked={formData.trabaja_credito}
                    onCheckedChange={(v) => setFormData(prev => ({ ...prev, trabaja_credito: v }))}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Métodos de Pago Aceptados</Label>
                  <div className="flex flex-wrap gap-2">
                    {METODOS_PAGO.map(metodo => (
                      <Badge
                        key={metodo}
                        variant={formData.metodos_pago?.includes(metodo) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-colors ${
                          formData.metodos_pago?.includes(metodo) 
                            ? 'bg-[#1E293B] text-white hover:bg-slate-700' 
                            : 'hover:bg-slate-100'
                        }`}
                        onClick={() => toggleMetodoPago(metodo)}
                      >
                        {metodo}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suscripción Tab */}
        <TabsContent value="suscripcion">
          <div className="space-y-6">
            <Card className={`border-2 ${company?.plan_suscripcion === 'Premium' ? 'border-[#D2FC31]' : 'border-slate-200'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      company?.plan_suscripcion === 'Premium' ? 'bg-[#D2FC31]' : 'bg-slate-100'
                    }`}>
                      <BadgeCheck className={`w-8 h-8 ${
                        company?.plan_suscripcion === 'Premium' ? 'text-[#1E293B]' : 'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1E293B]">
                        Plan {company?.plan_suscripcion || 'Gratuito'}
                      </h3>
                      {company?.badge_fundador && (
                        <Badge className="bg-[#1E293B] text-white mt-1">
                          Badge Fundador - 3 meses gratis
                        </Badge>
                      )}
                    </div>
                  </div>
                  {company?.plan_suscripcion !== 'Premium' && (
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
        </TabsContent>

        {/* Verificación Tab */}
        <TabsContent value="verificacion">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Estado de Verificación</CardTitle>
              <CardDescription>Documenta tu empresa para obtener el sello verificado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`p-4 rounded-xl flex items-center gap-4 ${
                company?.estado_verificacion === 'Verificado' 
                  ? 'bg-emerald-50' 
                  : company?.estado_verificacion === 'Rechazado'
                    ? 'bg-red-50'
                    : 'bg-amber-50'
              }`}>
                {company?.estado_verificacion === 'Verificado' ? (
                  <Check className="w-8 h-8 text-emerald-600" />
                ) : company?.estado_verificacion === 'Rechazado' ? (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <Clock className="w-8 h-8 text-amber-600" />
                )}
                <div>
                  <p className={`font-semibold ${
                    company?.estado_verificacion === 'Verificado' 
                      ? 'text-emerald-700' 
                      : company?.estado_verificacion === 'Rechazado'
                        ? 'text-red-700'
                        : 'text-amber-700'
                  }`}>
                    Estado: {company?.estado_verificacion || 'Pendiente'}
                  </p>
                  {company?.motivo_rechazo && (
                    <p className="text-sm text-red-600 mt-1">{company.motivo_rechazo}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-[#1E293B]">Documentos Requeridos</h4>
                <div className="grid gap-4">
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl">
                    <p className="font-medium text-[#1E293B]">RIF de la Empresa</p>
                    <p className="text-sm text-slate-500 mb-3">Copia del registro de información fiscal</p>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Cargar Documento
                    </Button>
                  </div>
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl">
                    <p className="font-medium text-[#1E293B]">Cédula del Representante</p>
                    <p className="text-sm text-slate-500 mb-3">Cédula de identidad del representante legal</p>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Cargar Documento
                    </Button>
                  </div>
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl">
                    <p className="font-medium text-[#1E293B]">Fotos del Local</p>
                    <p className="text-sm text-slate-500 mb-3">Fotografías de tu establecimiento comercial</p>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Cargar Fotos
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones Tab */}
        <TabsContent value="notificaciones">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-[#1E293B]">Canales</h4>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-[#1E293B]">Email</p>
                    <p className="text-sm text-slate-500">Recibir notificaciones por correo</p>
                  </div>
                  <Switch
                    checked={formData.notificaciones_email}
                    onCheckedChange={(v) => setFormData(prev => ({ ...prev, notificaciones_email: v }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-[#1E293B]">Notificaciones Web</p>
                    <p className="text-sm text-slate-500">Alertas en el navegador</p>
                  </div>
                  <Switch
                    checked={formData.notificaciones_web}
                    onCheckedChange={(v) => setFormData(prev => ({ ...prev, notificaciones_web: v }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-[#1E293B]">WhatsApp</p>
                    <p className="text-sm text-slate-500">Recibir notificaciones por WhatsApp</p>
                  </div>
                  <Switch
                    checked={formData.notificaciones_whatsapp}
                    onCheckedChange={(v) => setFormData(prev => ({ ...prev, notificaciones_whatsapp: v }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
