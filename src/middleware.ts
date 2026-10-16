import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getClientIp(request: NextRequest): string {
    const xForwardedFor = request.headers.get('x-forwarded-for');
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }
    const xRealIp = request.headers.get('x-real-ip');
    if (xRealIp) {
        return xRealIp.trim();
    }
    return '';
}

export function middleware(request: NextRequest) {
    const clientIp = getClientIp(request);

    // Read configured IPs (allows updating in Vercel env without changing code)
    const envIps = process.env.ALLOWED_ADMIN_IPS || '185.102.189.8';
    const allowedIps = envIps
        .split(',')
        .map((ip) => ip.trim())
        .filter(Boolean);

    // Allow localhost during local development
    if (process.env.NODE_ENV === 'development') {
        allowedIps.push('127.0.0.1', '::1', '');
    }

    if (!allowedIps.includes(clientIp)) {
        // Rewrite to 404 page so /admin is completely hidden from unauthorized visitors
        return NextResponse.rewrite(new URL('/_not-found', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
