import {NextResponse} from 'next/server';

export const getUsers = async (email?: string) => {
    const baseUrl =
        typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
            : '';

    try {
        if (email) {
            const response = await fetch(`${baseUrl}/api/user?email=${email}`);
            const data = await response.json();

            return NextResponse.json(data, {status: 201});
        } else {
            const response = await fetch(`${baseUrl}/api/user`);
            const data = await response.json();

            return NextResponse.json(data, {status: 201});
        }
    } catch (err) {
        console.error('Failed to fetch users from the database.');
        return NextResponse.json(err, {status: 500});
    }
};

export const createUser = async (email: string) => {};
