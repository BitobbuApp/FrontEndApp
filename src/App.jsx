import { Toaster as RadixToaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import AppMetadataBootstrap from '@/features/appMetadata/AppMetadataBootstrap';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';
import GlobalSocketManager from '@/features/chat/components/GlobalSocketManager';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

import RoleGuard from '@/components/shared/RoleGuard';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

const PUBLIC_ROUTES = [
  "Marketplace"
];

const BUYER_ROUTES = [
  "Requests",
  "Requests/new",
  "Requests/:id/edit",
  "Requests/:id/summary",
  "Proveedores",
  "Quotes/:id"
];

const SELLER_ROUTES = [
  "PosiblesClientes",
  "prospects/:id"
];

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const { isLoading: isLoadingCompany } = useMyCompany();
  const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setMinLoading(true);
      const timer = setTimeout(() => {
        setMinLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Check for registration action from external landing
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'register') {
        setShowRegister(true);
      }

      // For initial public load, we also want it
      const timer = setTimeout(() => {
        setMinLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (minLoading || isLoadingPublicSettings || isLoadingAuth || (isAuthenticated && isLoadingCompany)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 flex items-center justify-center animate-pulse">
            <img src="/favicon.svg" alt="Bitobbu" className="w-full h-full object-contain" />
          </div>
          <div className="w-10 h-1 border-2 border-muted overflow-hidden rounded-full relative">
            <div className="absolute inset-0 bg-[#D2FC31] animate-[loading_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? (
          <LoginPage onGoToRegister={() => setShowRegister(true)} />
        ) : (
          <Navigate to={`/${mainPageKey}`} replace />
        )
      } />

      <Route path="/register" element={
        !isAuthenticated ? (
          <RegisterPage onGoToLogin={() => setShowRegister(false)} />
        ) : (
          <Navigate to={`/${mainPageKey}`} replace />
        )
      } />

      <Route path="/" element={
        PUBLIC_ROUTES.includes(mainPageKey) ? (
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        ) : (
          <ProtectedRoute>
            <LayoutWrapper currentPageName={mainPageKey}>
              <MainPage />
            </LayoutWrapper>
          </ProtectedRoute>
        )
      } />

      {Object.entries(Pages).map(([path, Page]) => {
        let content = (
          <LayoutWrapper currentPageName={path}>
            <Page />
          </LayoutWrapper>
        );

        // Apply Role Guards for private routes
        if (!PUBLIC_ROUTES.includes(path)) {
            if (BUYER_ROUTES.includes(path)) {
              content = <RoleGuard require="buy">{content}</RoleGuard>;
            } else if (SELLER_ROUTES.includes(path)) {
              content = <RoleGuard require="sell">{content}</RoleGuard>;
            }
            // Wrap in ProtectedRoute
            content = <ProtectedRoute>{content}</ProtectedRoute>;
        }

        return (
          <Route
            key={path}
            path={`/${path}`}
            element={content}
          />
        );
      })}

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to={`/${mainPageKey}`} replace />} />
    </Routes>
  );
};



function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppMetadataBootstrap />
          <GlobalSocketManager />
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <RadixToaster />
        <SonnerToaster position="top-right" expand={true} richColors />
      </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
