// tryig to remove x-vercel-id header from response

import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    response.headers.delete('x-vercel-id');
    return response;
}