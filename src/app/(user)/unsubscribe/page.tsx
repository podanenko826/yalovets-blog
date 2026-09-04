import { Suspense } from 'react';
import UnsubscribePageInner from './UnsubscribePageInner';

export default function UnsubscribePage() {
    return (
        <main id="body">
            <Suspense fallback={<div></div>}>
                <UnsubscribePageInner />
            </Suspense>
        </main>
    );
}
