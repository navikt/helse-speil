import React, { PropsWithChildren, ReactElement, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Dropdown } from '@navikt/ds-react';

import { LeggPåVentModal } from '@components/påvent/PåVentModaler';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Periodetilstand, PersonFragment, Personnavn } from '@io/graphql';
import { AnnulleringsModal } from '@saksbilde/annullering/AnnulleringsModal';
import { OpphevStansAutomatiskBehandlingModal } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/OpphevStansAutomatiskBehandlingModal';
import { StansAutomatiskBehandlingModal } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/StansAutomatiskBehandlingModal';
import { useInnloggetSaksbehandler } from '@state/authentication';
import {
    finnAlleInntektsforhold,
    finnPeriodeTilGodkjenning,
    tilReferanse,
    useAktivtInntektsforhold,
} from '@state/inntektsforhold/inntektsforhold';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { AnnullerButton } from './AnnullerButton';
import { OppdaterPersondataButton } from './OppdaterPersondataButton';
import { PåVentButton } from './PåVentButton';
import { TildelingDropdownMenuButton } from './TildelingDropdownMenuButton';

import styles from './DropdownMenu.module.scss';

export function LitenMeny({ person }: { person?: PersonFragment | null }): ReactElement | null {
    const [showStansAutomatiskBehandlingModal, setShowStansAutomatiskBehandlingModal] = useState(false);
    const [showOpphevStansAutomatiskBehandlingModal, setShowOpphevStansAutomatiskBehandlingModal] = useState(false);
    if (!isPerson(person)) {
        return null;
    }

    const automatiskBehandlingStansetAvSaksbehandler =
        person.personinfo.automatiskBehandlingStansetAvSaksbehandler ?? false;

    return (
        <>
            <DropdownMenu>
                <Dropdown.Menu placement="bottom-start" className={styles.dropdown}>
                    <Dropdown.Menu.List>
                        {automatiskBehandlingStansetAvSaksbehandler ? (
                            <Dropdown.Menu.List.Item onClick={() => setShowOpphevStansAutomatiskBehandlingModal(true)}>
                                Opphev stans av automatisk behandling
                            </Dropdown.Menu.List.Item>
                        ) : (
                            <Dropdown.Menu.List.Item onClick={() => setShowStansAutomatiskBehandlingModal(true)}>
                                Stans automatisk behandling
                            </Dropdown.Menu.List.Item>
                        )}
                        <OppdaterPersondataButton person={person} />
                    </Dropdown.Menu.List>
                </Dropdown.Menu>
            </DropdownMenu>
            {showStansAutomatiskBehandlingModal && (
                <StansAutomatiskBehandlingModal
                    closeModal={() => setShowStansAutomatiskBehandlingModal(false)}
                    showModal={showStansAutomatiskBehandlingModal}
                    fødselsnummer={person.fodselsnummer}
                />
            )}
            {showOpphevStansAutomatiskBehandlingModal && (
                <OpphevStansAutomatiskBehandlingModal
                    closeModal={() => setShowOpphevStansAutomatiskBehandlingModal(false)}
                    showModal={showOpphevStansAutomatiskBehandlingModal}
                    fødselsnummer={person.fodselsnummer}
                />
            )}
        </>
    );
}

