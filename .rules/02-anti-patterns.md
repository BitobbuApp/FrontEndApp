# ⚠️ Common Pitfalls & Anti-Patterns

A curated list of mistakes that have been caught (or caused bugs) in this project.  
Read this before writing any code.

---

## 1. API & Data Layer

### ❌ Creating a second Axios instance
```js
// WRONG — creates a parallel client without interceptors
const myClient = axios.create({ baseURL: '...' });
```
```js
// CORRECT — always use the shared singleton
import apiClient from '@/api/axiosClient';
```
The shared `axiosClient` has the token interceptor, 401 auto-logout, and response unwrapping already wired.

### ❌ Double-unwrapping API responses
The Axios response interceptor already returns `response.data` (the body). If the backend returns `{ data: [...] }`, then:
```js
// WRONG — double unwrap
const items = (await apiClient.get('/items')).data.data;

// CORRECT — interceptor already unwrapped once
const response = await apiClient.get('/items');
const items = response.data; // this is the inner { data: [...] }
```

### ❌ Hardcoding the API base URL in multiple places
The base URL is configured once in `axiosClient.js`. Socket URL derives from it in `socketClient.js`.  
Never scatter `https://backendapp-k6x2.onrender.com` across service files.

---

## 2. State Management

### ❌ Using `useState` + `useEffect` + `fetch` for server data
```js
// WRONG — reinventing TanStack Query
const [data, setData] = useState([]);
useEffect(() => {
    fetch('/api/items').then(r => r.json()).then(setData);
}, []);
```
```js
// CORRECT — use TanStack Query
const { data, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => itemsApi.getItems(),
});
```
TanStack Query gives you caching, background refetching, deduplication, and loading/error states for free.

### ❌ Forgetting `enabled` on dependent queries
```js
// WRONG — fires immediately with undefined user
useQuery({
    queryKey: ['orders', user?.company_id],
    queryFn: () => ordersApi.getByCompany(user.company_id), // crashes!
});

// CORRECT — guard with enabled
useQuery({
    queryKey: ['orders', user?.company_id],
    queryFn: () => ordersApi.getByCompany(user.company_id),
    enabled: !!user?.company_id,
});
```

### ❌ Forgetting to invalidate queries after mutations
```js
// WRONG — data goes stale after create/update/delete
useMutation({ mutationFn: ordersApi.createOrder });

// CORRECT — invalidate the relevant query keys
useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        toast.success('Orden creada');
    },
});
```

---

## 3. Components & UI

### ❌ Calling `useAuth()` or `useQuery()` inside presentation components
Feature-scoped `components/` should receive data via props only. This keeps them testable and reusable.
```jsx
// WRONG — component reaches for global state
function OrderCard() {
    const { user } = useAuth(); // ❌ tight coupling
    // ...
}

// CORRECT — parent passes it down
function OrderCard({ userName, order, onDelete }) { /* ... */ }
```

### ❌ Using `window.confirm()` or `window.alert()`
```jsx
// WRONG — ugly native dialogs
if (window.confirm('¿Estás seguro?')) { ... }

// CORRECT — use Shadcn AlertDialog
<AlertDialog>
    <AlertDialogTrigger asChild><Button>Eliminar</Button></AlertDialogTrigger>
    <AlertDialogContent>...</AlertDialogContent>
</AlertDialog>
```

### ❌ Hardcoding colors instead of using design tokens
```jsx
// WRONG — breaks dark mode
<div className="bg-white text-gray-800">

// CORRECT — uses semantic tokens
<div className="bg-background text-foreground">
```

---

## 4. WebSocket / Real-Time

### ❌ Calling `connectSocket()` / `disconnectSocket()` from components
Socket lifecycle is managed exclusively by `AuthContext`. If you need to listen for events, use `useEffect` inside a hook:
```js
useEffect(() => {
    socket.on('my_event', handler);
    return () => socket.off('my_event', handler);
}, []);
```

### ❌ Forgetting socket cleanup in `useEffect`
```js
// WRONG — memory leak, listener piles up on re-renders
useEffect(() => {
    socket.on('receive_message', handleMsg);
}, []);

// CORRECT — always clean up
useEffect(() => {
    socket.on('receive_message', handleMsg);
    return () => {
        socket.off('receive_message', handleMsg);
        socket.emit('leave_conversation', convId);
    };
}, [convId]);
```

### ❌ Sending messages without `client_msg_id`
Without an idempotency key, network retries can cause duplicate messages:
```js
// CORRECT — always include a UUID
const payload = {
    conversation_id: conv.id,
    client_msg_id: crypto.randomUUID(),
    content: text,
};
socket.emit('send_message', payload, callback);
```

---

## 5. Routing

### ❌ Creating route definitions outside `pages.config.js`
All routes must be registered in the central `PAGES` object. Scattered `<Route>` elements cause inconsistencies and break the `MainLayout` wrapper.

### ❌ Using `<a href>` for internal navigation
```jsx
// WRONG — full page reload
<a href="/Orders">Ver Órdenes</a>

// CORRECT — client-side navigation
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/Orders');

// or
import { Link } from 'react-router-dom';
<Link to="/Orders">Ver Órdenes</Link>
```

---

## 6. Environment & Build

### ❌ Committing `.env` files or `.apk` binaries
Both are in `.gitignore`. Environment-specific config must stay local.

### ❌ Forgetting `npm run build` + `npx cap sync` before generating APK
Capacitor bundles whatever is in `dist/`. If you skip the build step, the APK will contain stale code.

### ❌ Using `import.meta.env.VITE_*` at runtime in native builds
Environment variables are baked in at build time by Vite. If you change `.env` you must rebuild.  
For truly dynamic config in Capacitor, use `capacitor.config.ts` server settings.
