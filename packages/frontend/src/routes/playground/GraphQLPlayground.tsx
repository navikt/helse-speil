import GraphiQL from 'graphiql';
import React from 'react';

import { createGraphiQLFetcher } from '@graphiql/toolkit';

const GraphQLPlayground = () => {
    const [fetcher, setFetcher] = React.useState(() =>
        createGraphiQLFetcher({
            url: `/api/graphql`,
        }),
    );

    return <GraphiQL isHeadersEditorEnabled={true} fetcher={fetcher} />;
};

export default GraphQLPlayground;
