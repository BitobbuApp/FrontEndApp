# 🧩 How to Create a New Feature

This guide walks through every step of adding a new feature module to the Bitobbu Frontend.  
Follow it exactly to maintain consistency with the existing codebase.

---

## Step-by-Step Checklist

### 1. Create the Feature Folder Structure

```
src/features/<featureName>/
├── <FeatureName>Page.jsx
├── components/
├── hooks/
│   └── use<FeatureName>Data.js
└── services/
    └── <featureName>Api.js
```

> **Naming conventions:**
> - Folder name: `camelCase` (e.g., `quoteResponses`)
> - Page component: `PascalCase` + `Page` suffix (e.g., `QuoteResponsesPage.jsx`)
> - Hook files: `use` prefix + `PascalCase` (e.g., `useQuoteResponsesData.js`)
> - Service files: `camelCase` + `Api` suffix (e.g., `quoteResponsesApi.js`)
> - Component files: `PascalCase` (e.g., `QuoteResponsesTable.jsx`)

---

### 2. Create the Service Layer

The service is a thin wrapper around the shared Axios client. It maps 1:1 to backend endpoints.

```js
// src/features/orders/services/ordersApi.js
import apiClient from '@/api/axiosClient';

export const ordersApi = {
    /**
     * GET /orders/company?page=X&limit=Y
     */
    async getCompanyOrders({ page = 1, limit = 10 } = {}) {
        return await apiClient.get('/orders/company', { params: { page, limit } });
    },

    /**
     * GET /orders/:id
     */
    async getOrderById(id) {
        return await apiClient.get(`/orders/${id}`);
    },

    /**
     * POST /orders
     */
    async createOrder(data) {
        return await apiClient.post('/orders', data);
    },

    /**
     * PATCH /orders/:id
     */
    async updateOrder(id, data) {
        return await apiClient.patch(`/orders/${id}`, data);
    },

    /**
     * DELETE /orders/:id
     */
    async deleteOrder(id) {
        return await apiClient.delete(`/orders/${id}`);
    },
};
```

**Key rules:**
- Always use the shared `apiClient` import — never create a separate Axios instance.
- Include a JSDoc comment with the HTTP method and full path for each function.
- Export as a named object (`export const ordersApi = { ... }`), not default export.
- The Axios response interceptor already unwraps `response.data`, so service functions return the body directly.

---

### 3. Create the Data Hook

The hook owns all TanStack Query logic, pagination state, and action handlers.

```js
// src/features/orders/hooks/useOrdersData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { ordersApi } from '../services/ordersApi';
import { toast } from 'sonner';
import { useState } from 'react';

export default function useOrdersData() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [page, setPage] = useState(1);
    const limit = 10;

    // ── Query ──
    const { data: paginatedData, isLoading } = useQuery({
        queryKey: ['orders', user?.company_id, page, limit],
        queryFn: async () => {
            const response = await ordersApi.getCompanyOrders({ page, limit });
            return response.data;
        },
        enabled: !!user?.company_id,
    });

    const orders = paginatedData?.data || [];
    const total = paginatedData?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // ── Mutations ──
    const deleteMutation = useMutation({
        mutationFn: (id) => ordersApi.deleteOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Orden eliminada');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Error al eliminar';
            toast.error(message);
        },
    });

    // ── Handlers (exposed to Page) ──
    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    return {
        user,
        orders,
        isLoading,
        page,
        setPage,
        total,
        totalPages,
        handleDelete,
    };
}
```

**Key rules:**
- `queryKey` must include all variables that affect the query (user ID, page, limit, filters).
- Use `enabled` to prevent queries from firing before required data exists.
- Mutations must call `queryClient.invalidateQueries()` on success to refresh stale data.
- Error handling: extract `error.response?.data?.message` for backend messages, provide a fallback.
- Return a clean, flat object — the Page should not need to know about TanStack internals.

---

### 4. Create the Page Component

The Page is a thin orchestrator: it calls the hook, manages local UI state (modals, filters, search), and passes everything down as props.

```jsx
// src/features/orders/OrdersPage.jsx
import React, { useState } from 'react';
import useOrdersData from './hooks/useOrdersData';
import OrdersTable from './components/OrdersTable';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const {
        orders,
        isLoading,
        page,
        setPage,
        totalPages,
        handleDelete,
    } = useOrdersData();

    const filtered = orders.filter((o) =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header with search + action */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Órdenes</h1>
                <Button onClick={() => navigate('/Orders/new')}>Nueva Orden</Button>
            </div>

            {/* Data table */}
            <OrdersTable
                orders={filtered}
                isLoading={isLoading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onDelete={handleDelete}
            />
        </div>
    );
}
```

**Key rules:**
- No `useQuery`, `useMutation`, or API calls here.
- Client-side filtering (search, status) is acceptable in the Page.
- UI state like modals (`useState`) stays in the Page.

---

### 5. Register the Route

Open `src/pages.config.js` and add your import + route entry:

```js
import OrdersPage from './features/orders/OrdersPage';

export const PAGES = {
    // ... existing pages ...
    "Orders": OrdersPage,
    "Orders/new": OrderFormPage,       // nested route
    "Orders/:id": OrderDetailPage,     // dynamic route
};
```

- The key becomes the URL path (e.g., `"Orders"` → `/Orders`).
- Dynamic segments use React Router syntax (`:id`).
- Pages are automatically wrapped in `MainLayout` (Sidebar + TopNavbar).

---

### 6. Add Navigation (Sidebar)

Open `src/layouts/MainLayout/Sidebar.jsx` and add a new entry to the navigation items array:

```jsx
{ name: 'Órdenes', href: '/Orders', icon: ShoppingCart }
```

- Use a `lucide-react` icon that matches the feature's domain.
- The `currentPageName` prop is used to highlight the active item.

---

## ✅ New Feature Checklist

Before marking a feature as complete, verify:

- [ ] Feature folder follows the `services/ → hooks/ → components/ → Page` structure
- [ ] Service file imports from `@/api/axiosClient` and includes JSDoc for each endpoint
- [ ] Hook uses `useQuery`/`useMutation` with proper `queryKey`, `enabled`, and cache invalidation
- [ ] Page component contains no direct API calls or TanStack imports
- [ ] Route is registered in `pages.config.js`
- [ ] Sidebar navigation entry is added (if applicable)
- [ ] Toasts use `sonner` (`toast.success` / `toast.error`)
- [ ] Confirmations use `AlertDialog`, not `window.confirm()`
- [ ] Styling uses Tailwind + Shadcn design tokens (no hardcoded colors)
- [ ] Component is responsive (mobile-first, `lg:` for desktop)
