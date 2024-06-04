import GraphiQL from 'graphiql';
import React from 'react';

import { BASE_URL } from '@/constants';
import { createGraphiQLFetcher } from '@graphiql/toolkit';

const GraphQLPlayground = () => {
    const [fetcher, setFetcher] = React.useState(() =>
        createGraphiQLFetcher({
            url: `${BASE_URL}/graphql`,
        }),
    );

    return <GraphiQL isHeadersEditorEnabled={true} fetcher={fetcher} />;
};

export default GraphQLPlayground;
