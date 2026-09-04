import React, { Suspense, lazy } from 'react';

const SubscribePageInner = lazy(() => import('./SubscribePageInner'));

export const metadata = {
    title: 'Subscribe | Code & Coffee',
    description: 'Manage your email preferences for Code & Coffee.',
};

const SubscribePage = () => {
    return (
        <main id="body">
            <Suspense fallback={<div className="container py-5 text-center">Loading preferences...</div>}>
                <SubscribePageInner />
            </Suspense>
        </main>
    );
};

export default SubscribePage;
