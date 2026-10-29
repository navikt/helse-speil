import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Dialog, HStack, Loader } from '@navikt/ds-react';

import { LeggPåVentDialog } from '@components/påvent/PåVentDialoger';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useDeletePåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { useGetPerson, useGetSaksbehandlerStans } from '@io/rest/generated/personer/personer';
import { ApiPeriodetilstand, ApiPersonnavn, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { sporHendelse } from '@observability/hendelser';
import { AnnulleringsDialogInnhold } from '@saksbilde/annullering/AnnulleringsDialogInnhold';
import { OpphevStansAutomatiskBehandlingDialogInnhold } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/OpphevStansAutomatiskBehandlingDialogInnhold';
import { StansAutomatiskBehandlingDialogInnhold } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/StansAutomatiskBehandlingDialogInnhold';
import { useInnloggetSaksbehandler } from '@state/authentication';
import {
    finnAlleInntektsforhold,
    finnPeriodeTilGodkjenning,
    tilReferanse,
    useAktivtInntektsforhold,
} from '@state/inntektsforhold/inntektsforhold';
import { useAktivOppgaveForPeriode } from '@state/oppgave';
import { useInvaliderOppgaver } from '@state/oppgaver';
import { useFetchPersonQuery } from '@state/person';
import { usePåVentForPeriode } from '@state/påvent';
import { useAvmeld, useTildel, useTildeling } from '@state/tildeling';
import { useOperationErrorHandler } from '@state/varsler';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { AnnullerButton } from './AnnullerButton';

export function SaksbildeDropdownMenu({
    person,
    activePeriod,
}: {
    person?: ApiSaksbildePerson | null;
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
    person: ApiSaksbildePerson;
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
    const oppgaveId = useAktivOppgaveForPeriode(periodeTilGodkjenning)?.id;
    const aktivPeriodeHarOppgave = useAktivOppgaveForPeriode(activePeriod) !== null;
    const erPåVent = usePåVentForPeriode(periodeTilGodkjenning) !== null;
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const { data: saksbehandlerStans } = useGetSaksbehandlerStans(personPseudoId);
    const { data: apiPerson } = useGetPerson(personPseudoId);

    const router = useRouter();
    const { mutate: fjernPåVent, isPending: loading } = useDeletePåVent();
    const { refetch } = useFetchPersonQuery();
    const invaliderOppgaver = useInvaliderOppgaver();
    const errorHandler = useOperationErrorHandler('Legg på vent');

    const tildeling = useTildeling();
    const personIsAssignedUser = tildeling?.oid === user.oid;

    const automatiskBehandlingStansetAvSaksbehandler = saksbehandlerStans?.erStanset;

    const behandlingHarAnnullering = harAnnulleringForPeriode(person, activePeriod);

    const kanAnnulleres =
        isBeregnetPeriode(activePeriod) &&
        (activePeriod.periodetilstand === ApiPeriodetilstand.IngenUtbetaling ||
            activePeriod.periodetilstand === ApiPeriodetilstand.Utbetalt) &&
        !behandlingHarAnnullering;

    const navn: ApiPersonnavn | undefined = apiPerson && {
        fornavn: apiPerson.fornavn,
        mellomnavn: apiPerson.mellomnavn,
        etternavn: apiPerson.etternavn,
    };

    const fjernFraPåVent = () => {
        if (!oppgaveId) return;
        fjernPåVent(
            { oppgaveId: Number.parseInt(oppgaveId) },
            {
                onSuccess: () => {
                    sporHendelse(
                        { name: 'fjernet fra på vent', properties: { kilde: 'saksbildemeny' } },
                        personPseudoId,
                    );
                    void invaliderOppgaver();
                    void refetch();
                },
                onError: (error) => errorHandler(new Error(error.message)),
            },
        );
    };

    const [tildelOppgave, { loading: loadingOpprett }] = useTildel('saksbildemeny');
    const [avmeldOppgave, { loading: loadingFjern }] = useAvmeld('saksbildemeny');

    const tildel = async () => {
        await tildelOppgave(personPseudoId, () => refetch());
    };

    const avmeld = async () => {
        await avmeldOppgave(personPseudoId, () => refetch());
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
                    {aktivPeriodeHarOppgave && !readOnly && (
                        <>
                            <ActionMenu.Group aria-label="Oppgave">
                                {personIsAssignedUser || tildeling ? (
                                    <ActionMenu.Item
                                        disabled={loadingFjern}
                                        onSelect={avmeld}
                                        className="text-ax-large"
                                    >
                                        {personIsAssignedUser ? 'Meld av' : 'Frigi oppgave'}
                                        {loadingFjern && <Loader size="xsmall" />}
                                    </ActionMenu.Item>
                                ) : (
                                    <ActionMenu.Item
                                        disabled={loadingOpprett}
                                        onSelect={tildel}
                                        className="text-ax-large"
                                    >
                                        Tildel meg
                                        {loadingOpprett && <Loader size="xsmall" />}
                                    </ActionMenu.Item>
                                )}
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
                                periode={activePeriod}
                                inntektsforhold={inntektsforhold}
                                showModal={() => setShowAnnulleringModal(true)}
                            />
                        )}
                    </ActionMenu.Group>
                </ActionMenu.Content>
            </ActionMenu>
            {showLeggPåVentModal && periodeTilGodkjenning && oppgaveId && navn && (
                <LeggPåVentDialog
                    oppgaveId={oppgaveId}
                    navn={navn}
                    utgangspunktTildeling={tildeling}
                    onClose={() => setShowLeggPåVentModal(false)}
                    onLeggPåVentSuccess={() => router.push('/')}
                />
            )}
            {showAnnulleringModal &&
                isBeregnetPeriode(activePeriod) &&
                kanAnnulleres &&
                inntektsforhold !== undefined && (
                    <Dialog open={showAnnulleringModal} onOpenChange={setShowAnnulleringModal}>
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
            {showStansModal && apiPerson && (
                <Dialog open={showStansModal} onOpenChange={setShowStansModal}>
                    <StansAutomatiskBehandlingDialogInnhold
                        fødselsnummer={apiPerson.identitetsnummer}
                        onSuccess={() => setShowStansModal(false)}
                    />
                </Dialog>
            )}
            {showOpphevStansModal && apiPerson && (
                <Dialog open={showOpphevStansModal} onOpenChange={setShowOpphevStansModal}>
                    <OpphevStansAutomatiskBehandlingDialogInnhold
                        fødselsnummer={apiPerson.identitetsnummer}
                        onSuccess={() => setShowOpphevStansModal(false)}
                    />
                </Dialog>
            )}
        </>
    );
}

function harAnnulleringForPeriode(person: ApiSaksbildePerson, activePeriod?: ActivePeriod): boolean {
    if (!isBeregnetPeriode(activePeriod)) return false;

    return finnAlleInntektsforhold(person).some((ag) =>
        ag.behandlinger.some((behandling) =>
            behandling.perioder.some(
                (periode) =>
                    periode.vedtaksperiodeId === activePeriod.vedtaksperiodeId &&
                    (periode.periodetilstand === ApiPeriodetilstand.Annullert ||
                        periode.periodetilstand === ApiPeriodetilstand.TilAnnullering ||
                        periode.periodetilstand === ApiPeriodetilstand.AvventerAnnullering),
            ),
        ),
    );
}
