import { NextRequest, NextResponse } from 'next/server';

export const stub = async (_request: NextRequest) => {
    return new NextResponse(null, { status: 204 });
};
