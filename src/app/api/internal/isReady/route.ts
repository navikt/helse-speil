import { getServerEnv } from '@/env';
import { validerBackendConfig } from '@app/api/backends';

export async function GET(): Promise<Response> {
    try {
        getServerEnv();
        validerBackendConfig();
        return new Response('👍🏼');
    } catch (_) {
        return new Response('Noe kødd med env, se loggene', { status: 500 });
    }
}
