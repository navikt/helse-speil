import { postOppdater } from '@/app/api/flexjar/flexjar';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function POST(request: Request, { params }: { params: { id: string } }) {
    const id = params.id; // 'a', 'b', or 'c'
    return postOppdater(id, request);
}
