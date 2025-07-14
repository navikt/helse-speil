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
import { useAtom } from 'jotai/index';
import { useHydrateAtoms } from 'jotai/utils';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from 'react';

import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@app/apollo/apolloClient';
import { Bruker, BrukerContext } from '@auth/brukerContext';
import { AnonymiseringProvider } from '@components/anonymizable/AnonymizationProvider';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { Saksbehandler } from '@io/graphql';
import { initInstrumentation } from '@observability/faro';
import { hydrateFilters, valgtSaksbehandlerAtom } from '@oversikt/table/state/filter';
import { useFetchPersonQuery } from '@state/person';
import { hydrateKanFrigiOppgaverState, hydrateTotrinnsvurderingState } from '@state/toggles';
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
    const [valgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);

    return (
        <ApolloProvider client={apolloClient}>
            <Provider>
                <AtomsHydrator atomValues={getAtomValues(bruker, valgtSaksbehandler ?? undefined)}>
                    <SyncAlerts>
                        <AnonymiseringProvider>
                            <BrukerContext.Provider value={bruker}>{children}</BrukerContext.Provider>
                        </AnonymiseringProvider>
                    </SyncAlerts>
                </AtomsHydrator>
            </Provider>
        </ApolloProvider>
    );
};

function getAtomValues(bruker: Bruker, valgtSaksbehandler?: Saksbehandler) {
    return typeof window !== 'undefined'
        ? [
              hydrateKanFrigiOppgaverState(bruker.ident),
              hydrateTotrinnsvurderingState(bruker.grupper),
              hydrateFilters(bruker.grupper, bruker.ident, valgtSaksbehandler),
          ]
        : [];
}

function AtomsHydrator({
    atomValues,
    children,
}: {
    atomValues: Iterable<readonly [WritableAtom<unknown, [never], unknown>, unknown]>;
    children: ReactNode;
}) {
    useHydrateAtoms(new Map(atomValues));
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
