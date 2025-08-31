'use client';
import { Suspense } from 'react';
import UnsubscribePageInner from './UnsubscribePageInner';

export default function UnsubscribePage() {
    return (
        <Suspense fallback={<div></div>}>
            <UnsubscribePageInner />
        </Suspense>
    );
}
