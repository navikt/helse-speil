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
import { BrukerContext, User } from '@/auth/brukerContext';
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

type Props = {
    user: User;
};

export const Providers = ({ children, user }: PropsWithChildren<Props>): ReactElement => {
    const [apolloClient] = useState(() => createApolloClient());
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ApolloProvider client={apolloClient}>
            <AmplitudeProvider>
                <VenterPåEndringProvider>
                    <BrukerContext.Provider value={user}>
                        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                    </BrukerContext.Provider>
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </ApolloProvider>
    );
};
