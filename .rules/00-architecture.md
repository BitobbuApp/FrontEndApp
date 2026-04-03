# 🏗️ Bitobbu Frontend — Architecture & Core Principles

Before writing any code in this project, every developer or AI agent **MUST** read and follow these rules.  
They ensure consistency, scalability, and maintainability across the entire Bitobbu Frontend.

---

## 1. Technology Stack

| Layer              | Technology                                                  |
|--------------------|-------------------------------------------------------------|
| Framework          | **React 18** (JSX, functional components only)              |
| Routing            | **React Router DOM v6** (centralized in `pages.config.js`)  |
| State / Data       | **TanStack React Query v5** (server state & cache)          |
| HTTP Client        | **Axios** via centralized singleton (`src/api/axiosClient.js`) |
| Real-Time          | **Socket.io Client** via singleton (`src/api/socketClient.js`) |
| Forms              | **React Hook Form** + **Zod** (validation schemas)          |
| UI Primitives      | **Shadcn/UI** (Radix-based, in `src/components/ui/`)        |
| Styling            | **Tailwind CSS v3** + `class-variance-authority` (CVA)      |
| Theming            | **next-themes** (`ThemeProvider`, light/dark)                |
| Notifications      | **Sonner** (toasts) + Radix Toaster (fallback)              |
| Icons              | **Lucide React**                                            |
| Build              | **Vite 6** + **vite-plugin-pwa** (Service Worker)           |
| Native Packaging   | **Capacitor** (Android & iOS APK/IPA generation)            |

---

## 2. Project Structure (Feature-First Architecture)

```
src/
├── api/                    # Global HTTP & WebSocket clients (singletons)
│   ├── axiosClient.js      #   → Configured Axios instance with interceptors
│   └── socketClient.js     #   → Socket.io singleton (connect/disconnect)
│
├── features/               # ★ FEATURE MODULES — all business logic lives here
│   ├── auth/               #   One folder per domain feature
│   │   ├── AuthContext.jsx  #   Feature-level context (if needed)
│   │   ├── LoginPage.jsx    #   Page-level components
│   │   ├── components/      #   Feature-scoped UI components
│   │   ├── hooks/           #   Feature-scoped custom hooks
│   │   └── services/        #   Feature-scoped API service functions
│   ├── chat/
│   ├── dashboard/
│   ├── requests/
│   ├── ...
│
├── components/             # SHARED components (cross-feature)
│   ├── ui/                 #   Shadcn/UI primitives (DO NOT modify without reason)
│   └── atoms/              #   Custom reusable atoms (Pagination, EmptyState, etc.)
│
├── layouts/                # Full-page layout shells
│   └── MainLayout/         #   Sidebar + TopNavbar + content area
│
├── hooks/                  # SHARED hooks (cross-feature, e.g. use-mobile)
├── lib/                    # Low-level utilities (query-client, auth re-exports)
├── utils/                  # Pure helper functions
│
├── App.jsx                 # Root component: Providers → Router → AuthenticatedApp
├── pages.config.js         # ★ Central route registry (maps paths to Page components)
├── main.jsx                # ReactDOM entry point
├── sw.js                   # Service Worker (Workbox + Push Notification listeners)
├── index.css               # Tailwind base + design tokens
└── global.css              # App-wide custom styles
```

---

## 3. The "Feature Module" Pattern

Every business domain feature lives in `src/features/<featureName>/` and follows this internal structure:

```
features/<featureName>/
├── <FeatureName>Page.jsx      # Page component (entry point, minimal logic)
├── components/                # UI components scoped to this feature
│   ├── FeatureTable.jsx
│   ├── FeatureForm.jsx
│   └── FeatureCard.jsx
├── hooks/                     # Custom hooks for this feature
│   ├── useFeatureData.js      #   → TanStack queries + mutations
│   └── useFeatureForm.js      #   → Form state + validation + submit logic
└── services/                  # API functions (thin wrappers around axiosClient)
    └── featureApi.js
```

### Rules:

1. **Page components are orchestrators, NOT logic containers.**  
   A Page imports its hook (`useFeatureData`), destructures the returned state, and passes it down as props to its child components. The Page should never contain `useQuery`, `useMutation`, `axios.get()`, or complex filtering logic directly.

2. **Hooks own the data lifecycle.**  
   All TanStack Query hooks (`useQuery`, `useMutation`), pagination state, and cache invalidation logic belong in the `hooks/` folder. Hooks import from `services/` and return ready-to-consume data + handlers.

3. **Services are pure API wrappers.**  
   A service file is an object or collection of `async` functions that call `apiClient.get/post/patch/delete`. They must:
   - Import from `@/api/axiosClient` only.
   - Never contain React hooks, state, or side effects.
   - Include JSDoc comments with the HTTP method and endpoint path.

4. **Components are presentation-only.**  
   Feature-scoped components receive all data via props. They should never call `useAuth()`, `useQuery()`, or import from `services/` directly. This keeps them testable and reusable.

