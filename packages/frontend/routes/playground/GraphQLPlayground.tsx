import GraphiQL from 'graphiql';
import React from 'react';

import { createGraphiQLFetcher } from '@graphiql/toolkit';

import 'graphiql/graphiql.min.css';

const fetcher = createGraphiQLFetcher({
    url: (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/graphql',
});

export const GraphQLPlayground = () => <GraphiQL isHeadersEditorEnabled={true} fetcher={fetcher} />;
