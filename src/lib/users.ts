import {NextResponse} from 'next/server';

export const getUsers = async (email: string) => {
    const baseUrl =
        typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
            : '';

    try {
        const response = await fetch(`${baseUrl}/api/db?email=${email}`);

        const data = await response.json();

        console.log(data);

        return NextResponse.json(data, {status: 201});
    } catch (err) {
        console.error('Failed to fetch users from the database.');
        return NextResponse.json(err, {status: 500});
    }
};

export const createUser = async (email: string) => {};
