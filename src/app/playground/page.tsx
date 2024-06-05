'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

import 'graphiql/graphiql.min.css';

const GraphQLPlayground = dynamic(() => import('@/routes/playground/GraphQLPlayground'), {
    ssr: false,
});

function Page(): ReactElement {
    return <GraphQLPlayground />;
}

export default Page;
