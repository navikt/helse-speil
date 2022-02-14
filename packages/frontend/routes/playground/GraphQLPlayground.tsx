import React from 'react';
import GraphiQL from 'graphiql';

import 'graphiql/graphiql.min.css';
import { postGraphQLQuery } from '@io/http';

const graphQLFetcher = async (graphQLParams: any) => {
    const response = await postGraphQLQuery(JSON.stringify(graphQLParams));
    return response.status === 200 ? response.data : response;
};

const GraphQLPlayground = () => <GraphiQL headerEditorEnabled={true} fetcher={graphQLFetcher} editorTheme="dracula" />;

export default GraphQLPlayground;
