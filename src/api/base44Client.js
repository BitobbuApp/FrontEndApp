// ─── Seed Data ────────────────────────────────────────────────────────────────

const DEV_EMAIL = 'dev@bitobbu.com';
const PROV1_EMAIL = 'prov1@ferroabc.com';
const PROV2_EMAIL = 'prov2@techsupplies.mx';
const PROV3_EMAIL = 'prov3@alifresh.com';
const PROV4_EMAIL = 'prov4@medicorp.mx';
const PROV5_EMAIL = 'prov5@autoparts.mx';
const CLIENT1_EMAIL = 'cliente1@constructora.mx';
const CLIENT2_EMAIL = 'cliente2@logistica.mx';

const SEED = {
  Company: [
    {
      id: 'company-dev',
      nombre_comercial: 'DevCo Compras',
      sector: 'Oficina',
      tipo_empresa: 'Empresa',
      ubicacion_ciudad: 'Ciudad de México',
      ubicacion_estado: 'CDMX',
      calificacion_promedio: 4.2,
      plan_suscripcion: 'Premium',
      badge_fundador: true,
      cobertura_nacional: false,
      bio: 'Empresa de compras especializada en suministros de oficina y tecnología.',
      logo_url: null,
      numero_transacciones: 12,
      numero_resenas: 8,
      interes: 'Comprar',
      created_by: DEV_EMAIL,
      created_date: '2024-10-01T10:00:00.000Z',
    },
    {
      id: 'company-1',
      nombre_comercial: 'FerroABC S.A.',
      sector: 'Ferretería',
      tipo_empresa: 'Mayorista',
      ubicacion_ciudad: 'Monterrey',
      ubicacion_estado: 'Nuevo León',
      calificacion_promedio: 4.7,
      plan_suscripcion: 'Premium',
      badge_fundador: true,
      cobertura_nacional: true,
      bio: 'Distribuidor mayorista de materiales de ferretería con 20 años de experiencia. Ofrecemos tornillos, herramientas, materiales de construcción y más.',
      logo_url: null,
      numero_transacciones: 145,
      numero_resenas: 89,
      interes: 'Vender',
      created_by: PROV1_EMAIL,
      created_date: '2024-08-15T09:00:00.000Z',
    },
    {
      id: 'company-2',
      nombre_comercial: 'TechSupplies MX',
      sector: 'IT',
      tipo_empresa: 'Distribuidor',
      ubicacion_ciudad: 'Guadalajara',
      ubicacion_estado: 'Jalisco',
      calificacion_promedio: 4.5,
      plan_suscripcion: 'Premium',
      badge_fundador: false,
      cobertura_nacional: true,
      bio: 'Distribuidor autorizado de equipos de cómputo, periféricos y consumibles de oficina. Marcas HP, Dell, Epson y más.',
      logo_url: null,
      numero_transacciones: 98,
      numero_resenas: 61,
      interes: 'Vender',
      created_by: PROV2_EMAIL,
      created_date: '2024-09-01T11:00:00.000Z',
    },
    {
      id: 'company-3',
      nombre_comercial: 'AliFresh Alimentos',
      sector: 'Alimentos',
      tipo_empresa: 'Fabricante',
      ubicacion_ciudad: 'Querétaro',
      ubicacion_estado: 'Querétaro',
      calificacion_promedio: 4.3,
      plan_suscripcion: 'Gratuito',
      badge_fundador: false,
      cobertura_nacional: false,
      bio: 'Proveedor de alimentos procesados y materias primas para el sector restaurantero e industrial. Certificación HACCP.',
      logo_url: null,
      numero_transacciones: 54,
      numero_resenas: 32,
      interes: 'Ambos',
      created_by: PROV3_EMAIL,
      created_date: '2024-09-20T08:30:00.000Z',
    },
    {
      id: 'company-4',
      nombre_comercial: 'MediCorp Supply',
      sector: 'Salud',
      tipo_empresa: 'Distribuidor',
      ubicacion_ciudad: 'Ciudad de México',
      ubicacion_estado: 'CDMX',
      calificacion_promedio: 4.8,
      plan_suscripcion: 'Premium',
      badge_fundador: true,
      cobertura_nacional: true,
      bio: 'Proveedor de insumos médicos y hospitalarios. Guantes, cubrebocas, material de curación y equipos de diagnóstico.',
      logo_url: null,
      numero_transacciones: 210,
      numero_resenas: 134,
      interes: 'Vender',
      created_by: PROV4_EMAIL,
      created_date: '2024-07-10T14:00:00.000Z',
    },
    {
      id: 'company-5',
      nombre_comercial: 'AutoParts Monterrey',
      sector: 'Automotriz',
      tipo_empresa: 'Mayorista',
      ubicacion_ciudad: 'San Nicolás',
      ubicacion_estado: 'Nuevo León',
      calificacion_promedio: 3.9,
      plan_suscripcion: 'Gratuito',
      badge_fundador: false,
      cobertura_nacional: false,
      bio: 'Venta de refacciones y accesorios automotrices al mayoreo. Servicio a flotillas y talleres.',
      logo_url: null,
      numero_transacciones: 37,
      numero_resenas: 18,
      interes: 'Vender',
      created_by: PROV5_EMAIL,
      created_date: '2024-11-05T16:00:00.000Z',
    },
  ],

  Solicitud: [
    // ── Solicitudes del usuario dev (aparecen en MisSolicitudes) ──
    {
      id: 'solicitud-1',
      producto_servicio: 'Tornillos M8 x 25mm',
      cantidad: 5000,
      unidad_medida: 'piezas',
      estado: 'Activo',
      categoria: 'Ferretería',
      descripcion: 'Tornillos cabeza hexagonal M8 x 25mm en acero inoxidable. Se requieren certificados de calidad.',
      fecha_vencimiento: '2026-03-15T23:59:00.000Z',
      numero_ofertas: 3,
      created_by: DEV_EMAIL,
      created_date: '2026-02-10T09:00:00.000Z',
    },
    {
      id: 'solicitud-2',
      producto_servicio: 'Papel Bond A4 75g',
      cantidad: 200,
      unidad_medida: 'resmas',
      estado: 'Activo',
      categoria: 'Oficina',
      descripcion: 'Papel bond blanco A4 75g/m2, en paquetes de 500 hojas. Entrega en CDMX.',
      fecha_vencimiento: '2026-03-01T23:59:00.000Z',
      numero_ofertas: 2,
      created_by: DEV_EMAIL,
      created_date: '2026-02-12T10:00:00.000Z',
    },
    {
      id: 'solicitud-3',
      producto_servicio: 'Laptop Dell Inspiron 15',
      cantidad: 10,
      unidad_medida: 'unidades',
      estado: 'Pausada',
      categoria: 'IT',
      descripcion: 'Laptops Dell Inspiron 15 i5 12va gen, 8GB RAM, 512GB SSD. Con garantía de 1 año.',
      fecha_vencimiento: null,
      numero_ofertas: 1,
      created_by: DEV_EMAIL,
      created_date: '2026-01-28T14:30:00.000Z',
    },
    {
      id: 'solicitud-4',
      producto_servicio: 'Guantes de Látex Desechables',
      cantidad: 500,
      unidad_medida: 'cajas',
      estado: 'Concretada',
      categoria: 'Salud',
      descripcion: 'Guantes de látex sin polvo, talla M y L, caja x100 piezas.',
      fecha_vencimiento: '2026-01-20T23:59:00.000Z',
      numero_ofertas: 4,
      created_by: DEV_EMAIL,
      created_date: '2025-12-15T09:00:00.000Z',
    },
    {
      id: 'solicitud-5',
      producto_servicio: 'Aceite de Oliva Extra Virgen',
      cantidad: 100,
      unidad_medida: 'litros',
      estado: 'Por expirar',
      categoria: 'Alimentos',
      descripcion: 'Aceite de oliva extra virgen en envase de 1L. Primera prensa en frío.',
      fecha_vencimiento: '2026-02-25T23:59:00.000Z',
      numero_ofertas: 0,
      created_by: DEV_EMAIL,
      created_date: '2026-02-01T11:00:00.000Z',
    },
    // ── Solicitudes de otros usuarios (aparecen en PosiblesClientes) ──
    {
      id: 'solicitud-6',
      producto_servicio: 'Cemento Portland Tipo I',
      cantidad: 300,
      unidad_medida: 'sacos',
      estado: 'Activo',
      categoria: 'Ferretería',
      descripcion: 'Cemento Portland Tipo I en sacos de 50kg. Requiere ficha técnica y entrega en obra Guadalajara.',
      fecha_vencimiento: '2026-03-10T23:59:00.000Z',
      numero_ofertas: 0,
      created_by: CLIENT1_EMAIL,
      created_date: '2026-02-18T08:00:00.000Z',
    },
    {
      id: 'solicitud-7',
      producto_servicio: 'Uniforme Corporativo Completo',
      cantidad: 80,
      unidad_medida: 'juegos',
      estado: 'Activo',
      categoria: 'Textil',
      descripcion: 'Uniforme pantalón + camisa con bordado de logo. Tallas variadas. Entrega en Monterrey en 15 días.',
      fecha_vencimiento: '2026-03-05T23:59:00.000Z',
      numero_ofertas: 0,
      created_by: CLIENT2_EMAIL,
      created_date: '2026-02-17T15:00:00.000Z',
    },
    {
      id: 'solicitud-8',
      producto_servicio: 'Cartuchos de Tinta HP 664',
      cantidad: 50,
      unidad_medida: 'piezas',
      estado: 'Activo',
      categoria: 'Oficina',
      descripcion: 'Cartuchos originales HP 664 tricolor y negro. Compatible con HP DeskJet 2375.',
      fecha_vencimiento: '2026-02-28T23:59:00.000Z',
      numero_ofertas: 0,
      created_by: CLIENT1_EMAIL,
      created_date: '2026-02-19T13:00:00.000Z',
    },
  ],

  Oferta: [
    // ── Ofertas recibidas por dev user (para Dashboard y Ofertas) ──
    {
      id: 'oferta-1',
      solicitud_id: 'solicitud-1',
      producto_nombre: 'Tornillos M8 x 25mm',
      proveedor_id: PROV1_EMAIL,
      proveedor_nombre: 'FerroABC S.A.',
      proveedor_calificacion: 4.7,
      precio_unitario: 2.5,
      cantidad: 5000,
      condiciones_pago: 'Crédito 30 días',
      tiempo_entrega: '3 días hábiles',
      estado: 'Pendiente',
      es_proactiva: false,
      comprador_id: DEV_EMAIL,
      created_date: '2026-02-14T10:00:00.000Z',
    },
    {
      id: 'oferta-2',
      solicitud_id: 'solicitud-1',
      producto_nombre: 'Tornillos M8 x 25mm',
      proveedor_id: PROV2_EMAIL,
      proveedor_nombre: 'TechSupplies MX',
      proveedor_calificacion: 4.5,
      precio_unitario: 2.8,
      cantidad: 5000,
      condiciones_pago: 'Contado',
      tiempo_entrega: '2 días hábiles',
      estado: 'Pendiente',
      es_proactiva: false,
      comprador_id: DEV_EMAIL,
      created_date: '2026-02-15T09:30:00.000Z',
    },
    {
      id: 'oferta-3',
      solicitud_id: 'solicitud-2',
      producto_nombre: 'Papel Bond A4 75g',
      proveedor_id: PROV2_EMAIL,
      proveedor_nombre: 'TechSupplies MX',
      proveedor_calificacion: 4.5,
      precio_unitario: 95,
      cantidad: 200,
      condiciones_pago: 'Crédito 15 días',
      tiempo_entrega: '1 día hábil',
      estado: 'Pendiente',
      es_proactiva: false,
      comprador_id: DEV_EMAIL,
      created_date: '2026-02-16T11:00:00.000Z',
    },
    {
      id: 'oferta-4',
      solicitud_id: null,
      producto_nombre: 'Guantes Nitrilo Premium',
      proveedor_id: PROV4_EMAIL,
      proveedor_nombre: 'MediCorp Supply',
      proveedor_calificacion: 4.8,
      precio_unitario: 180,
      cantidad: 100,
      condiciones_pago: 'Contado',
      tiempo_entrega: '2 días hábiles',
      estado: 'Pendiente',
      es_proactiva: true,
      comprador_id: DEV_EMAIL,
      created_date: '2026-02-17T14:00:00.000Z',
    },
    {
      id: 'oferta-5',
      solicitud_id: 'solicitud-4',
      producto_nombre: 'Guantes de Látex Desechables',
      proveedor_id: PROV4_EMAIL,
      proveedor_nombre: 'MediCorp Supply',
      proveedor_calificacion: 4.8,
      precio_unitario: 165,
      cantidad: 500,
      condiciones_pago: 'Crédito 30 días',
      tiempo_entrega: '5 días hábiles',
      estado: 'Aceptada',
      es_proactiva: false,
      comprador_id: DEV_EMAIL,
      created_date: '2026-01-05T08:00:00.000Z',
    },
    {
      id: 'oferta-6',
      solicitud_id: null,
      producto_nombre: 'Aceite Vegetal Refinado 20L',
      proveedor_id: PROV3_EMAIL,
      proveedor_nombre: 'AliFresh Alimentos',
      proveedor_calificacion: 4.3,
      precio_unitario: 320,
      cantidad: 50,
      condiciones_pago: 'Contado',
      tiempo_entrega: '4 días hábiles',
      estado: 'Rechazada',
      es_proactiva: true,
      comprador_id: DEV_EMAIL,
      motivo_rechazo: 'El precio está fuera de presupuesto',
      created_date: '2026-02-05T10:00:00.000Z',
    },
  ],

  Transaccion: [
    {
      id: 'transaccion-1',
      comprador_id: DEV_EMAIL,
      proveedor_id: PROV4_EMAIL,
      producto: 'Guantes de Látex Desechables',
      cantidad: 500,
      monto_total: 82500,
      estado: 'Completada',
      created_date: '2026-01-18T10:00:00.000Z',
    },
    {
      id: 'transaccion-2',
      comprador_id: DEV_EMAIL,
      proveedor_id: PROV2_EMAIL,
      producto: 'Tóner HP LaserJet 85A',
      cantidad: 20,
      monto_total: 14800,
      estado: 'Completada',
      created_date: '2025-12-20T14:00:00.000Z',
    },
    {
      id: 'transaccion-3',
      comprador_id: DEV_EMAIL,
      proveedor_id: PROV1_EMAIL,
      producto: 'Cable UTP Cat6 x 300m',
      cantidad: 5,
      monto_total: 7250,
      estado: 'Completada',
      created_date: '2025-11-30T09:00:00.000Z',
    },
  ],

  ProductoCatalogo: [
    {
      id: 'producto-1',
      nombre: 'Taladro Percutor 700W',
      descripcion: 'Taladro percutor profesional 700W, mandril 13mm, maletín incluido. Ideal para concreto y metal.',
      proveedor_id: PROV1_EMAIL,
      proveedor_nombre: 'FerroABC S.A.',
      categoria: 'Ferretería',
      tipo_proveedor: 'Mayorista',
      precio: 1250,
      moq: 5,
      calificacion: 4.6,
      fotos_urls: [
        'https://placehold.co/400x400/D2FC31/1E293B?text=Taladro',
        'https://placehold.co/400x400/1E293B/D2FC31?text=Detalle',
      ],
      video_url: null,
      activo: true,
      created_date: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'producto-2',
      nombre: 'Laptop HP 250 G9 i5',
      descripcion: 'Laptop HP 250 G9, Intel Core i5 12va gen, 8GB RAM DDR4, 512GB SSD NVMe, pantalla 15.6" FHD.',
      proveedor_id: PROV2_EMAIL,
      proveedor_nombre: 'TechSupplies MX',
      categoria: 'IT',
      tipo_proveedor: 'Distribuidor',
      precio: 12900,
      moq: 3,
      calificacion: 4.4,
      fotos_urls: [
        'https://placehold.co/400x400/94A3B8/1E293B?text=Laptop',
      ],
      video_url: null,
      activo: true,
      created_date: '2026-01-15T10:00:00.000Z',
    },
    {
      id: 'producto-3',
      nombre: 'Papel Bond A4 Caja x10 Resmas',
      descripcion: 'Papel Bond blanco A4 75g/m2, caja con 10 resmas de 500 hojas. Blancura 92%. Entrega en 24hr CDMX.',
      proveedor_id: PROV2_EMAIL,
      proveedor_nombre: 'TechSupplies MX',
      categoria: 'Oficina',
      tipo_proveedor: 'Distribuidor',
      precio: 890,
      moq: 10,
      calificacion: 4.2,
      fotos_urls: [
        'https://placehold.co/400x400/F1F5F9/1E293B?text=Papel+A4',
      ],
      video_url: null,
      activo: true,
      created_date: '2026-01-20T11:00:00.000Z',
    },
    {
      id: 'producto-4',
      nombre: 'Guantes Nitrilo Desechables Caja x100',
      descripcion: 'Guantes de nitrilo sin polvo, color azul, talla M. Resistentes a productos químicos. Certificación CE.',
      proveedor_id: PROV4_EMAIL,
      proveedor_nombre: 'MediCorp Supply',
      categoria: 'Salud',
      tipo_proveedor: 'Distribuidor',
      precio: 185,
      moq: 50,
      calificacion: 4.9,
      fotos_urls: [
        'https://placehold.co/400x400/BFDBFE/1E293B?text=Guantes',
        'https://placehold.co/400x400/93C5FD/1E293B?text=Tallas',
      ],
      video_url: null,
      activo: true,
      created_date: '2026-01-25T08:00:00.000Z',
    },
    {
      id: 'producto-5',
      nombre: 'Aceite de Oliva Extra Virgen 5L',
      descripcion: 'Aceite de oliva extra virgen, primera prensa en frío. Envase PET 5 litros. Ideal para uso industrial y restaurantes.',
      proveedor_id: PROV3_EMAIL,
      proveedor_nombre: 'AliFresh Alimentos',
      categoria: 'Alimentos',
      tipo_proveedor: 'Fabricante',
      precio: 780,
      moq: 20,
      calificacion: 4.1,
      fotos_urls: [
        'https://placehold.co/400x400/FEF08A/1E293B?text=Aceite+Oliva',
      ],
      video_url: null,
      activo: true,
      created_date: '2026-02-01T09:30:00.000Z',
    },
    {
      id: 'producto-6',
      nombre: 'Filtro de Aceite Universal',
      descripcion: 'Filtro de aceite compatible con motores 1.4 a 2.0L. Marcas Toyota, VW, Nissan. Garantía de calidad.',
      proveedor_id: PROV5_EMAIL,
      proveedor_nombre: 'AutoParts Monterrey',
      categoria: 'Automotriz',
      tipo_proveedor: 'Mayorista',
      precio: 65,
      moq: 100,
      calificacion: 3.8,
      fotos_urls: [
        'https://placehold.co/400x400/FCA5A5/1E293B?text=Filtro+Aceite',
      ],
      video_url: null,
      activo: true,
      created_date: '2026-02-05T14:00:00.000Z',
    },
    {
      id: 'producto-7',
      nombre: 'Monitor LG 24" Full HD',
      descripcion: 'Monitor LG 24MK430H-B, 24 pulgadas Full HD IPS, 75Hz, FreeSync, HDMI + VGA.',
      proveedor_id: PROV2_EMAIL,
      proveedor_nombre: 'TechSupplies MX',
      categoria: 'IT',
      tipo_proveedor: 'Distribuidor',
      precio: 3450,
      moq: 2,
      calificacion: 4.7,
      fotos_urls: [
        'https://placehold.co/400x400/C7D2FE/1E293B?text=Monitor+LG',
      ],
      video_url: null,
      activo: true,
      created_date: '2026-02-08T10:00:00.000Z',
    },
    {
      id: 'producto-8',
      nombre: 'Kit Tornillería M6-M10 Surtido',
      descripcion: 'Kit surtido de 500 piezas: tornillos, tuercas y rondanas M6, M8 y M10 acero galvanizado. Estuche organizador.',
      proveedor_id: PROV1_EMAIL,
      proveedor_nombre: 'FerroABC S.A.',
      categoria: 'Ferretería',
      tipo_proveedor: 'Mayorista',
      precio: 340,
      moq: 10,
      calificacion: 4.5,
      fotos_urls: [
        'https://placehold.co/400x400/D2FC31/1E293B?text=Kit+Tornillos',
      ],
      video_url: null,
      activo: true,
      created_date: '2026-02-10T16:00:00.000Z',
    },
  ],

  Conversacion: [
    {
      id: 'conv-1',
      participante_1_id: DEV_EMAIL,
      participante_2_id: PROV1_EMAIL,
      participante_1_nombre: 'DevCo Compras',
      participante_2_nombre: 'FerroABC S.A.',
      participante_1_logo: null,
      participante_2_logo: null,
      ultimo_mensaje: 'Perfecto, confirmo el pedido para el lunes.',
      fecha_ultimo_mensaje: '2026-02-20T16:45:00.000Z',
      mensajes_no_leidos_1: 1,
      mensajes_no_leidos_2: 0,
      created_date: '2026-02-14T10:00:00.000Z',
    },
    {
      id: 'conv-2',
      participante_1_id: PROV4_EMAIL,
      participante_2_id: DEV_EMAIL,
      participante_1_nombre: 'MediCorp Supply',
      participante_2_nombre: 'DevCo Compras',
      participante_1_logo: null,
      participante_2_logo: null,
      ultimo_mensaje: '¿Podría enviarnos la ficha técnica del producto?',
      fecha_ultimo_mensaje: '2026-02-19T11:20:00.000Z',
      mensajes_no_leidos_1: 0,
      mensajes_no_leidos_2: 2,
      created_date: '2026-02-17T14:00:00.000Z',
    },
    {
      id: 'conv-3',
      participante_1_id: DEV_EMAIL,
      participante_2_id: PROV2_EMAIL,
      participante_1_nombre: 'DevCo Compras',
      participante_2_nombre: 'TechSupplies MX',
      participante_1_logo: null,
      participante_2_logo: null,
      ultimo_mensaje: 'Buenos días, ¿tienen disponible el modelo i7?',
      fecha_ultimo_mensaje: '2026-02-18T09:05:00.000Z',
      mensajes_no_leidos_1: 0,
      mensajes_no_leidos_2: 0,
      created_date: '2026-02-16T11:00:00.000Z',
    },
  ],

  Mensaje: [
    {
      id: 'msg-1',
      conversacion_id: 'conv-1',
      remitente_id: DEV_EMAIL,
      destinatario_id: PROV1_EMAIL,
      contenido: 'Hola, me interesa la oferta de tornillos M8. ¿Podría mejorar el precio para 5000 piezas?',
      archivo_adjunto_url: null,
      leido: true,
      created_date: '2026-02-14T10:05:00.000Z',
    },
    {
      id: 'msg-2',
      conversacion_id: 'conv-1',
      remitente_id: PROV1_EMAIL,
      destinatario_id: DEV_EMAIL,
      contenido: 'Buenos días. Para ese volumen podemos ofrecer $2.40/pieza con envío incluido a CDMX. ¿Le parece?',
      archivo_adjunto_url: null,
      leido: true,
      created_date: '2026-02-14T10:30:00.000Z',
    },
    {
      id: 'msg-3',
      conversacion_id: 'conv-1',
      remitente_id: DEV_EMAIL,
      destinatario_id: PROV1_EMAIL,
      contenido: 'Perfecto, confirmo el pedido para el lunes.',
      archivo_adjunto_url: null,
      leido: false,
      created_date: '2026-02-20T16:45:00.000Z',
    },
    {
      id: 'msg-4',
      conversacion_id: 'conv-2',
      remitente_id: PROV4_EMAIL,
      destinatario_id: DEV_EMAIL,
      contenido: 'Estimado cliente, le compartimos nuestra oferta de guantes nitrilo premium. Tenemos stock inmediato.',
      archivo_adjunto_url: null,
      leido: true,
      created_date: '2026-02-17T14:10:00.000Z',
    },
    {
      id: 'msg-5',
      conversacion_id: 'conv-2',
      remitente_id: DEV_EMAIL,
      destinatario_id: PROV4_EMAIL,
      contenido: '¿Podría enviarnos la ficha técnica del producto?',
      archivo_adjunto_url: null,
      leido: false,
      created_date: '2026-02-19T11:20:00.000Z',
    },
    {
      id: 'msg-6',
      conversacion_id: 'conv-2',
      remitente_id: PROV4_EMAIL,
      destinatario_id: DEV_EMAIL,
      contenido: 'Con gusto, aquí le adjunto la ficha técnica y certificados.',
      archivo_adjunto_url: 'https://placehold.co/400x400/D2FC31/1E293B?text=PDF',
      leido: false,
      created_date: '2026-02-19T11:35:00.000Z',
    },
    {
      id: 'msg-7',
      conversacion_id: 'conv-3',
      remitente_id: DEV_EMAIL,
      destinatario_id: PROV2_EMAIL,
      contenido: 'Buenos días, ¿tienen disponible el modelo i7?',
      archivo_adjunto_url: null,
      leido: true,
      created_date: '2026-02-18T09:05:00.000Z',
    },
  ],
};

