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
import { ApolloProvider } from '@apollo/client';


dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.locale('nb');

export const Providers = ({ children }: PropsWithChildren): ReactElement => {
    const [apolloClient] = useState(() => createApolloClient());

    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
