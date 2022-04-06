import React from 'react';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { Location, useNavigation } from '@hooks/useNavigation';
import { Dropdown } from '@components/dropdown/Dropdown';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { BeregnetPeriode, GhostPeriode } from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';
import { annulleringerEnabled } from '@utils/featureToggles';

import { TabLink } from '../TabLink';
import { PåVentDropdownMenuButton } from './dropdown/PåVentDropdownMenuButton';
import { TildelingDropdownMenuButton } from './dropdown/TildelingDropdownMenuButton';
import { AnnulleringDropdownMenuButton } from './dropdown/AnnulleringDropdownMenuButton';
import { AnonymiserDataDropdownMenuButton } from './dropdown/AnonymiserDataDropdownMenuButton';
import { OppdaterPersondataDropdownMenuButton } from './dropdown/OppdaterPersondataDropdownMenuButton';
import { HistorikkHeader } from '../historikk/HistorikkHeader';

import styles from './SaksbildeMenu.module.css';

const SaksbildeMenuEmpty: React.VFC = () => {
    return (
        <div className={styles.SaksbildeMenu}>
            <div>
                <Dropdown className={styles.Dropdown}>
                    <OppdaterPersondataDropdownMenuButton />
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
                <Dropdown className={styles.Dropdown}>
                    <OppdaterPersondataDropdownMenuButton />
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
                <Dropdown className={styles.Dropdown}>
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
                    <OppdaterPersondataDropdownMenuButton />
                    <AnonymiserDataDropdownMenuButton />
                    {annulleringerEnabled && currentArbeidsgiver && currentPerson && (
                        <AnnulleringDropdownMenuButton
                            utbetaling={activePeriod.utbetaling}
                            fødselsnummer={currentPerson.fodselsnummer}
                            aktørId={currentPerson.aktorId}
                            organisasjonsnummer={currentArbeidsgiver.organisasjonsnummer}
                        />
                    )}
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