export function StorMeny({
    person,
    activePeriod,
}: {
    person: PersonFragment;
    activePeriod: ActivePeriod;
}): ReactElement {
    const [showLeggPåVentModal, setShowLeggPåVentModal] = useState(false);
    const [showAnnulleringModal, setShowAnnulleringModal] = useState(false);
    const [showStansAutomatiskBehandlingModal, setShowStansAutomatiskBehandlingModal] = useState(false);
    const [showOpphevStansAutomatiskBehandlingModal, setShowOpphevStansAutomatiskBehandlingModal] = useState(false);
    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    const user = useInnloggetSaksbehandler();
    const readOnly = useIsReadOnlyOppgave(person);
    const inntektsforhold = useAktivtInntektsforhold(person);
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;

    const personIsAssignedUser = (person?.tildeling && person?.tildeling?.oid === user.oid) ?? false;

    const automatiskBehandlingStansetAvSaksbehandler =
        person.personinfo.automatiskBehandlingStansetAvSaksbehandler ?? false;

    const behandlingHarAnnullering = finnAlleInntektsforhold(person).some((ag) =>
        ag.behandlinger.some((behandling) =>
            behandling.perioder.some(
                (periode) =>
                    isBeregnetPeriode(activePeriod) &&
                    periode.vedtaksperiodeId === activePeriod.vedtaksperiodeId &&
                    (periode.periodetilstand === Periodetilstand.Annullert ||
                        periode.periodetilstand === Periodetilstand.TilAnnullering ||
                        periode.periodetilstand === Periodetilstand.AvventerAnnullering),
            ),
        ),
    );

    const kanAnnulleres =
        isBeregnetPeriode(activePeriod) &&
        (activePeriod.periodetilstand === Periodetilstand.IngenUtbetaling ||
            activePeriod.periodetilstand === Periodetilstand.Utbetalt) &&
        !behandlingHarAnnullering;

    const navn: Personnavn = {
        __typename: 'Personnavn',
        fornavn: person.personinfo.fornavn,
        mellomnavn: person.personinfo.mellomnavn,
        etternavn: person.personinfo.etternavn,
    };

    return (
        <>
            <DropdownMenu>
                <Dropdown.Menu placement="bottom-start" className={styles.dropdown}>
                    {isBeregnetPeriode(activePeriod) && activePeriod.oppgave?.id && !readOnly && (
                        <>
                            <Dropdown.Menu.List>
                                <>
                                    <TildelingDropdownMenuButton
                                        oppgavereferanse={activePeriod.oppgave.id}
                                        erTildeltInnloggetBruker={personIsAssignedUser}
                                        tildeling={person?.tildeling}
                                    />
                                    <PåVentButton person={person} showModal={() => setShowLeggPåVentModal(true)} />
                                </>
                            </Dropdown.Menu.List>
                            <Dropdown.Menu.Divider />
                        </>
                    )}
                    <Dropdown.Menu.List>
                        {automatiskBehandlingStansetAvSaksbehandler ? (
                            <Dropdown.Menu.List.Item onClick={() => setShowOpphevStansAutomatiskBehandlingModal(true)}>
                                Opphev stans av automatisk behandling
                            </Dropdown.Menu.List.Item>
                        ) : (
                            <Dropdown.Menu.List.Item onClick={() => setShowStansAutomatiskBehandlingModal(true)}>
                                Stans automatisk behandling
                            </Dropdown.Menu.List.Item>
                        )}
                        <OppdaterPersondataButton person={person} />
                        {isBeregnetPeriode(activePeriod) && kanAnnulleres && inntektsforhold !== undefined && (
                            <AnnullerButton
                                person={person}
                                periode={activePeriod}
                                inntektsforhold={inntektsforhold}
                                showModal={() => setShowAnnulleringModal(true)}
                            />
                        )}
                    </Dropdown.Menu.List>
                </Dropdown.Menu>
            </DropdownMenu>
            {showLeggPåVentModal && periodeTilGodkjenning && oppgaveId && (
                <LeggPåVentModal
                    oppgaveId={oppgaveId}
                    behandlingId={periodeTilGodkjenning.behandlingId}
                    navn={navn}
                    utgangspunktTildeling={person.tildeling}
                    onClose={() => setShowLeggPåVentModal(false)}
                />
            )}
            {showAnnulleringModal &&
                isBeregnetPeriode(activePeriod) &&
                kanAnnulleres &&
                inntektsforhold !== undefined && (
                    <AnnulleringsModal
                        closeModal={() => setShowAnnulleringModal(false)}
                        showModal={showAnnulleringModal}
                        inntektsforholdReferanse={tilReferanse(inntektsforhold)}
                        vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                        arbeidsgiverFagsystemId={activePeriod.utbetaling.arbeidsgiverFagsystemId}
                        personFagsystemId={activePeriod.utbetaling.personFagsystemId}
                        person={person}
                        periode={activePeriod}
                    />
                )}
            {showStansAutomatiskBehandlingModal && (
                <StansAutomatiskBehandlingModal
                    closeModal={() => setShowStansAutomatiskBehandlingModal(false)}
                    showModal={showStansAutomatiskBehandlingModal}
                    fødselsnummer={person.fodselsnummer}
                />
            )}
            {showOpphevStansAutomatiskBehandlingModal && (
                <OpphevStansAutomatiskBehandlingModal
                    closeModal={() => setShowOpphevStansAutomatiskBehandlingModal(false)}
                    showModal={showOpphevStansAutomatiskBehandlingModal}
                    fødselsnummer={person.fodselsnummer}
                />
            )}
        </>
    );
}

const DropdownMenu = ({ children }: PropsWithChildren): ReactElement => {
    const [open, setOpen] = useState(false);
    const content = useRef<HTMLSpanElement>(null);

    const toggleDropdown = () => {
        setOpen((prevState) => !prevState);
    };

    const closeDropdown = () => {
        setOpen(false);
    };

    useInteractOutside({
        ref: content,
        onInteractOutside: closeDropdown,
        active: open,
    });

    return (
        <span ref={content}>
            <Dropdown onSelect={closeDropdown}>
                <Dropdown.Toggle className={styles.menu} onClick={toggleDropdown}>
                    Meny{' '}
                    {open ? (
                        <ChevronUpIcon title="lukke" fontSize="1.25rem" />
                    ) : (
                        <ChevronDownIcon title="åpne" fontSize="1.25rem" />
                    )}
                </Dropdown.Toggle>
                {children}
            </Dropdown>
        </span>
    );
};
