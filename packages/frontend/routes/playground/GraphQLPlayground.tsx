import GraphiQL from 'graphiql';
import React from 'react';

import { postGraphQLQuery } from '@io/http';

import 'graphiql/graphiql.min.css';

const graphQLFetcher = async (graphQLParams: any) => {
    const response = await postGraphQLQuery(JSON.stringify(graphQLParams));
    return response.status === 200 ? response.data : response;
};

const GraphQLPlayground = () => (
    <GraphiQL isHeadersEditorEnabled={true} fetcher={graphQLFetcher} editorTheme="dracula" />
);

export default GraphQLPlayground;
