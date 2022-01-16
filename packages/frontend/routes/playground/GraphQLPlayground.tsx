import React from 'react';
import GraphiQL from 'graphiql';

import { postGraphQLQuery } from '../../io/http';
import 'graphiql/graphiql.min.css';

const graphQLFetcher = async (graphQLParams: any) => {
    const response = await postGraphQLQuery(JSON.stringify(graphQLParams));
    return response.status === 200 ? response.data : response;
};

export const GraphQLPlayground = () => (
    <GraphiQL headerEditorEnabled={true} fetcher={graphQLFetcher} editorTheme="dracula" />
);
