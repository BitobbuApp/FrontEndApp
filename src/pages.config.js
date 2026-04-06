/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Chat from './features/chat/ChatPage';
import Configuracion from './features/settings/SettingsPage';
import Dashboard from './features/dashboard/DashboardPage';
// import Marketplace from './features/marketplace/MarketplacePage';
import Requests from './features/requests/RequestsPage';
import RequestFormPage from './features/requests/RequestFormPage';
import RequestSummaryPage from './features/requests/RequestSummaryPage';
import ProfilePage from './features/profile/ProfilePage';
import PublicProfilePage from './features/profile/PublicProfilePage';
// import Offers from './features/offers/OffersPage';
import PosiblesClientes from './features/prospects/ProspectsPage';
import Proveedores from './features/suppliers/SuppliersPage';
import QuoteDetailPage from './features/requests/QuoteDetailPage';
import __Layout from './layouts/MainLayout/MainLayout.jsx';

export const PAGES = {
    "Chat": Chat,
    "Configuracion": Configuracion,
    "Dashboard": Dashboard,
    //"Marketplace": Marketplace,
    "Requests": Requests,
    "Requests/new": RequestFormPage,
    "Requests/:id/edit": RequestFormPage,
    "Requests/:id/summary": RequestSummaryPage,
    "Perfil": ProfilePage,
    "Perfil/:id": PublicProfilePage,
    // "Offers": Offers,
    "PosiblesClientes": PosiblesClientes,
    "Proveedores": Proveedores,
    "Quotes/:id": QuoteDetailPage,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};
