import React, { Suspense, lazy } from 'react';

const SubscribePageInner = lazy(() => import('./SubscribePageInner'));

export const metadata = {
    title: 'Subscribe | AWS By Denis',
    description: 'Manage your email preferences for AWS By Denis.',
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
