import React, { useState } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import useLayoutData from '../MainLayout/useLayoutData';
import LoginModal from '@/features/auth/components/LoginModal';

export default function PublicLayout({ children, currentPageName }) {
    const { user, myCompany } = useLayoutData();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <PublicHeader 
                user={user} 
                myCompany={myCompany} 
                onRequireAuth={() => setAuthModalOpen(true)}
            />
            
            <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            <PublicFooter />

            <LoginModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
        </div>
    );
}
