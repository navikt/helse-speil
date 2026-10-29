import dayjs from 'dayjs';
import { ReactElement, useState } from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { ApiOverstyring, ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { useInntektOgRefusjon } from '@state/overstyring';
import { DateString, PeriodState } from '@typer/shared';
import { cn } from '@utils/tw';
import {
    isArbeidsforholdoverstyring,
    isDagoverstyring,
    isInntektoverstyring,
    isMinimumSykdomsgradsoverstyring,
    isSykepengegrunnlagskjønnsfastsetting,
} from '@utils/typeguards';

import { EkspanderbartVarsel } from './EkspanderbartVarsel';
import { KalkulerEndringerVarsel } from './KalkulerEndringerVarsel';
import { Varsler } from './Varsler';

export type VarselObject = {
    grad: 'info' | 'success' | 'warning' | 'error';
    melding: string;
};

interface SaksbildevarslerProps {
    periodState: PeriodState;
    oppgavereferanse?: string | null;
    varsler?: ApiVarselDTO[] | null;
    erTidligereSaksbehandler?: boolean;
    erBeslutteroppgave?: boolean;
    åpneEndringerPåPerson?: ApiOverstyring[] | null;
    harDagOverstyringer?: boolean;
    activePeriodTom?: string;
    skjæringstidspunkt?: string;
    navnPåDeaktiverteGhostArbeidsgivere?: string;
    harTotrinnsvurdering: boolean;
    harTilkommenInntektEndring: boolean;
    saksbehandlerhandlingerTilKontroll?: string[];
}

export function Saksbildevarsler({
    periodState,
    oppgavereferanse,
    varsler,
    erTidligereSaksbehandler = false,
    erBeslutteroppgave = false,
    åpneEndringerPåPerson,
    harDagOverstyringer = false,
    activePeriodTom,
    skjæringstidspunkt,
    navnPåDeaktiverteGhostArbeidsgivere,
    harTotrinnsvurdering,
    harTilkommenInntektEndring,
    saksbehandlerhandlingerTilKontroll = [],
}: SaksbildevarslerProps): ReactElement | null {
    const [open, setOpen] = useState(true);
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    const kontrollpunkter = beslutteroppgave({
        harTotrinnsvurdering,
        varsler: varsler ?? [],
        harDagOverstyringer,
        harTilkommenInntektEndring,
        saksbehandlerhandlingerTilKontroll,
        åpneEndringerPåPerson,
        activePeriodTom,
        navnPåDeaktiverteGhostArbeidsgivere,
    });

    const infoVarsler = [
        sendtTilBeslutter(erTidligereSaksbehandler && erBeslutteroppgave),
        vedtaksperiodeVenter(periodState),
    ].filter(erVarsel);

    const feilVarsler = [
        tilstandfeil(periodState),
        ukjentTilstand(periodState),
        manglendeOppgavereferanse(periodState, oppgavereferanse),
    ].filter(erVarsel);

    const antallVarsler = varsler?.length ?? 0;
    const skalViseVarsler =
        antallVarsler > 0 || kontrollpunkter.length > 0 || infoVarsler.length > 0 || feilVarsler.length > 0;

    const skalViseKalkulerEndringerVarsel =
        !!lokaleInntektoverstyringer &&
        lokaleInntektoverstyringer.skjæringstidspunkt === skjæringstidspunkt &&
        lokaleInntektoverstyringer.arbeidsgivere.length > 0;

    if (!skalViseVarsler && !skalViseKalkulerEndringerVarsel) return null;

    const skjulVarslerHeader = infoVarsler.length === 0 && varsler?.length === 0 && feilVarsler.length === 0;
    const antallSjekket = varsler?.filter(erSjekket).length ?? 0;
    const headertekst = open
        ? 'Skjul varsler'
        : antallVarsler > 0
          ? `Vis varsler (${antallSjekket} av ${antallVarsler} varsler er sjekket)`
          : 'Vis varsler';

    return (
        <div>
            {skalViseVarsler && (
                <EkspanderbartVarsel aria-label={headertekst} open={open} onToggle={setOpen}>
                    <EkspanderbartVarsel.Header
                        flexDirection="row-reverse"
                        justify="start"
                        className={cn('border-b border-ax-border-neutral-subtle', skjulVarslerHeader && 'invisible')}
                    >
                        {headertekst}
                    </EkspanderbartVarsel.Header>
                    <EkspanderbartVarsel.Content>
                        {kontrollpunkter.length > 0 && (
                            <Alert className={alertklasser} variant="info" fullWidth>
                                <BodyShort weight="semibold">Kontroller:</BodyShort>
                                <ul>
                                    {kontrollpunkter.map((kontrollpunkt) => (
                                        <li key={kontrollpunkt}>{kontrollpunkt}</li>
                                    ))}
                                </ul>
                            </Alert>
                        )}
                        {infoVarsler.map((varsel) => (
                            <Melding key={varsel.melding} {...varsel} />
                        ))}
                        {varsler && <Varsler varsler={varsler} />}
                        {feilVarsler.map((varsel) => (
                            <Melding key={varsel.melding} {...varsel} />
                        ))}
                    </EkspanderbartVarsel.Content>
                </EkspanderbartVarsel>
            )}
            {skalViseKalkulerEndringerVarsel && (
                <KalkulerEndringerVarsel lokaleInntektoverstyringer={lokaleInntektoverstyringer} />
            )}
        </div>
    );
}

const alertklasser = 'border-x-0 border-t-0 py-2';

function Melding({ grad, melding }: VarselObject): ReactElement {
    return (
        <Alert className={alertklasser} variant={grad} fullWidth>
            <BodyShort className="text-ax-text-neutral">{melding}</BodyShort>
        </Alert>
    );
}

function erVarsel(varsel: VarselObject | null): varsel is VarselObject {
    return varsel !== null;
}

function erSjekket(varsel: ApiVarselDTO): boolean {
    return (
        varsel.vurdering?.status === ApiSaksbildeVarselstatus.VURDERT ||
        varsel.vurdering?.status === ApiSaksbildeVarselstatus.GODKJENT
    );
}

function sendtTilBeslutter(erBeslutteroppgaveOgErTidligereSaksbehandler: boolean): VarselObject | null {
    return erBeslutteroppgaveOgErTidligereSaksbehandler
        ? { grad: 'info', melding: 'Oppgaven er sendt til beslutter' }
        : null;
}

function tilstandfeil(state: PeriodState): VarselObject | null {
    switch (state) {
        case 'annulleringFeilet':
            return { grad: 'error', melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case 'utbetalingFeilet':
            return { grad: 'error', melding: 'Utbetalingen feilet.' };
        default:
            return null;
    }
}

function vedtaksperiodeVenter(state: PeriodState): VarselObject | null {
    switch (state) {
        case 'venter':
            return { grad: 'info', melding: 'Ikke klar til behandling - avventer system' };
        case 'venterPåInntektsopplysninger':
            return { grad: 'info', melding: 'Ikke klar til behandling - venter på inntektsmelding' };
        case 'venterPåKiling':
            return {
                grad: 'info',
                melding:
                    'Avventer behandling av en annen periode. Dette kan skyldes at søknad eller inntektsmelding for denne eller en annen arbeidsgiver mangler.',
            };
        case 'avventerAnnullering':
            return {
                grad: 'info',
                melding: 'Avventer behandling av en annen periode. Denne perioden vil bli annullert.',
            };
        default:
            return null;
    }
}

function manglendeOppgavereferanse(state: PeriodState, oppgavereferanse?: string | null): VarselObject | null {
    return state === 'tilGodkjenning' && !oppgavereferanse
        ? {
              grad: 'error',
              melding:
                  'Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.',
          }
        : null;
}

function ukjentTilstand(state: PeriodState): VarselObject | null {
    return state === 'ukjent' ? { grad: 'error', melding: 'Kunne ikke lese informasjon om periodens tilstand.' } : null;
}

interface BeslutteroppgaveParams {
    harTotrinnsvurdering: boolean;
    varsler: ApiVarselDTO[];
    harDagOverstyringer: boolean;
    harTilkommenInntektEndring: boolean;
    saksbehandlerhandlingerTilKontroll: string[];
    åpneEndringerPåPerson?: ApiOverstyring[] | null;
    activePeriodTom?: string;
    navnPåDeaktiverteGhostArbeidsgivere?: string;
}

function beslutteroppgave({
    harTotrinnsvurdering,
    varsler,
    harDagOverstyringer,
    harTilkommenInntektEndring,
    saksbehandlerhandlingerTilKontroll,
    åpneEndringerPåPerson,
    activePeriodTom,
    navnPåDeaktiverteGhostArbeidsgivere,
}: BeslutteroppgaveParams): string[] {
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
