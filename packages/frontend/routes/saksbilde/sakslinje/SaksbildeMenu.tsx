import React from 'react';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { Location, useNavigation } from '@hooks/useNavigation';
import { Dropdown } from '@components/dropdown';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { BeregnetPeriode } from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';
import { onLazyLoadFail } from '@utils/error';
import { genereltNotat } from '@utils/featureToggles';
import { useErBeslutteroppgaveOgErTidligereSaksbehandler } from '@hooks/useErBeslutteroppgaveOgErTidligereSaksbehandler';

import { TabLink } from '../TabLink';

import styles from './SaksbildeMenu.module.css';

const PåVentDropdownMenuButton = React.lazy(() => import('./dropdown/PåVentDropdownMenuButton').catch(onLazyLoadFail));
const SkrivGenereltNotatDropdownMenuButton = React.lazy(() =>
    import('./dropdown/SkrivGenereltNotatDropdownMenuButton').catch(onLazyLoadFail),
);
const TildelingDropdownMenuButton = React.lazy(() =>
    import('./dropdown/TildelingDropdownMenuButton').catch(onLazyLoadFail),
);
const AnnullerButton = React.lazy(() => import('./dropdown/AnnulleringDropdownMenuButton').catch(onLazyLoadFail));
const AnonymiserDataDropdownMenuButton = React.lazy(() =>
    import('./dropdown/AnonymiserDataDropdownMenuButton').catch(onLazyLoadFail),
);
const OppdaterPersondataButton = React.lazy(() => import('./dropdown/OppdaterPersondataButton').catch(onLazyLoadFail));
const HistorikkHeader = React.lazy(() => import('../historikk/HistorikkHeader').catch(onLazyLoadFail));

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
    const erBeslutteroppgaveOgErTidligereSaksbehandler = useErBeslutteroppgaveOgErTidligereSaksbehandler();

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
                    <React.Suspense fallback={null}>
                        {activePeriod.oppgavereferanse && !erBeslutteroppgaveOgErTidligereSaksbehandler && (
                            <>
                                {currentPerson !== null && genereltNotat && (
                                    <SkrivGenereltNotatDropdownMenuButton
                                        vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                                        personinfo={currentPerson.personinfo}
                                    />
                                )}
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
                                        erPåVent={currentPerson.tildeling?.reservert}
                                    />
                                )}
                                <hr className={styles.Strek} />
                            </>
                        )}
                        <OppdaterPersondataButton />
                        <AnonymiserDataDropdownMenuButton />
                        <AnnullerButton />
                    </React.Suspense>
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
