# Plan de Activación del Marketplace (Frontend)

Este plan detalla los ajustes necesarios en el Frontend (`c:\projects\FrontEndApp`) para consumir la nueva API pública del Backend y permitir que el Marketplace sea el punto de entrada de la aplicación.

## 1. Refactorización del Enrutador Global (`App.jsx`)
- **Situación actual**: `App.jsx` tiene un bloqueo fuerte `if (!isAuthenticated)` que obliga a renderizar exclusivamente `LoginPage` o `RegisterPage`.
- **Ajuste**: Modificar la lógica de enrutamiento para soportar **Rutas Públicas**. El Marketplace (`/` o `/marketplace`) debe poder renderizarse para usuarios invitados. El control de sesión debe delegarse a un componente envolvente (como `<ProtectedRoute>`) para las demás vistas privadas, garantizando que el Marketplace no exija un token.

## 2. Migración de Datos (`useMarketplaceData.js`)
- **Situación actual**: Utiliza un cliente simulado (`base44.entities.ProductoCatalogo`) y trae *todos* los productos, filtrando todo del lado del cliente (frontend).
- **Ajuste**: 
  - Cambiar el servicio por una llamada real al nuevo endpoint `GET /company-offers/marketplace` utilizando la instancia de Axios en `apiClient.js`.
  - Enviar los parámetros (`searchTerm`, `categoryId`, `countryId`, `stateId`, `minPrice`, `maxPrice`, `sortBy`, `page`, `limit`) al servidor a través del query string de la petición GET.
  - Implementar un **debounce** en `searchTerm` (ej. 500ms) para no saturar al backend con peticiones mientras el usuario escribe o ajusta los sliders.

## 3. Componentes de Filtros (`MarketplaceFilters.jsx`)
- **Ajuste**: Añadir los nuevos controles de filtro requeridos por el plan:
  - Selectores (Dropdowns) dinámicos para **País** y **Estado/Región** (consumiendo la API de locaciones para poblar las listas).
  - Rango de Precios (inputs numéricos de mín. y máx. o un slider de precio).
  - Dropdown de **Ordenamiento** (Precio menor a mayor, Rating, Más recientes, etc.).

## 4. Paginación y Renderizado (`MarketplacePage.jsx` y `ProductGrid.jsx`)
- **Ajuste de Datos Paginados**: La nueva llamada al backend devolverá `{ data: [...], total: X }`. Se debe actualizar la interfaz para soportar paginación (mediante botones "Anterior/Siguiente" o "Cargar más" o un componente `<Pagination />`) en lugar de simplemente iterar sobre un arreglo estático.
- **Mapeo de Propiedades (DTO)**: Asegurar que las tarjetas de producto y el `ProductDetailModal` consuman correctamente la estructura que retorna el backend en Prisma. Por ejemplo, en lugar de variables antiguas, asegurarse de usar `product.name`, `product.base_price_usd`, `product.company.trade_name`, `product.category.name_es`, y el arreglo `product.photos`.
