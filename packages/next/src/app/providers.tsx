'use client';

import { PropsWithChildren, ReactElement, useState } from 'react';

import { createApolloClient } from '@/app/apollo/apolloClient';
import { ApolloProvider } from '@apollo/client';

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
    const [apolloClient] = useState(() => createApolloClient());

    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
