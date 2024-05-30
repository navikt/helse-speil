import GraphiQL from 'graphiql';
import React from 'react';

import { createGraphiQLFetcher } from '@graphiql/toolkit';

import { BASE_URL } from '../../constants';

import 'graphiql/graphiql.min.css';

const fetcher = createGraphiQLFetcher({
    url: `${BASE_URL}/graphql`,
});

export const GraphQLPlayground = () => <GraphiQL isHeadersEditorEnabled={true} fetcher={fetcher} />;
