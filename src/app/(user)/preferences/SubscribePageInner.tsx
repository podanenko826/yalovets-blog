'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSubscriberByEmail, createSubscriber, updateSubscriber, updateSubscriberStatus } from '@/lib/subscribers';
import { SubscriberItem } from '@/types';

const SubscribePageInner = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailParam = searchParams.get('email');

    const [emailInput, setEmailInput] = useState('');

    // Preferences state
    const [preferences, setPreferences] = useState({
        firstName: '',
        email: emailParam || '',
        articles: true,
        productUpdates: true,
        serviceUpdates: true,
    });

    const [isSaved, setIsSaved] = useState(false);
    const [isReactivating, setIsReactivating] = useState(false);

    // Track original db object to know if we're updating or creating
    const [subscriberData, setSubscriberData] = useState<SubscriberItem | null>(null);

    useEffect(() => {
        if (emailParam) {
            getSubscriberByEmail(emailParam).then((sub) => {
                if (sub && sub.id) {
                    setSubscriberData(sub);
                    setPreferences({
                        firstName: sub.name || '',
                        email: sub.email,
                        articles: sub.is_article_updates_on ?? true,
                        productUpdates: sub.is_product_updates_on ?? true,
                        serviceUpdates: sub.is_service_updates_on ?? true,
                    });
                } else {
                    setPreferences(prev => ({ ...prev, email: emailParam }));
                }
            });
        }
    }, [emailParam]);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailInput.trim()) {
            router.push(`/subscribe?email=${encodeURIComponent(emailInput.trim())}`);
        }
    };

    const handleSavePreferences = async (e: React.FormEvent) => {
        e.preventDefault();

        if (subscriberData && subscriberData.id) {
            const updatedSub: SubscriberItem = {
                ...subscriberData,
                name: preferences.firstName,
                is_article_updates_on: preferences.articles,
                is_product_updates_on: preferences.productUpdates,
                is_service_updates_on: preferences.serviceUpdates,
            };
            const result = await updateSubscriber(updatedSub);
            if (result && result.length > 0) {
                setSubscriberData(result[0]);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            }
        } else {
            const result = await createSubscriber(preferences.email, preferences.firstName, {
                articles: preferences.articles,
                productUpdates: preferences.productUpdates,
                serviceUpdates: preferences.serviceUpdates
            });
            if (result && result.length > 0) {
                setSubscriberData(result[0]);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            }
        }
    };

    const handleReactivate = async () => {
        if (!subscriberData) return;
        setIsReactivating(true);
        const result = await updateSubscriberStatus(subscriberData, true);
        if (result && result.length > 0) {
            setSubscriberData(result[0]);
        }
        setIsReactivating(false);
    };

    if (!emailParam) {
        return (
            <div className="container py-5 my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card p-5 shadow-sm border-0" style={{ backgroundColor: 'var(--col-background-elements)', borderRadius: 'var(--radius-md)' }}>
                            <h2 className="heading mb-3 text-center">Email Preferences</h2>
                            <p className="subheading-small mb-4 text-center" style={{ color: 'var(--col-text)' }}>
                                Enter your email address to manage your subscription settings.
                            </p>
                            <form onSubmit={handleEmailSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        className="form-control py-3 px-3 subheading-small"
                                        placeholder="Email Address"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        required
                                        style={{ backgroundColor: 'var(--col-background)', border: '1px solid var(--col-outline-default)', borderRadius: 'var(--radius-sm)' }}
                                    />
                                </div>
                                <button type="submit" className="btn-filled btn-full py-3">
                                    Manage Preferences
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 my-4">
            <div className="row justify-content-center">
                <div className="col-md-9 col-lg-8">
                    <div className="p-4 p-md-5 shadow-sm border-0" style={{ backgroundColor: 'var(--col-background-elements)', borderRadius: 'var(--radius-md)' }}>
                        <div className="mb-5">
                            <h1 className="heading-large mb-3">Email Preferences</h1>
                            <p className="subheading-small" style={{ color: 'var(--col-text)' }}>
                                Customize what you want to hear about from AWS By Denis.
                            </p>
                        </div>

                        <form onSubmit={handleSavePreferences}>
                            <h4 className="heading mb-4">Your Details</h4>
                            <div className="row mb-4">
                                <div className="col-md-6 pb-3 mb-md-0">
                                    <label className="form-label fw-bold" style={{ color: 'var(--col-heading-1)' }}>First Name</label>
                                    <input
                                        type="text"
                                        className="form-control py-3 px-3 subheading-small"
                                        placeholder="First Name (optional)"
                                        value={preferences.firstName}
                                        onChange={(e) => setPreferences({ ...preferences, firstName: e.target.value })}
                                        style={{ backgroundColor: 'var(--col-background)', border: '1px solid var(--col-outline-default)', borderRadius: 'var(--radius-sm)' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--col-heading-1)' }}>Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control py-3 px-3 subheading-small"
                                        value={preferences.email}
                                        disabled
                                        style={{ backgroundColor: 'var(--col-background)', border: '1px solid var(--col-outline-default)', borderRadius: 'var(--radius-sm)', opacity: 0.7 }}
                                    />
                                </div>
                            </div>

                            <hr className="my-5" style={{ opacity: 0.1 }} />

                            {subscriberData && !subscriberData.is_active ? (
                                <div className="text-center py-5">
                                    <h4 className="heading mb-3">Your subscription is currently inactive</h4>
                                    <p className="subheading-small mb-4" style={{ color: 'var(--col-text)' }}>
                                        You previously unsubscribed from all emails. Click below to reactivate your subscription and manage your preferences.
                                    </p>
                                    <button 
                                        type="button" 
                                        className="btn-filled py-3 px-5"
                                        onClick={handleReactivate}
                                        disabled={isReactivating}
                                    >
                                        {isReactivating ? 'Reactivating...' : 'Reactivate Subscription'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h4 className="heading mb-4">What would you like to receive?</h4>

                                    <div className="d-flex align-items-center justify-content-between mb-4 p-4" style={{ backgroundColor: 'var(--col-background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--col-outline-default)' }}>
                                        <div className="pe-3">
                                            <strong className="d-block mb-1" style={{ color: 'var(--col-heading-1)' }}>Articles & Tutorials</strong>
                                            <span className="subheading-smaller" style={{ color: 'var(--col-text)' }}>New blog posts, coding tutorials, and tech insights.</span>
                                        </div>
                                        <div className="form-check form-switch fs-4 m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                checked={preferences.articles}
                                                onChange={(e) => setPreferences({ ...preferences, articles: e.target.checked })}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-4 p-4" style={{ backgroundColor: 'var(--col-background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--col-outline-default)' }}>
                                        <div className="pe-3">
                                            <strong className="d-block mb-1" style={{ color: 'var(--col-heading-1)' }}>Product Updates</strong>
                                            <span className="subheading-smaller" style={{ color: 'var(--col-text)' }}>Information about new tools, features, or product launches.</span>
                                        </div>
                                        <div className="form-check form-switch fs-4 m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                checked={preferences.productUpdates}
                                                onChange={(e) => setPreferences({ ...preferences, productUpdates: e.target.checked })}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-5 p-4" style={{ backgroundColor: 'var(--col-background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--col-outline-default)' }}>
                                        <div className="pe-3">
                                            <strong className="d-block mb-1" style={{ color: 'var(--col-heading-1)' }}>Service Updates</strong>
                                            <span className="subheading-smaller" style={{ color: 'var(--col-text)' }}>Important announcements and operational updates.</span>
                                        </div>
                                        <div className="form-check form-switch fs-4 m-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                checked={preferences.serviceUpdates}
                                                onChange={(e) => setPreferences({ ...preferences, serviceUpdates: e.target.checked })}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5">
                                        <p className="subheading-smaller m-0 mb-3 mb-md-0 pe-md-4" style={{ color: 'var(--col-text)' }}>
                                            I acknowledge that email performance is tracked through opens and clicks and agree to the <Link href="/privacy-policy" style={{ color: 'var(--col-secondary)' }}>privacy policy</Link>.
                                        </p>
                                        <button type="submit" className={`btn-filled py-3 px-5 ${isSaved ? 'btn-disabled' : ''}`} style={{ minWidth: '200px' }} disabled={isSaved}>
                                            {isSaved ? 'Saved!' : 'Save Preferences'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>

                    <div className="text-center mt-4">
                        <Link href={`/unsubscribe?email=${encodeURIComponent(emailParam)}`} className="subheading-smaller" style={{ color: 'var(--col-text)', textDecoration: 'underline' }}>
                            Unsubscribe from all emails
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscribePageInner;
