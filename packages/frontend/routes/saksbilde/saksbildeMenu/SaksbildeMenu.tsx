import React from 'react';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { Location, useNavigation } from '@hooks/useNavigation';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { BeregnetPeriode } from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';
import { onLazyLoadFail } from '@utils/error';

import { TabLink } from '../TabLink';
import { DropdownMenu } from './dropdown/DropdownMenu';

import styles from './SaksbildeMenu.module.css';

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
    activePeriod: BeregnetPeriode;
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
        </div>
    );
};

const SaksbildeMenuContainer: React.FC = () => {
    const activePeriod = useActivePeriod();

    if (isBeregnetPeriode(activePeriod)) {
        return <SaksbildeMenuBeregnetPeriode activePeriod={activePeriod} />;
    } else if (isGhostPeriode(activePeriod)) {
        return <SaksbildeMenuGhostPeriode />;
    } else if (isUberegnetPeriode(activePeriod)) {
        return <SaksbildeMenuUberegnetPeriode />;
    } else {
        return <SaksbildeMenuSkeleton />;
    }
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
