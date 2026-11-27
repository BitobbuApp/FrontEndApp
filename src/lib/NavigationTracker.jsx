import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pagesConfig } from '@/pages.config';
import { analytics } from '@/lib/analytics';

export default function NavigationTracker() {
    const location = useLocation();
    const { Pages, mainPage } = pagesConfig;
    const mainPageKey = mainPage ?? Object.keys(Pages)[0];

    useEffect(() => {
        const pathname = location.pathname;
        let pageName;

        if (pathname === '/' || pathname === '') {
            pageName = mainPageKey;
        } else {
            const pathSegment = pathname.replace(/^\//, '').split('/')[0];
            const pageKeys = Object.keys(Pages);
            const matchedKey = pageKeys.find(
                key => key.toLowerCase() === pathSegment.toLowerCase()
            );
            pageName = matchedKey || pathname;
        }

        analytics.pageView(pathname, pageName);

        // Track product detail views on the public Marketplace
        const productMatch = pathname.match(/^\/marketplace\/producto\/([^/]+)/i);
        if (productMatch) {
            analytics.track('view_content', {
                contentIds: [productMatch[1]],
                contentType: 'product',
            });
        }
    }, [location.pathname, Pages, mainPageKey]);

    return null;
}