// ─── Mock Entity Factory ───────────────────────────────────────────────────────

const makeEntityMock = (entityName) => {
  const store = [...(SEED[entityName] ?? [])];

  return {
    list: async (_order) => [...store],

    filter: async (filters = {}, _order, _limit) => {
      let result = [...store];
      if (filters && Object.keys(filters).length > 0) {
        result = result.filter((item) =>
          Object.entries(filters).every(([key, value]) => item[key] === value)
        );
      }
      if (_limit) result = result.slice(0, _limit);
      return result;
    },

    get: async (id) => store.find((item) => item.id === id) ?? null,

    create: async (data) => {
      const newItem = {
        id: crypto.randomUUID(),
        created_date: new Date().toISOString(),
        created_by: DEV_EMAIL,
        ...data,
      };
      store.push(newItem);
      return newItem;
    },

    update: async (id, data) => {
      const index = store.findIndex((item) => item.id === id);
      if (index !== -1) {
        store[index] = { ...store[index], ...data };
        return store[index];
      }
      return { id, ...data };
    },

    delete: async (_id) => {
      const index = store.findIndex((item) => item.id === _id);
      if (index !== -1) store.splice(index, 1);
    },
  };
};

// Proxy: crea un mock para cualquier entidad que se acceda dinámicamente
const entityCache = Object.fromEntries(
  Object.keys(SEED).map((name) => [name, makeEntityMock(name)])
);

