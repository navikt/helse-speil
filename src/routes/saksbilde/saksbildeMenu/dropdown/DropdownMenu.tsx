import React, { ReactElement, useState } from 'react';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, HStack, Loader } from '@navikt/ds-react';

import { LeggPåVentModal } from '@components/påvent/PåVentModaler';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Periodetilstand, PersonFragment } from '@io/graphql';
import { useDeletePåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
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
import { useFetchPersonQuery } from '@state/person';
import { useOperationErrorHandler } from '@state/varsler';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { AnnullerButton } from './AnnullerButton';
import { TildelingDropdownMenuButton } from './TildelingDropdownMenuButton';

const MenyTrigger = () => (
    <ActionMenu.Trigger>
        <HStack
            as="button"
            align="center"
            justify="center"
            wrap={false}
            gap="space-8"
            className="cursor-pointer px-4 py-3 leading-6 font-semibold text-ax-text-accent-subtle inset-shadow-ax-border-neutral-subtleA transition-shadow duration-200 ease-[cubic-bezier(.2,0,0,1)] hover:inset-shadow-[0px_-4px]"
        >
            <span>Meny</span>
            <ChevronDownIcon aria-hidden fontSize="1.25rem" />
        </HStack>
    </ActionMenu.Trigger>
);

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
            <ActionMenu>
                <MenyTrigger />
                <ActionMenu.Content>
                    <ActionMenu.Group aria-label="Automatisk behandling">
                        {automatiskBehandlingStansetAvSaksbehandler ? (
                            <ActionMenu.Item onSelect={() => setShowOpphevStansAutomatiskBehandlingModal(true)}>
                                Opphev stans av automatisk behandling
                            </ActionMenu.Item>
                        ) : (
                            <ActionMenu.Item onSelect={() => setShowStansAutomatiskBehandlingModal(true)}>
                                Stans automatisk behandling
                            </ActionMenu.Item>
                        )}
                    </ActionMenu.Group>
                </ActionMenu.Content>
            </ActionMenu>
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
    const erPåVent = periodeTilGodkjenning?.paVent;

    const { mutate: fjernPåVent, isPending: loading } = useDeletePåVent();
    const { refetch } = useFetchPersonQuery();
    const errorHandler = useOperationErrorHandler('Legg på vent');

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

    const navn: ApiPersonnavn = {
        fornavn: person.personinfo.fornavn,
        mellomnavn: person.personinfo.mellomnavn,
        etternavn: person.personinfo.etternavn,
    };

    const fjernFraPåVent = () => {
        if (!oppgaveId) return;
        fjernPåVent(
            {
                oppgaveId: Number.parseInt(oppgaveId),
            },
            {
                onSuccess: () => refetch(),
                onError: (error) => errorHandler(new Error(error.message)),
            },
        );
    };

    return (
        <>
            <ActionMenu>
                <MenyTrigger />
                <ActionMenu.Content>
                    {isBeregnetPeriode(activePeriod) && activePeriod.oppgave?.id && !readOnly && (
                        <>
                            <ActionMenu.Group aria-label="Oppgave">
                                <TildelingDropdownMenuButton
                                    oppgavereferanse={activePeriod.oppgave.id}
                                    erTildeltInnloggetBruker={personIsAssignedUser}
                                    tildeling={person?.tildeling}
                                />
                                {erPåVent ? (
                                    <ActionMenu.Item onSelect={fjernFraPåVent} className="text-ax-large">
                                        Fjern fra på vent
                                        {loading && <Loader size="xsmall" />}
                                    </ActionMenu.Item>
                                ) : (
                                    <ActionMenu.Item
                                        onSelect={() => setShowLeggPåVentModal(true)}
                                        className="text-ax-large"
                                    >
                                        Legg på vent
                                    </ActionMenu.Item>
                                )}
                            </ActionMenu.Group>
                            <ActionMenu.Divider />
                        </>
                    )}
                    <ActionMenu.Group aria-label="Handlinger">
                        {automatiskBehandlingStansetAvSaksbehandler ? (
                            <ActionMenu.Item
                                onSelect={() => setShowOpphevStansAutomatiskBehandlingModal(true)}
                                className="text-ax-large"
                            >
                                Opphev stans av automatisk behandling
                            </ActionMenu.Item>
                        ) : (
                            <ActionMenu.Item
                                onSelect={() => setShowStansAutomatiskBehandlingModal(true)}
                                className="text-ax-large"
                            >
                                Stans automatisk behandling
                            </ActionMenu.Item>
                        )}
                        {isBeregnetPeriode(activePeriod) && kanAnnulleres && inntektsforhold !== undefined && (
                            <AnnullerButton
                                person={person}
                                periode={activePeriod}
                                inntektsforhold={inntektsforhold}
                                showModal={() => setShowAnnulleringModal(true)}
                            />
                        )}
                    </ActionMenu.Group>
                </ActionMenu.Content>
            </ActionMenu>
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
