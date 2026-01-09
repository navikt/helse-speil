import { NextRequest } from 'next/server';

export const stub = async (_: NextRequest) => {
    return Response.json(-1);
};
