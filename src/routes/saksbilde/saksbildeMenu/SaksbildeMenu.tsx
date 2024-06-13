import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { BodyShort } from '@navikt/ds-react';

import { ActivePeriod } from '@/types/shared';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { PersonFragment } from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { DropdownMenu } from './dropdown/DropdownMenu';

import styles from './SaksbildeMenu.module.css';

type SaksbildeMenuProps = {
    person: PersonFragment;
    activePeriod: ActivePeriod;
};

const SaksbildeMenuGhostPeriode = ({ person, activePeriod }: SaksbildeMenuProps): ReactElement => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />
            </nav>
            <DropdownMenu person={person} activePeriod={activePeriod} />
        </div>
    </div>
);

const SaksbildeMenuBeregnetPeriode = ({ person, activePeriod }: SaksbildeMenuProps): ReactElement => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="dagoversikt" tittel="Dagoversikt" />
                <NavLenke to="inngangsvilkår" tittel="Inngangsvilkår" />
                <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />
                {isBeregnetPeriode(activePeriod) &&
                    activePeriod.risikovurdering?.funn &&
                    activePeriod.risikovurdering?.funn?.length > 0 && (
                        <NavLenke to="vurderingsmomenter" tittel="Vurderingsmomenter" />
                    )}
            </nav>
            <DropdownMenu person={person} activePeriod={activePeriod} />
        </div>
    </div>
);

const SaksbildeMenuUberegnetPeriode = ({ person, activePeriod }: SaksbildeMenuProps): ReactElement => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="dagoversikt" tittel="Dagoversikt" />
            </nav>
            <DropdownMenu person={person} activePeriod={activePeriod} />
        </div>
    </div>
);

const NavLenke = ({ tittel, to }: { tittel: string; to: string }): ReactElement => {
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

const SaksbildeMenuContainer = ({ person, activePeriod }: SaksbildeMenuProps): ReactElement => {
    if (isBeregnetPeriode(activePeriod)) {
        return <SaksbildeMenuBeregnetPeriode person={person} activePeriod={activePeriod} />;
    }

    if (isGhostPeriode(activePeriod)) {
        return <SaksbildeMenuGhostPeriode person={person} activePeriod={activePeriod} />;
    }

    return <SaksbildeMenuUberegnetPeriode person={person} activePeriod={activePeriod} />;
};

export const SaksbildeMenuSkeleton = (): ReactElement => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Skeleton)}>
            <span className={styles.TabList}>
                <LoadingShimmer />
                <LoadingShimmer />
                <LoadingShimmer />
                <LoadingShimmer />
            </span>
        </div>
    );
};

const SaksbildeMenuError = (): ReactElement => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise saksbildemeny.</BodyShort>
        </div>
    );
};

export const SaksbildeMenu = (props: SaksbildeMenuProps): ReactElement => {
    return (
        <ErrorBoundary fallback={<SaksbildeMenuError />}>
            <SaksbildeMenuContainer {...props} />
        </ErrorBoundary>
    );
};
