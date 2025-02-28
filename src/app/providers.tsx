'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import { RecoilRoot, SetRecoilState } from 'recoil';

import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@app/apollo/apolloClient';
import { Bruker, BrukerContext } from '@auth/brukerContext';
import { AnonymiseringProvider } from '@components/anonymizable/AnonymizationProvider';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { initInstrumentation } from '@observability/faro';
import { hydrateAllFilters } from '@oversikt/table/state/filter';
import { hydrateSorteringForTab } from '@oversikt/table/state/sortation';
import { useFetchPersonQuery } from '@state/person';
import { hydrateTotrinnsvurderingState, useHydrateKanFrigiOppgaverState } from '@state/toggles';
import { useSetVarsler } from '@state/varsler';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
dayjs.locale('nb');

initInstrumentation();

type Props = {
    bruker: Bruker;
};

export const Providers = ({ children, bruker }: PropsWithChildren<Props>): ReactElement => {
    const [apolloClient] = useState(() => createApolloClient());
    useHydrateKanFrigiOppgaverState(bruker.ident);

    const initializeState = useCallback(
        ({ set }: { set: SetRecoilState }) => {
            if (typeof window === 'undefined') return;
            hydrateTotrinnsvurderingState(set, bruker.grupper);
            // hydrateKanFrigiOppgaverState(set, bruker.ident);
            hydrateAllFilters(set, bruker.grupper, bruker.ident);
            hydrateSorteringForTab(set);
        },
        [bruker.grupper, bruker.ident],
    );

    return (
        <ApolloProvider client={apolloClient}>
            <RecoilRoot initializeState={initializeState}>
                <SyncAlerts>
                    <AnonymiseringProvider>
                        <BrukerContext.Provider value={bruker}>{children}</BrukerContext.Provider>
                    </AnonymiseringProvider>
                </SyncAlerts>
            </RecoilRoot>
        </ApolloProvider>
    );
};

const SyncAlerts = ({ children }: PropsWithChildren): ReactNode => {
    const { loading } = useFetchPersonQuery();

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
