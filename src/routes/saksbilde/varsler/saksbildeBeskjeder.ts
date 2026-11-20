import dayjs from 'dayjs';

import { ApiOverstyring, ApiPeriodetilstand, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { DateString, PeriodState } from '@typer/shared';
import {
    isArbeidsforholdoverstyring,
    isDagoverstyring,
    isInntektoverstyring,
    isMinimumSykdomsgradsoverstyring,
    isSykepengegrunnlagskjønnsfastsetting,
} from '@utils/typeguards';

export type SaksbildeBeskjed = {
    grad: 'info' | 'success' | 'warning' | 'error';
    tekst: string;
};

export interface BeslutterkontrollGrunnlag {
    harTotrinnsvurdering: boolean;
    varsler: ApiVarselDTO[];
    harDagOverstyringer: boolean;
    harTilkommenInntektEndring: boolean;
    saksbehandlerhandlingerTilKontroll: string[];
    åpneEndringerPåPerson?: ApiOverstyring[] | null;
    activePeriodTom?: string;
    navnPåDeaktiverteGhostArbeidsgivere?: string;
}

export function beslutterkontroll({
    harTotrinnsvurdering,
    varsler,
    harDagOverstyringer,
    harTilkommenInntektEndring,
    saksbehandlerhandlingerTilKontroll,
    åpneEndringerPåPerson,
    activePeriodTom,
    navnPåDeaktiverteGhostArbeidsgivere,
}: BeslutterkontrollGrunnlag): string[] {
    if (
        !harTotrinnsvurdering ||
        (åpneEndringerPåPerson == null &&
            !harTilkommenInntektEndring &&
            saksbehandlerhandlingerTilKontroll.length === 0)
    ) {
        return [];
    }

    const overstyringer = åpneEndringerPåPerson?.filter((overstyring) => !overstyring.ferdigstilt) ?? [];
    const inntektoverstyringer = overstyringer.filter(isInntektoverstyring);
    const endretMånedsinntekt = inntektoverstyringer.filter(
        (it) => it.inntekt.fraManedligInntekt !== it.inntekt.manedligInntekt,
    );

    const årsaker: string[] = [];

    if (harDagOverstyringer || harRelevanteDagoverstyringer(overstyringer, activePeriodTom)) {
        årsaker.push('Overstyring av dager');
    }
    if (endretMånedsinntekt.some((it) => it.inntekt.begrunnelse !== 'tilkommen')) {
        årsaker.push('Overstyring av månedsinntekt');
    }
    if (endretMånedsinntekt.some((it) => it.inntekt.begrunnelse === 'tilkommen')) {
        årsaker.push('Overstyring av månedsinntekt på tilkommen inntekt');
    }
    if (
        inntektoverstyringer.some(
            (it) =>
                JSON.stringify(it.inntekt.fraRefusjonsopplysninger) !==
                JSON.stringify(it.inntekt.refusjonsopplysninger),
        )
    ) {
        årsaker.push('Overstyring av Refusjon');
    }
    if (overstyringer.some(isArbeidsforholdoverstyring)) {
        årsaker.push(`Overstyring av annet arbeidsforhold (${navnPåDeaktiverteGhostArbeidsgivere})`);
    }
    if (overstyringer.some(isSykepengegrunnlagskjønnsfastsetting)) {
        årsaker.push('Skjønnsfastsettelse');
    }
    if (overstyringer.some(isMinimumSykdomsgradsoverstyring)) {
        årsaker.push('Vurdering av minimum sykdomsgrad');
    }
    if (varsler.some((varsel) => varsel.kode === 'RV_IV_10')) {
        årsaker.push('Brukerutbetaling og refusjon på grunn av manglende inntektsmelding');
    }
    if (varsler.some((varsel) => varsel.kode === 'RV_MV_1')) {
        årsaker.push('Lovvalg og medlemskapsvurdering');
    }
    if (harTilkommenInntektEndring) {
        årsaker.push('Tilkommen inntekt');
    }

    return [...årsaker, ...saksbehandlerhandlingerTilKontroll];
}

function harRelevanteDagoverstyringer(overstyringer: ApiOverstyring[], tom?: DateString): boolean {
    return (
        typeof tom === 'string' &&
        overstyringer.some((it) => isDagoverstyring(it) && dayjs(it.dager[0]?.dato).isSameOrBefore(tom))
    );
}

export function statusbeskjeder(periodState: PeriodState, erSendtTilBeslutter: boolean): SaksbildeBeskjed[] {
    const sendtTilBeslutter: SaksbildeBeskjed | null = erSendtTilBeslutter
        ? { grad: 'info', tekst: 'Oppgaven er sendt til beslutter' }
        : null;
    return [sendtTilBeslutter, venterbeskjed(periodState)].filter((beskjed) => beskjed !== null);
}

function venterbeskjed(periodState: PeriodState): SaksbildeBeskjed | null {
    switch (periodState) {
        case 'venter':
            return { grad: 'info', tekst: 'Ikke klar til behandling - avventer system' };
        case 'venterPåInntektsopplysninger':
            return { grad: 'info', tekst: 'Ikke klar til behandling - venter på inntektsmelding' };
        case 'venterPåKiling':
            return {
                grad: 'info',
                tekst: 'Avventer behandling av en annen periode. Dette kan skyldes at søknad eller inntektsmelding for denne eller en annen arbeidsgiver mangler.',
            };
        case 'avventerAnnullering':
            return {
                grad: 'info',
                tekst: 'Avventer behandling av en annen periode. Denne perioden vil bli annullert.',
            };
        default:
            return null;
    }
}

export function feilbeskjeder(periodState: PeriodState, oppgavereferanse?: string | null): SaksbildeBeskjed[] {
    return [tilstandsfeil(periodState), manglendeOppgavereferanse(periodState, oppgavereferanse)].filter(
        (beskjed) => beskjed !== null,
    );
}

function tilstandsfeil(periodState: PeriodState): SaksbildeBeskjed | null {
    switch (periodState) {
        case 'annulleringFeilet':
            return { grad: 'error', tekst: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case 'utbetalingFeilet':
            return { grad: 'error', tekst: 'Utbetalingen feilet.' };
        case 'ukjent':
            return { grad: 'error', tekst: 'Kunne ikke lese informasjon om periodens tilstand.' };
        default:
            return null;
    }
}

function manglendeOppgavereferanse(
    periodState: PeriodState,
    oppgavereferanse?: string | null,
): SaksbildeBeskjed | null {
    return periodState === 'tilGodkjenning' && !oppgavereferanse
        ? {
              grad: 'error',
              tekst: 'Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.',
          }
        : null;
}

export function annulleringsbeskjed(periodetilstand: ApiPeriodetilstand): SaksbildeBeskjed | null {
    switch (periodetilstand) {
        case ApiPeriodetilstand.Annullert:
            return { grad: 'info', tekst: 'Utbetalingen er annullert' };
        case ApiPeriodetilstand.TilAnnullering:
            return { grad: 'info', tekst: 'Utbetalingen er sendt til annullering' };
        default:
            return null;
    }
}
