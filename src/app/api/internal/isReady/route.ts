import { getServerEnv } from '@/env';

export async function GET(): Promise<Response> {
    try {
        getServerEnv();
        return new Response('👍🏼');
    } catch (_) {
        return new Response('Noe kødd med env, se loggene', { status: 500 });
    }
}
