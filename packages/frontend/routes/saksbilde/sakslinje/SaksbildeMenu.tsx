import React from 'react';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { Location, useNavigation } from '@hooks/useNavigation';
import { Dropdown } from '@components/dropdown';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { BeregnetPeriode } from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { TabLink } from '../TabLink';

import styles from './SaksbildeMenu.module.css';

const PåVentDropdownMenuButton = React.lazy(() => import('./dropdown/PåVentDropdownMenuButton'));
const TildelingDropdownMenuButton = React.lazy(() => import('./dropdown/TildelingDropdownMenuButton'));
const AnnullerButton = React.lazy(() => import('./dropdown/AnnulleringDropdownMenuButton'));
const AnonymiserDataDropdownMenuButton = React.lazy(() => import('./dropdown/AnonymiserDataDropdownMenuButton'));
const OppdaterPersondataButton = React.lazy(() => import('./dropdown/OppdaterPersondataButton'));
const HistorikkHeader = React.lazy(() => import('../historikk/HistorikkHeader'));

const SaksbildeMenuEmpty: React.VFC = () => {
    return (
        <div className={styles.SaksbildeMenu}>
            <div>
                <Dropdown className={styles.Dropdown} title="Meny">
                    <OppdaterPersondataButton />
                </Dropdown>
            </div>
            <HistorikkHeader />
        </div>
    );
};

const SaksbildeMenuGhostPeriode: React.VFC = () => {
    const { pathForLocation } = useNavigation();

    return (
        <div className={styles.SaksbildeMenu}>
            <div>
                <span className={styles.TabList} role="tablist">
                    <TabLink to={pathForLocation(Location.Sykepengegrunnlag)} title="Sykepengegrunnlag">
                        Sykepengegrunnlag
                    </TabLink>
                </span>
                <Dropdown className={styles.Dropdown} title="Meny">
                    <OppdaterPersondataButton />
                    <AnonymiserDataDropdownMenuButton />
                </Dropdown>
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

    const currentUser = useInnloggetSaksbehandler();
    const currentPerson = useCurrentPerson();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    const personIsAssignedUser =
        (currentPerson?.tildeling && currentPerson?.tildeling?.oid === currentUser.oid) ?? false;

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
                <Dropdown className={styles.Dropdown} title="Meny">
                    {activePeriod.oppgavereferanse && (
                        <>
                            <TildelingDropdownMenuButton
                                oppgavereferanse={activePeriod.oppgavereferanse}
                                erTildeltInnloggetBruker={personIsAssignedUser}
                                tildeling={currentPerson?.tildeling}
                            />
                            {currentPerson !== null && personIsAssignedUser && (
                                <PåVentDropdownMenuButton
                                    oppgavereferanse={activePeriod.oppgavereferanse}
                                    vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                                    personinfo={currentPerson.personinfo}
                                />
                            )}
                            <hr className={styles.Strek} />
                        </>
                    )}
                    <OppdaterPersondataButton />
                    <AnonymiserDataDropdownMenuButton />
                    <AnnullerButton />
                </Dropdown>
            </div>
            <HistorikkHeader />
        </div>
    );
};

const SaksbildeMenuContainer: React.VFC = () => {
    const activePeriod = useActivePeriod();

    if (isBeregnetPeriode(activePeriod)) {
        return <SaksbildeMenuBeregnetPeriode activePeriod={activePeriod} />;
    } else if (isGhostPeriode(activePeriod)) {
        return <SaksbildeMenuGhostPeriode />;
    } else {
        return <SaksbildeMenuEmpty />;
    }
};

const SaksbildeMenuSkeleton: React.VFC = () => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Skeleton)}>
            <span className={styles.TabList} role="tablist">
                <TabLink disabled title="Utbetaling">
                    Utbetaling
                </TabLink>
                <TabLink disabled title="Inngangsvilkår">
                    Inngangsvilkår
                </TabLink>
                <TabLink disabled title="Sykepengegrunnlag">
                    Sykepengegrunnlag
                </TabLink>
            </span>
        </div>
    );
};

const SaksbildeMenuError: React.VFC = () => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise saksbildemeny.</BodyShort>
        </div>
    );
};

export const SaksbildeMenu: React.VFC = () => {
    return (
        <React.Suspense fallback={<SaksbildeMenuSkeleton />}>
            <ErrorBoundary fallback={<SaksbildeMenuError />}>
                <SaksbildeMenuContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
