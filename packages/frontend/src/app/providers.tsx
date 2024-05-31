'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PropsWithChildren, ReactElement, useState } from 'react';

import { createApolloClient } from '@/app/apollo/apolloClient';
import { AmplitudeProvider } from '@/io/amplitude';
import { VenterPåEndringProvider } from '@/routes/saksbilde/VenterPåEndringContext';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.locale('nb');

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
    const [apolloClient] = useState(() => createApolloClient());
    const queryClient = new QueryClient();

    return (
        <ApolloProvider client={apolloClient}>
            <AmplitudeProvider>
                <VenterPåEndringProvider>
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </ApolloProvider>
    );
};
