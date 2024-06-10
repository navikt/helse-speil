import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { last } from 'remeda';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { DropdownMenu } from './dropdown/DropdownMenu';

import styles from './SaksbildeMenu.module.css';

const SaksbildeMenuGhostPeriode: React.FC = () => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />
            </nav>
            <DropdownMenu />
        </div>
    </div>
);

interface SaksbildeMenuBeregnetPeriodeProps {
    activePeriod: FetchedBeregnetPeriode;
}

const SaksbildeMenuBeregnetPeriode = ({ activePeriod }: SaksbildeMenuBeregnetPeriodeProps) => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="dagoversikt" tittel="Dagoversikt" />
                <NavLenke to="inngangsvilkår" tittel="Inngangsvilkår" />
                <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />
                {activePeriod.risikovurdering?.funn && activePeriod.risikovurdering?.funn?.length > 0 && (
                    <NavLenke to="vurderingsmomenter" tittel="Vurderingsmomenter" />
                )}
            </nav>
            <DropdownMenu />
        </div>
    </div>
);

const SaksbildeMenuUberegnetPeriode: React.FC = () => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="dagoversikt" tittel="Dagoversikt" />
            </nav>
            <DropdownMenu />
        </div>
    </div>
);

const NavLenke = ({ tittel, to }: { tittel: string; to: string }) => {
    const tab = last(usePathname().split('/'));
    return (
        <Link
            className={classNames(styles.NavLink, { [styles.ActiveLink]: decodeURI(tab ?? '') === to })}
            href={to}
            title={tittel}
        >
            {tittel}
        </Link>
    );
};

const SaksbildeMenuContainer: React.FC = () => {
    const activePeriod = useActivePeriod();
    const { loading } = useFetchPersonQuery();

    if (loading) {
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

export const SaksbildeMenuSkeleton: React.FC = () => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Skeleton)}>
            <span className={styles.TabList}>
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
        <ErrorBoundary fallback={<SaksbildeMenuError />}>
            <SaksbildeMenuContainer />
        </ErrorBoundary>
    );
};