const entitiesProxy = new Proxy(entityCache, {
  get: (cache, entityName) => {
    if (!cache[entityName]) {
      cache[entityName] = makeEntityMock(entityName);
    }
    return cache[entityName];
  },
});

// ─── Sesión mock con localStorage ─────────────────────────────────────────────

const SESSION_KEY = 'bitobbu_mock_session';

const MOCK_USERS = {
  [DEV_EMAIL]: {
    id: 'dummy-user-1',
    email: DEV_EMAIL,
    full_name: 'Dev User',
    avatar: null,
    password: '123456',
  },
};

// ─── Cliente base44 ────────────────────────────────────────────────────────────

export const base44 = {
  appLogs: {
    logUserInApp: async (_pageName) => {},
  },
  auth: {
    me: async () => {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) {
        const err = new Error('auth_required');
        err.type = 'auth_required';
        throw err;
      }
      return JSON.parse(raw);
    },
    login: async (email, password) => {
      const user = MOCK_USERS[email];
      if (!user || user.password !== password) {
        throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
      }
      const { password: _pw, ...sessionUser } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    },
    logout: () => {
      localStorage.removeItem(SESSION_KEY);
      window.location.reload();
    },
    redirectToLogin: (_redirectUrl) => {
      localStorage.removeItem(SESSION_KEY);
      window.location.reload();
    },
  },
  entities: entitiesProxy,
  integrations: {
    Core: {
      UploadFile: async (_args) => ({
        file_url: 'https://placehold.co/400x400/D2FC31/1E293B?text=IMG',
      }),
    },
  },
};
