import { postGraphQLQuery } from '@app/api/graphql/graphql';
import { hentWonderwallToken } from '@auth/token';

export const POST = async (req: Request): Promise<Response> => {
    const token = hentWonderwallToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }

    return postGraphQLQuery(token, await req.text());
};
