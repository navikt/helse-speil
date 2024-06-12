import { Cache, FetchResult } from '@apollo/client';
import { MockedResponse, ResultFunction } from '@apollo/client/testing';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export function createMock<Query, Variables extends Record<string, unknown>>(mockedResponse: {
    request: { query: TypedDocumentNode<Query, Variables>; variables?: Variables };
    result?: FetchResult<Query> | ResultFunction<FetchResult<Query>>;
    error?: Error;
    delay?: number;
    newData?: ResultFunction<FetchResult<Query>, Record<string, unknown>>;
}): MockedResponse<Query> {
    return mockedResponse;
}

export function createInitialQuery<Query, Variables>(
    typedDocumentNode: TypedDocumentNode<Query, Variables>,
    data: Query,
    variables?: Variables,
): Cache.WriteQueryOptions<Query, Variables> {
    return {
        query: typedDocumentNode,
        data,
        variables,
    };
}
