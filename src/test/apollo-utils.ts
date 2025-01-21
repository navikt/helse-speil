import { Cache, FetchResult, Unmasked } from '@apollo/client';
import { MockedResponse, ResultFunction } from '@apollo/client/testing';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export function createMock<Query, Variables extends Record<string, unknown>>(mockedResponse: {
    request: { query: TypedDocumentNode<Query, Variables>; variables?: Variables };
    result?: FetchResult<Unmasked<Query>> | ResultFunction<FetchResult<Unmasked<Query>>>;
    error?: Error;
    delay?: number;
    newData?: ResultFunction<FetchResult<Unmasked<Query>>, Record<string, unknown>>;
}): MockedResponse<Query> {
    return mockedResponse;
}

export function createInitialQuery<Query, Variables>(
    typedDocumentNode: TypedDocumentNode<Unmasked<Query>, Variables>,
    data: Unmasked<Query>,
    variables?: Variables,
): Cache.WriteQueryOptions<Query, Variables> {
    return {
        query: typedDocumentNode,
        data,
        variables,
    };
}
