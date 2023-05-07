import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { Location, useNavigation } from '@hooks/useNavigation';
import { useActivePeriod } from '@state/periode';
import { useIsFetchingPerson } from '@state/person';
import { onLazyLoadFail } from '@utils/error';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { TabLink } from '../TabLink';
import { DropdownMenu } from './dropdown/DropdownMenu';

import styles from './SaksbildeMenu.module.css';

// @ts-ignore
const HistorikkHeader = React.lazy(() => import('../historikk').catch(onLazyLoadFail));

const SaksbildeMenuGhostPeriode: React.FC = () => {
    const { pathForLocation } = useNavigation();

    return (
        <div className={styles.SaksbildeMenu}>
            <div>
                <span className={styles.TabList} role="tablist">
                    <TabLink to={pathForLocation(Location.Sykepengegrunnlag)} title="Sykepengegrunnlag">
                        Sykepengegrunnlag
                    </TabLink>
                </span>
                <DropdownMenu />
            </div>
            <HistorikkHeader />
        </div>
    );
};

interface SaksbildeMenuBeregnetPeriodeProps {
    activePeriod: FetchedBeregnetPeriode;
}

const SaksbildeMenuBeregnetPeriode = ({ activePeriod }: SaksbildeMenuBeregnetPeriodeProps) => {
    const { pathForLocation } = useNavigation();

    return (
        <div className={styles.SaksbildeMenu}>
            <div>
                <span className={styles.TabList} role="tablist">
                    <TabLink to={pathForLocation(Location.Utbetaling)} title="Utbetaling">
                        Utbetaling
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Inngangsvilkår)} title="Inngangsvilkår">
                        Inngangsvilkår
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Sykepengegrunnlag)} title="Sykepengegrunnlag">
                        Sykepengegrunnlag
                    </TabLink>
                    {activePeriod.risikovurdering && (
                        <TabLink to={pathForLocation(Location.Faresignaler)} title="Faresignaler">
                            Faresignaler
                        </TabLink>
                    )}
                </span>
                <DropdownMenu />
            </div>
            <HistorikkHeader />
        </div>
    );
};

const SaksbildeMenuUberegnetPeriode: React.FC = () => {
    const { pathForLocation } = useNavigation();

    return (
        <div className={styles.SaksbildeMenu}>
            <div>
                <span className={styles.TabList} role="tablist">
                    <TabLink to={pathForLocation(Location.Utbetaling)} title="Utbetaling">
                        Utbetaling
                    </TabLink>
                </span>
                <DropdownMenu />
            </div>
            <HistorikkHeader />
        </div>
    );
};

const SaksbildeMenuContainer: React.FC = () => {
    const activePeriod = useActivePeriod();
    const isLoading = useIsFetchingPerson();

    if (isLoading) {
        return <SaksbildeMenuSkeleton />;
    }

    if (!activePeriod) {
        return null;
    }

    if (isBeregnetPeriode(activePeriod)) {
        return <SaksbildeMenuBeregnetPeriode activePeriod={activePeriod} />;
    }

    if (isGhostPeriode(activePeriod)) {
        return <SaksbildeMenuGhostPeriode />;
    }

    return <SaksbildeMenuUberegnetPeriode />;
};

const SaksbildeMenuSkeleton: React.FC = () => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Skeleton)}>
            <span className={styles.TabList}>
                <LoadingShimmer />
                <LoadingShimmer />
                <LoadingShimmer />
                <LoadingShimmer />
                <DropdownMenu />
            </span>
        </div>
    );
};

const SaksbildeMenuError: React.FC = () => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise saksbildemeny.</BodyShort>
        </div>
    );
};

export const SaksbildeMenu: React.FC = () => {
    return (
        <React.Suspense fallback={<SaksbildeMenuSkeleton />}>
            <ErrorBoundary fallback={<SaksbildeMenuError />}>
                <SaksbildeMenuContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
