'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, ReactElement, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { RecoilRoot, SetRecoilState } from 'recoil';

import { createApolloClient } from '@/app/apollo/apolloClient';
import { Bruker, BrukerContext } from '@/auth/brukerContext';
import { AmplitudeProvider } from '@/io/amplitude';
import { hydrateAllFilters } from '@/routes/oversikt/table/state/filter';
import { VenterPåEndringProvider } from '@/routes/saksbilde/VenterPåEndringContext';
import { hydrateKanFrigiOppgaverState, hydrateTotrinnsvurderingState } from '@/state/toggles';
import { ApolloProvider } from '@apollo/client';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useFetchPersonQuery } from '@state/person';
import { useSetVarsler } from '@state/varsler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.locale('nb');

type Props = {
    bruker: Bruker;
};

export const Providers = ({ children, bruker }: PropsWithChildren<Props>): ReactElement => {
    const [apolloClient] = useState(() => createApolloClient());
    const [queryClient] = useState(() => new QueryClient());

    const initializeState = useCallback(
        ({ set }: { set: SetRecoilState }) => {
            hydrateTotrinnsvurderingState(set, bruker.grupper);
            hydrateKanFrigiOppgaverState(set, bruker.ident);
            hydrateAllFilters(set, bruker.grupper);
        },
        [bruker.grupper],
    );

    useLayoutEffect(() => {
        // TODO: Kan fjernes når vi går over til aksel sin modal
        ReactModal.setAppElement('#root');
    }, []);

    return (
        <ApolloProvider client={apolloClient}>
            <RecoilRoot initializeState={initializeState}>
                <SyncAlerts>
                    <VenterPåEndringProvider>
                        <BrukerContext.Provider value={bruker}>
                            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                        </BrukerContext.Provider>
                    </VenterPåEndringProvider>
                </SyncAlerts>
            </RecoilRoot>
        </ApolloProvider>
    );
};

const SyncAlerts = ({ children }: PropsWithChildren) => {
    const { loading } = useFetchPersonQuery(true);

    useLoadingToast({ isLoading: loading, message: 'Henter person' });

    useSyncAlertsToLocation();

    return children;
};

const useSyncAlertsToLocation = () => {
    const pathname = usePathname();
    const setVarsler = useSetVarsler();

    useEffect(() => {
        setVarsler((prevState) =>
            prevState.filter((it) => it.scope === pathname || (it.name === 'tildeling' && pathname !== '/')),
        );
    }, [pathname, setVarsler]);
};
