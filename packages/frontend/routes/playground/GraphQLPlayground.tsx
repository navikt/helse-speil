import GraphiQL from 'graphiql';
import React from 'react';

import { Fetcher } from '@graphiql/toolkit';
import { postGraphQLQuery } from '@io/http';

import 'graphiql/graphiql.min.css';

const graphQLFetcher = async (graphQLParams: unknown) => {
    const response = await postGraphQLQuery(JSON.stringify(graphQLParams));
    return response.status === 200 ? response.data : response;
};

export const GraphQLPlayground = () => <GraphiQL isHeadersEditorEnabled={true} fetcher={graphQLFetcher as Fetcher} />;
