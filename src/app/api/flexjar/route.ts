import { postOpprett } from '@/app/api/flexjar/flexjar';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    return postOpprett(request);
}
