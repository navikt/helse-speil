import { postGraphQLQuery } from '@app/api/graphql/graphql';
import { hentWonderwallToken } from '@auth/token';

export const dynamic = 'force-dynamic'; // defaults to auto
export const POST = async (req: Request): Promise<Response> => {
    const token = hentWonderwallToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }

    return postGraphQLQuery(token, await req.text());
};
