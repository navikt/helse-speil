import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Dialog, HStack, Loader } from '@navikt/ds-react';

import { LeggPåVentModal } from '@components/påvent/PåVentModaler';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Periodetilstand, PersonFragment } from '@io/graphql';
import { useDeletePåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
import { AnnulleringsDialogInnhold } from '@saksbilde/annullering/AnnulleringsDialogInnhold';
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

export function SaksbildeDropdownMenu({
    person,
    activePeriod,
}: {
    person?: PersonFragment | null;
    activePeriod?: ActivePeriod;
}): ReactElement | null {
    if (!isPerson(person)) {
        return null;
    }
    return <SaksbildeDropdownMenuContent person={person} activePeriod={activePeriod} />;
}

function SaksbildeDropdownMenuContent({
    person,
    activePeriod,
}: {
    person: PersonFragment;
    activePeriod?: ActivePeriod;
}): ReactElement {
    const [showLeggPåVentModal, setShowLeggPåVentModal] = useState(false);
    const [showAnnulleringModal, setShowAnnulleringModal] = useState(false);
    const [showStansModal, setShowStansModal] = useState(false);
    const [showOpphevStansModal, setShowOpphevStansModal] = useState(false);

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    const user = useInnloggetSaksbehandler();
    const readOnly = useIsReadOnlyOppgave(person);
    const inntektsforhold = useAktivtInntektsforhold(person);
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;
    const erPåVent = periodeTilGodkjenning?.paVent;

    const router = useRouter();
    const { mutate: fjernPåVent, isPending: loading } = useDeletePåVent();
    const { refetch } = useFetchPersonQuery();
    const errorHandler = useOperationErrorHandler('Legg på vent');

    const personIsAssignedUser = person.tildeling?.oid === user.oid;

    const automatiskBehandlingStansetAvSaksbehandler =
        person.personinfo.automatiskBehandlingStansetAvSaksbehandler ?? false;

    const behandlingHarAnnullering = harAnnulleringForPeriode(person, activePeriod);

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
            { oppgaveId: Number.parseInt(oppgaveId) },
            {
                onSuccess: () => refetch(),
                onError: (error) => errorHandler(new Error(error.message)),
            },
        );
    };

    return (
        <>
            <ActionMenu>
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
                <ActionMenu.Content>
                    {isBeregnetPeriode(activePeriod) && activePeriod.oppgave?.id && !readOnly && (
                        <>
                            <ActionMenu.Group aria-label="Oppgave">
                                <TildelingDropdownMenuButton
                                    oppgavereferanse={activePeriod.oppgave.id}
                                    erTildeltInnloggetBruker={personIsAssignedUser}
                                    tildeling={person.tildeling}
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
                    <ActionMenu.Group aria-label={activePeriod ? 'Handlinger' : 'Automatisk behandling'}>
                        {automatiskBehandlingStansetAvSaksbehandler ? (
                            <ActionMenu.Item onSelect={() => setShowOpphevStansModal(true)} className="text-ax-large">
                                Opphev stans av automatisk behandling
                            </ActionMenu.Item>
                        ) : (
                            <ActionMenu.Item onSelect={() => setShowStansModal(true)} className="text-ax-large">
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
                    onLeggPåVentSuccess={() => router.push('/')}
                />
            )}
            {showAnnulleringModal &&
                isBeregnetPeriode(activePeriod) &&
                kanAnnulleres &&
                inntektsforhold !== undefined && (
                    <Dialog open={showAnnulleringModal} onOpenChange={(nextOpen) => setShowAnnulleringModal(nextOpen)}>
                        <AnnulleringsDialogInnhold
                            inntektsforholdReferanse={tilReferanse(inntektsforhold)}
                            vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                            arbeidsgiverFagsystemId={activePeriod.utbetaling.arbeidsgiverFagsystemId}
                            personFagsystemId={activePeriod.utbetaling.personFagsystemId}
                            person={person}
                            periode={activePeriod}
                            onSuccess={() => setShowAnnulleringModal(false)}
                        />
                    </Dialog>
                )}
            <StansAutomatiskBehandlingSection
                fødselsnummer={person.fodselsnummer}
                showStansModal={showStansModal}
                closeStansModal={() => setShowStansModal(false)}
                showOpphevStansModal={showOpphevStansModal}
                closeOpphevStansModal={() => setShowOpphevStansModal(false)}
            />
        </>
    );
}

function harAnnulleringForPeriode(person: PersonFragment, activePeriod?: ActivePeriod): boolean {
    if (!isBeregnetPeriode(activePeriod)) return false;

    return finnAlleInntektsforhold(person).some((ag) =>
        ag.behandlinger.some((behandling) =>
            behandling.perioder.some(
                (periode) =>
                    periode.vedtaksperiodeId === activePeriod.vedtaksperiodeId &&
                    (periode.periodetilstand === Periodetilstand.Annullert ||
                        periode.periodetilstand === Periodetilstand.TilAnnullering ||
                        periode.periodetilstand === Periodetilstand.AvventerAnnullering),
            ),
        ),
    );
}

function StansAutomatiskBehandlingSection({
    fødselsnummer,
    showStansModal,
    closeStansModal,
    showOpphevStansModal,
    closeOpphevStansModal,
}: {
    fødselsnummer: string;
    showStansModal: boolean;
    closeStansModal: () => void;
    showOpphevStansModal: boolean;
    closeOpphevStansModal: () => void;
}): ReactElement | null {
    return (
        <>
            {showStansModal && (
                <StansAutomatiskBehandlingModal
                    closeModal={closeStansModal}
                    showModal={showStansModal}
                    fødselsnummer={fødselsnummer}
                />
            )}
            {showOpphevStansModal && (
                <OpphevStansAutomatiskBehandlingModal
                    closeModal={closeOpphevStansModal}
                    showModal={showOpphevStansModal}
                    fødselsnummer={fødselsnummer}
                />
            )}
        </>
    );
}