5. **Cross-feature imports go through hooks, not services.**  
   If Feature B needs data from Feature A, import Feature A's **hook** (`useFeatureAData`), not its service. This mirrors the backend's "Use Case Autonomy" principle.

---

## 4. Data Flow Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Page Component                       │
│  const { data, handlers } = useFeatureData()             │
│  return <FeatureTable data={data} onAction={handlers} /> │
└────────────────────────┬─────────────────────────────────┘
                         │ calls
┌────────────────────────▼─────────────────────────────────┐
│                     Custom Hook                           │
│  useQuery({ queryFn: () => featureApi.getItems() })      │
│  useMutation({ mutationFn: featureApi.createItem })      │
│  Returns: { data, isLoading, handlers }                  │
└────────────────────────┬─────────────────────────────────┘
                         │ calls
┌────────────────────────▼─────────────────────────────────┐
│                    Service Layer                          │
│  featureApi.getItems = () => apiClient.get('/items')     │
└────────────────────────┬─────────────────────────────────┘
                         │ calls
┌────────────────────────▼─────────────────────────────────┐
│               Axios Client (Singleton)                    │
│  - Base URL from env / hardcoded                         │
│  - Request interceptor: injects Bearer token             │
│  - Response interceptor: unwraps .data, handles 401/500  │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Authentication Architecture

- **AuthContext** (`features/auth/AuthContext.jsx`) is the single source of truth for user session state.
- Session is JWT-based: token stored in `localStorage` under key `bitobbu_token`, user data under `bitobbu_session`.
- The Axios interceptor auto-attaches `Authorization: Bearer <token>` to every request.
- On `401` responses, the interceptor auto-clears the session and redirects to `/login`.
- **Socket lifecycle** is tied to auth: `connectSocket()` is called on login/session-restore, `disconnectSocket()` on logout.
- Access the auth state anywhere via `const { user, login, logout } = useAuth()`.

---

## 6. Routing Configuration

All routes are declared in `src/pages.config.js`. This is the **single registry** that maps URL paths to Page components.

```js
// To add a new page:
import MyNewPage from './features/myFeature/MyNewPage';

export const PAGES = {
    // ... existing pages ...
    "MyFeature": MyNewPage,           // → /MyFeature
    "MyFeature/:id": MyDetailPage,    // → /MyFeature/123
};
```

- The `mainPage` value controls which page is shown at `/` (currently `"Dashboard"`).
- All authenticated routes are wrapped in `MainLayout` (Sidebar + TopNavbar).
- Unauthenticated users always see `LoginPage` or `RegisterPage` (no public routes exist).

---

## 7. Styling Rules

1. **Use Tailwind utility classes** as the primary styling method.
2. **Use Shadcn/UI design tokens** (`bg-muted`, `text-foreground`, `border-border`, etc.) for theme-aware colors. Never hardcode hex colors for UI chrome.
3. **Brand color**: `#D2FC31` (lime green), referenced as `bg-[#D2FC31]` in branding spots.
4. **Dark mode**: Supported via `next-themes`. Always use semantic tokens (`bg-background`, `text-muted-foreground`) instead of raw Tailwind colors (`bg-white`, `text-gray-500`).
5. **Responsive design**: Mobile-first. Use `lg:` breakpoint for desktop layouts (the Sidebar switches between Sheet and fixed panel at `lg`).
6. **Animations**: Use `framer-motion` for page/component transitions. Tailwind's `animate-*` utilities for simple animations.

---

## 8. Real-Time (WebSocket) Rules

- The Socket.io client is a **global singleton** (`src/api/socketClient.js`).
- Connection lifecycle is managed by `AuthContext` — never call `connectSocket()`/`disconnectSocket()` from components.
- Feature hooks (e.g., `useChatData`) register socket event listeners in a `useEffect` with proper cleanup (`socket.off(...)` + `socket.emit('leave_...')`).
- Always generate a `client_msg_id` (via `crypto.randomUUID()`) for idempotent message sends.
- Socket mutations use the callback-acknowledgment pattern: `socket.emit('event', payload, (response) => { ... })`.

---

## 9. Toast & Notification Conventions

- **Success**: `toast.success('Descriptive message')`
- **Error**: `toast.error('User-friendly message', { description: err.message })` (optional detail)
- Use `sonner` (`import { toast } from 'sonner'`) — it is the primary toast library.
- Never use `window.alert()` or `window.confirm()`. Use Shadcn `AlertDialog` for confirmations.

---

## 10. Capacitor / Native Build Notes

- The app ships as both a **PWA** (web) and a **native APK/IPA** (via Capacitor).
- `capacitor.config.ts` configures `hostname: 'hub.bitobbu.app'` and `androidScheme: 'https'` to spoof the origin for CORS.
- `CapacitorHttp` plugin is enabled to bypass CORS entirely on native builds.
- APK build flow: `npm run build` → `npx cap sync android` → `gradlew assembleDebug`.
- Service Worker (`src/sw.js`) handles PWA offline caching and push notification listeners (web only; native push will use Capacitor plugins).
