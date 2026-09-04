import type { SubscriberItem } from '@/types';
import moment from 'moment';

export const emptySubscriberObject: SubscriberItem = {
    id: '',
    email: '',
    name: '',
    subscribed_at: '',
    is_active: true,
    is_article_updates_on: true,
    is_product_updates_on: true,
    is_service_updates_on: true
};

export const getSubscribers = async () => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/subscriber`);
        const data = await response.json();
        let subscribers: any[] = [];

        if (data) {
            subscribers = [...subscribers, ...data];
        }

        const subscriberData = subscribers.reverse();
        
        return subscriberData;
    } catch (err) {
        console.error('Failed to fetch subscribers from the database: ', err);
        return [];
    }
};

export const getSubscriberByEmail = async (email: string): Promise<SubscriberItem> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/subscriber?email=${email}`);
        const data = await response.json();
        let subscriber: any = {};

        if (data) {
            subscriber = data;
        }

        return subscriber;
    } catch (err) {
        console.error('Failed to fetch subscriber from the database: ', err);
        return emptySubscriberObject;
    }
};

export const getSubscribersByStatus = async (is_active: boolean): Promise<SubscriberItem[]> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/subscriber`);
        const data: any[] = await response.json();

        const statusSubscriber = data.filter(subscriber => subscriber.is_active === is_active);

        return statusSubscriber;
    } catch (err) {
        console.error('Failed to fetch subscribers from the database: ', err);
        return [];
    }
};

export const createSubscriber = async (email: string, name: string, preferences?: { articles: boolean, productUpdates: boolean, serviceUpdates: boolean }) => {
    if (!email) {
        return emptySubscriberObject;
    }

    const newSubscriber: SubscriberItem = {
        id: '', // Will be assigned by DB
        email,
        name,
        subscribed_at: moment.utc().toISOString(),
        is_active: true,
        is_article_updates_on: preferences?.articles ?? true,
        is_product_updates_on: preferences?.productUpdates ?? true,
        is_service_updates_on: preferences?.serviceUpdates ?? true,
    };

    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/subscriber`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubscriber),
    });

    const content = await response.json();

    return content;
};

export const updateSubscriber = async (subscriber: SubscriberItem) => {
    const updatedSubscriber: SubscriberItem = {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        subscribed_at: subscriber.subscribed_at,
        is_active: subscriber.is_active,
        is_article_updates_on: subscriber.is_article_updates_on,
        is_product_updates_on: subscriber.is_product_updates_on,
        is_service_updates_on: subscriber.is_service_updates_on
    };

    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/subscriber`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSubscriber),
    });

    const content = await response.json();

    return content;
};

export const deleteSubscriber = async (email: string) => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/subscriber`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
    });

    const success = response.ok;

    return success;
}

export const updateSubscriberStatus = async (subscriber: SubscriberItem, is_active: boolean) => {
    const updatedSubscriber: SubscriberItem = {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        subscribed_at: subscriber.subscribed_at,
        is_active,
        is_article_updates_on: subscriber.is_article_updates_on,
        is_product_updates_on: subscriber.is_product_updates_on,
        is_service_updates_on: subscriber.is_service_updates_on
    };

    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/subscriber`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSubscriber),
    });

    const content = await response.json();

    return content;
};