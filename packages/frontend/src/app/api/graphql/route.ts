import { getToken } from '@navikt/oasis';

import { postGraphQLQuery } from '@/app/api/graphql/graphql';

export const dynamic = 'force-dynamic'; // defaults to auto
export const POST = async (req: Request) => {
    const token = getToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }

    return postGraphQLQuery(token, await req.text());
};
