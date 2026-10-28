import dayjs from 'dayjs';

import { ApiHandlingType, ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerNavn, lokalSaksbehandlerOid } from '@spesialist-mock/constants';
import { Periodeoppslag, finnPerioderMedOppgave } from '@spesialist-mock/periodeoppslag';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { ServerSentEventsMock } from '@spesialist-mock/storage/events';
import { PersonMock } from '@spesialist-mock/storage/person';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

// Spesialist oppretter totrinnsvurdering når saksbehandler overstyrer eller skjønnsfastsetter
export function opprettTotrinnsvurderingHvisMangler(fødselsnummer: string): void {
    finnPerioderMedOppgave(fødselsnummer)
        .filter(({ totrinnsvurdering }) => !totrinnsvurdering)
        .forEach(({ periode, oppgaveId }) =>
            BehandlingMock.settTotrinnsvurdering(periode.behandlingId, oppgaveId!, {
                erBeslutteroppgave: false,
                erRetur: false,
                saksbehandler: lokalSaksbehandlerOid,
                beslutter: null,
            }),
        );
}

// Manuell vurdering av opptjening knyttes til behandlingen med oppgave og krever totrinnsvurdering, som i spesialist
export function registrerManuellOpptjeningsvurdering(
    personPseudoId: string,
    opptjeningsvurderingId: string,
    skjæringstidspunkt: string,
): void {
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId);
    const perioderMedOppgave = fødselsnummer ? finnPerioderMedOppgave(fødselsnummer) : [];
    const periode = (
        perioderMedOppgave.find(({ periode }) => periode.skjaeringstidspunkt === skjæringstidspunkt) ??
        perioderMedOppgave[0]
    )?.periode;

    SaksbehandlerhandlingMock.leggTilHandling(personPseudoId, {
        handlingId: opptjeningsvurderingId,
        handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
        skjæringstidspunkt: periode?.skjaeringstidspunkt ?? skjæringstidspunkt,
        behandlingId: periode?.behandlingId ?? null,
        erDelAvAktivTotrinnsvurdering: true,
    });

    if (!fødselsnummer) return;
    opprettTotrinnsvurderingHvisMangler(fødselsnummer);
    pushEventEtterForsinkelse(fødselsnummer, ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE);
}

export function ferdigstillOppgave(oppslag: Periodeoppslag, beslutter: string | null): void {
    const oppgaveId = oppslag.oppgaveId!;
    BehandlingMock.ferdigstillOppgave(oppslag.periode.behandlingId, oppgaveId);
    BehandlingMock.leggTilBehandletOppgave({
        oppgaveId,
        personPseudoId: oppslag.personPseudoId,
        ferdigstiltTidspunkt: dayjs().toISOString(),
        saksbehandler: lokalSaksbehandlerNavn,
        beslutter,
    });
}

export function pushEventEtterForsinkelse(
    fødselsnummer: string,
    event: ApiServerSentEventEvent,
    førEvent?: () => void,
): void {
    setTimeout(() => {
        førEvent?.();
        ServerSentEventsMock.pushEvent(fødselsnummer, event);
    }, 2000);
}
