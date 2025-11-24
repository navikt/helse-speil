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
import type { WritableAtom } from 'jotai';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from 'react';

import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@app/apollo/apolloClient';
import { Bruker, BrukerContext } from '@auth/brukerContext';
import { AnonymiseringProvider } from '@components/anonymizable/AnonymizationProvider';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { initInstrumentation } from '@observability/faro';
import { hydrateFilters } from '@oversikt/table/state/filter';
import { useFetchPersonQuery } from '@state/person';
import { hydrateTotrinnsvurderingState } from '@state/toggles';
import { useSetVarsler } from '@state/varsler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    const [queryClient] = useState(() => new QueryClient());
    const [apolloClient] = useState(() => createApolloClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloClient}>
                <Provider>
                    <AtomsHydrator atomValues={getAtomValues(bruker)}>
                        <SyncAlerts>
                            <AnonymiseringProvider>
                                <BrukerContext.Provider value={bruker}>{children}</BrukerContext.Provider>
                            </AnonymiseringProvider>
                        </SyncAlerts>
                    </AtomsHydrator>
                </Provider>
            </ApolloProvider>
        </QueryClientProvider>
    );
};

function getAtomValues(bruker: Bruker) {
    return typeof window !== 'undefined' ? [hydrateTotrinnsvurderingState(bruker.grupper), hydrateFilters()] : [];
}

function AtomsHydrator({
    atomValues,
    children,
}: {
    atomValues: Iterable<readonly [WritableAtom<unknown, [never], unknown>, unknown]>;
    children: ReactNode;
}) {
    useHydrateAtoms(
        new Map(
            atomValues
                ? Array.from(atomValues, ([atom, value]) => [
                      atom as unknown as WritableAtom<unknown, [unknown], unknown>,
                      value,
                  ])
                : [],
        ),
    );
    return children;
}

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
