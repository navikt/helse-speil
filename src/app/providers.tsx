'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
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
import { initInstrumentation } from '@/observability/faro';
import { hydrateAllFilters } from '@/routes/oversikt/table/state/filter';
import { hydrateSorteringForTab } from '@/routes/oversikt/table/state/sortation';
import { VenterPåEndringProvider } from '@/routes/saksbilde/VenterPåEndringContext';
import { hydrateKanFrigiOppgaverState, hydrateTotrinnsvurderingState } from '@/state/toggles';
import { ApolloProvider } from '@apollo/client';
import { AnonymiseringProvider } from '@components/anonymizable/AnonymizationProvider';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useFetchPersonQuery } from '@state/person';
import { useSetVarsler } from '@state/varsler';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.locale('nb');

initInstrumentation();

type Props = {
    bruker: Bruker;
};

export const Providers = ({ children, bruker }: PropsWithChildren<Props>): ReactElement => {
    const [apolloClient] = useState(() => createApolloClient());

    const initializeState = useCallback(
        ({ set }: { set: SetRecoilState }) => {
            if (typeof window === 'undefined') return;
            hydrateTotrinnsvurderingState(set, bruker.grupper);
            hydrateKanFrigiOppgaverState(set, bruker.ident);
            hydrateAllFilters(set, bruker.grupper);
            hydrateSorteringForTab(set);
        },
        [bruker.grupper, bruker.ident],
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
                        <AnonymiseringProvider>
                            <BrukerContext.Provider value={bruker}>{children}</BrukerContext.Provider>
                        </AnonymiseringProvider>
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
