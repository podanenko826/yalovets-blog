import type { SubscriberItem } from '@/types';
import moment from 'moment';

function transformSubscriberData(data: any[]): SubscriberItem[] {
    return data.map(subscriber => ({
        email: subscriber.email?.S,
        slug: subscriber.slug?.S,
        name: subscriber.name?.S,
        subscribedAt: subscriber.subscribedAt?.S,
        status: subscriber.status?.S,
    }));
}

export const emptySubscriberObject: SubscriberItem = {
    email: '',
    slug: '',
    name: '',
    subscribedAt: '',
    status: ''
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

        const transformedAuthorData = transformSubscriberData(subscribers);
        const subscriberData = transformedAuthorData.reverse();
        
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

export const getSubscribersByStatus = async (status: string): Promise<SubscriberItem[]> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/subscriber`);
        const data: any[] = await response.json();

        const statusSubscriber = data.filter(subscriber => subscriber.status?.S === status);

        const transformedSubscribers = transformSubscriberData(statusSubscriber);

        return transformedSubscribers;
    } catch (err) {
        console.error('Failed to fetch subscribers from the database: ', err);
        return [];
    }
};

export const createSubscriber = async (email: string, name: string) => {
    if (!email || !name) {
        return emptySubscriberObject;
    }

    const newSubscriber: SubscriberItem = {
        email,
        slug: 'subscriber',
        name,
        subscribedAt: moment.utc().toISOString(),
        status: 'subscribed',
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
        email: subscriber.email,
        slug: 'subscriber',
        name: subscriber.name,
        subscribedAt: subscriber.subscribedAt,
        status: subscriber.status
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
