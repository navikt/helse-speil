'use client';

import 'dayjs/locale/nb';
import type { WritableAtom } from 'jotai';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { ThemeProvider } from 'next-themes';
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
import '@utils/dayjs.setup';

initInstrumentation();

type Props = {
    bruker: Bruker;
};

export const Providers = ({ children, bruker }: PropsWithChildren<Props>): ReactElement => {
    const [queryClient] = useState(() => new QueryClient());
    const [apolloClient] = useState(() => createApolloClient());

    return (
        <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system" disableTransitionOnChange={false}>
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
        </ThemeProvider>
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
