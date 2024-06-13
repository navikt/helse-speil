'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

import 'graphiql/graphiql.min.css';

const GraphQLPlayground = dynamic(
    () => import('@/routes/playground/GraphQLPlayground').then((mod) => mod.GraphQLPlayground),
    {
        ssr: false,
    },
);

export default function Page(): ReactElement {
    return <GraphQLPlayground />;
}
