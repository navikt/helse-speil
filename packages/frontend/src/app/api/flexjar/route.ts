import { postOpprett } from '@/app/api/flexjar/flexjar';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function POST(request: Request) {
    return postOpprett(request);
}
