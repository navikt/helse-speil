import GraphiQL from 'graphiql';
import React from 'react';

import { createGraphiQLFetcher } from '@graphiql/toolkit';

export const GraphQLPlayground = () => {
    const [fetcher, _] = React.useState(() =>
        createGraphiQLFetcher({
            url: `/api/graphql`,
        }),
    );

    return <GraphiQL isHeadersEditorEnabled={true} fetcher={fetcher} />;
};
