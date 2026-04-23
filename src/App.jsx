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
import { useState } from 'react';
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

  if (isLoadingPublicSettings || isLoadingAuth || (isAuthenticated && isLoadingCompany)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-muted/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-[#D2FC31] rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-foreground font-bold text-2xl">B</span>
          </div>
          <div className="w-6 h-6 border-3 border-border border-t-[black] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <RegisterPage
          onGoToLogin={() => setShowRegister(false)}
        />
      );
    }
    return <LoginPage onGoToRegister={() => setShowRegister(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => {
        let content = (
          <LayoutWrapper currentPageName={path}>
            <Page />
          </LayoutWrapper>
        );

        // Apply Role Guards
        if (BUYER_ROUTES.includes(path)) {
          content = <RoleGuard require="buy">{content}</RoleGuard>;
        } else if (SELLER_ROUTES.includes(path)) {
          content = <RoleGuard require="sell">{content}</RoleGuard>;
        }

        return (
          <Route
            key={path}
            path={`/${path}`}
            element={content}
          />
        );
      })}
      {/* Unknown routes: send authenticated users to Dashboard, unauthenticated users
          are already handled above by the !isAuthenticated guard (shows LoginPage) */}
      <Route path="*" element={<Navigate to="/Dashboard" replace />} />
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
