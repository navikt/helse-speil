import { postGraphQLQuery } from '@app/api/graphql/graphql';

export const dynamic = 'force-dynamic'; // defaults to auto
export const POST = async (req: Request): Promise<Response> => {
    return postGraphQLQuery(req, await req.text());
};
