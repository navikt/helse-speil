import dayjs from 'dayjs';

import {
    ApiAnnullering,
    ApiArbeidsgiver,
    ApiBehandling,
    ApiBeregnetPeriode,
    ApiEndrePaVent,
    ApiFjernetFraPaVent,
    ApiGhostPeriode,
    ApiHendelse,
    ApiHistorikkinnslag,
    ApiInntektHentetFraAOrdningen,
    ApiInntektoverstyring,
    ApiInntektsmelding,
    ApiKommentar,
    ApiLagtPaVent,
    ApiNotat,
    ApiOpphevStansAutomatiskBehandlingSaksbehandler,
    ApiOverstyring,
    ApiPeriode,
    ApiPeriodeHistorikkElementNy,
    ApiPeriodehistorikkType,
    ApiSaksbehandlerhandling,
    ApiSaksbildeKommentar,
    ApiSaksbildePerson,
    ApiSoknadArbeidsgiver,
    ApiSoknadArbeidsledig,
    ApiSoknadFrilans,
    ApiSoknadNav,
    ApiSoknadSelvstendig,
    ApiStansAutomatiskBehandlingSaksbehandler,
    ApiSykepengegrunnlagskjonnsfastsetting,
    ApiSykmelding,
    ApiTotrinnsvurderingRetur,
    ApiUberegnetPeriode,
    ApiVurdering,
} from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { saksbehandlerhandlingGjelderPeriode } from '@state/saksbehandlerhandlinger';
import {
    AnnetArbeidsforholdoverstyringhendelseObject,
    AnnulleringhendelseObject,
    ArbeidsforholdoverstyringhendelseObject,
    ArbeidsgiverSkjønnHendelse,
    DagoverstyringhendelseObject,
    DokumenthendelseObject,
    HistorikkhendelseObject,
    InntektoverstyringhendelseObject,
    MinimumSykdomsgradhendelseObject,
    NotathendelseObject,
    SaksbehandlerhandlinghendelseObject,
    SykepengegrunnlagskjonnsfastsettinghendelseObject,
    UtbetalinghendelseObject,
    VedtakBegrunnelseObject,
} from '@typer/historikk';
import { Kommentar, Notat } from '@typer/notat';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT } from '@utils/date';
import {
    isArbeidsforholdoverstyring,
    isBeregnetPeriode,
    isDagoverstyring,
    isGhostPeriode,
    isInntektoverstyring,
    isMinimumSykdomsgradsoverstyring,
    isSykepengegrunnlagskjønnsfastsetting,
} from '@utils/typeguards';

import { harIngenUtbetaltePerioderFor } from '../sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';

const isInntektsmelding = (hendelse: ApiHendelse): hendelse is ApiInntektsmelding => {
    return hendelse.hendelsetype === 'INNTEKTSMELDING';
};

const isSykmelding = (hendelse: ApiHendelse): hendelse is ApiSykmelding => {
    return hendelse.hendelsetype === 'NY_SOKNAD';
};

const isInntektHentetFraAordningen = (hendelse: ApiHendelse): hendelse is ApiInntektHentetFraAOrdningen => {
    return hendelse.hendelsetype === 'INNTEKT_HENTET_FRA_AORDNINGEN';
};

const isSøknadNav = (hendelse: ApiHendelse): hendelse is ApiSoknadNav => {
    return hendelse.hendelsetype === 'SENDT_SOKNAD_NAV';
};

const isSøknadArbeidsgiver = (hendelse: ApiHendelse): hendelse is ApiSoknadArbeidsgiver => {
    return hendelse.hendelsetype === 'SENDT_SOKNAD_ARBEIDSGIVER';
};

const isSøknadArbeidsledig = (hendelse: ApiHendelse): hendelse is ApiSoknadArbeidsgiver => {
    return hendelse.hendelsetype === 'SENDT_SOKNAD_ARBEIDSLEDIG';
};

const isSøknadFrilans = (hendelse: ApiHendelse): hendelse is ApiSoknadFrilans => {
    return hendelse.hendelsetype === 'SENDT_SOKNAD_FRILANS';
};

const isSøknadSelvstendig = (hendelse: ApiHendelse): hendelse is ApiSoknadSelvstendig => {
    return hendelse.hendelsetype === 'SENDT_SOKNAD_SELVSTENDIG';
};

const isDokument = (
    hendelse: ApiHendelse,
): hendelse is
    | ApiInntektsmelding
    | ApiSykmelding
    | ApiSoknadNav
    | ApiSoknadArbeidsgiver
    | ApiSoknadArbeidsledig
    | ApiSoknadFrilans
    | ApiSoknadSelvstendig
    | ApiInntektHentetFraAOrdningen => {
    return (
        isInntektsmelding(hendelse) ||
        isSykmelding(hendelse) ||
        isSøknadNav(hendelse) ||
        isInntektHentetFraAordningen(hendelse) ||
        isSøknadArbeidsgiver(hendelse) ||
        isSøknadArbeidsledig(hendelse) ||
        isSøknadFrilans(hendelse) ||
        isSøknadSelvstendig(hendelse)
    );
};

export const getDokumenter = (periode: ApiBeregnetPeriode | ApiUberegnetPeriode): DokumenthendelseObject[] =>
    periode.hendelser.filter(isDokument).map((hendelse) => {
        if (isInntektsmelding(hendelse)) {
            return {
                id: hendelse.id,
                type: 'Dokument',
                dokumenttype: 'Inntektsmelding',
                timestamp: hendelse.mottattDato,
                dokumentId: hendelse.eksternDokumentId,
            };
        } else if (isSykmelding(hendelse)) {
            return {
                id: hendelse.id,
                type: 'Dokument',
                dokumenttype: 'Sykmelding',
                timestamp: hendelse.rapportertDato,
            };
        } else if (isInntektHentetFraAordningen(hendelse)) {
            return {
                id: hendelse.id,
                type: 'Dokument',
                dokumenttype: 'InntektHentetFraAordningen',
                timestamp: hendelse.mottattDato,
            };
        } else {
            return {
                id: hendelse.id,
                type: 'Dokument',
                dokumenttype: 'Søknad',
                timestamp: hendelse.rapportertDato,
                dokumentId: hendelse.eksternDokumentId,
            };
        }
    });

export const getMeldingOmVedtak = (periode: ApiBeregnetPeriode): DokumenthendelseObject[] =>
    periode.utbetaling.vurdering?.godkjent
        ? [
              {
                  id: periode.utbetaling.id,
                  type: 'Dokument',
                  dokumenttype: 'Vedtak',
                  timestamp: periode.utbetaling.vurdering.tidsstempel,
                  dokumentId: periode.utbetaling.id,
              },
          ]
        : [];

export const getVedtakBegrunnelser = (period: ApiBeregnetPeriode): VedtakBegrunnelseObject[] =>
    period.vedtakBegrunnelser
        .filter((vedtakBegrunnelse) => {
            return isNonEmpty(vedtakBegrunnelse.begrunnelse ?? null);
        })
        .map((vedtakBegrunnelse, index) => {
            return {
                id: `vedtakBegrunnelse-${index}`,
                type: 'VedtakBegrunnelse',
                utfall: vedtakBegrunnelse.utfall,
                begrunnelse: vedtakBegrunnelse.begrunnelse!,
                saksbehandler: vedtakBegrunnelse.saksbehandlerIdent,
                timestamp: vedtakBegrunnelse.opprettet,
            };
        });

export const getAnnullering = (annullering: ApiAnnullering | null): AnnulleringhendelseObject | null => {
    if (!annullering) return null;

    const { arsaker, begrunnelse, saksbehandlerIdent, tidspunkt } = annullering;

    return {
        id: `annullering-${annullering.arbeidsgiverFagsystemId}`,
        type: 'Annullering',
        årsaker: arsaker,
        begrunnelse: begrunnelse ?? null,
        saksbehandler: saksbehandlerIdent,
        timestamp: tidspunkt,
    };
};

export const getHistorikkinnslag = (periode: ApiBeregnetPeriode | ApiUberegnetPeriode): HistorikkhendelseObject[] =>
    periode.historikkinnslag.map((historikkelement, index): HistorikkhendelseObject => {
        return {
            id: `historikkinnslag-${index}`,
            historikkinnslagId: historikkelement.id,
            type: 'Historikk',
            historikktype: historikkelement.historikktype,
            saksbehandler: historikkelement.saksbehandlerIdent ?? null,
            dialogRef: historikkelement.dialogRef ?? null,
            timestamp: historikkelement.timestamp as DateString,
            årsaker: årsaker(historikkelement),
            frist: frist(historikkelement),
            notattekst: notattekst(historikkelement),
            kommentarer: kommentarer(historikkelement),
            erNyestePåVentInnslag:
                [...periode.historikkinnslag]
                    .sort(byTimestampHistorikkinnslag)
                    .find((it) =>
                        (
                            [
                                ApiPeriodehistorikkType.LEGG_PA_VENT,
                                ApiPeriodehistorikkType.ENDRE_PA_VENT,
                            ] as ApiPeriodehistorikkType[]
                        ).includes(it.historikktype),
                    )?.id === historikkelement.id,
        };
    });

const årsaker = (
    historikkelement:
        | ApiLagtPaVent
        | ApiFjernetFraPaVent
        | ApiEndrePaVent
        | ApiTotrinnsvurderingRetur
        | ApiStansAutomatiskBehandlingSaksbehandler
        | ApiOpphevStansAutomatiskBehandlingSaksbehandler
        | ApiPeriodeHistorikkElementNy
        | null
        | undefined,
): string[] => {
    if (!historikkelement) return [];
    return historikkelement.type === 'ApiLagtPaVent' || historikkelement.type === 'ApiEndrePaVent'
        ? historikkelement.arsaker
        : [];
};

const frist = (
    historikkelement:
        | ApiLagtPaVent
        | ApiEndrePaVent
        | ApiFjernetFraPaVent
        | ApiTotrinnsvurderingRetur
        | ApiStansAutomatiskBehandlingSaksbehandler
        | ApiOpphevStansAutomatiskBehandlingSaksbehandler
        | ApiPeriodeHistorikkElementNy
        | null
        | undefined,
): string | null => {
    return historikkelement?.type === 'ApiLagtPaVent' || historikkelement?.type === 'ApiEndrePaVent'
        ? (historikkelement.frist ?? null)
        : null;
};

const notattekst = (
    historikkelement:
        | ApiLagtPaVent
        | ApiEndrePaVent
        | ApiFjernetFraPaVent
        | ApiTotrinnsvurderingRetur
        | ApiStansAutomatiskBehandlingSaksbehandler
        | ApiOpphevStansAutomatiskBehandlingSaksbehandler
        | ApiPeriodeHistorikkElementNy
        | null
        | undefined,
): string | null => {
    const automatiskReturTekst = 'Perioden er automatisk reberegnet etter at den ble sendt til beslutter.';
    if (
        historikkelement?.type === 'ApiLagtPaVent' ||
        historikkelement?.type === 'ApiEndrePaVent' ||
        historikkelement?.type === 'ApiStansAutomatiskBehandlingSaksbehandler' ||
        historikkelement?.type === 'ApiOpphevStansAutomatiskBehandlingSaksbehandler'
    ) {
        return historikkelement.notattekst ?? null;
    }
    if (historikkelement?.type === 'ApiTotrinnsvurderingRetur') {
        return historikkelement.notattekst ?? automatiskReturTekst;
    }
    return null;
};

const kommentarer = (
    historikkelement:
        | ApiLagtPaVent
        | ApiEndrePaVent
        | ApiFjernetFraPaVent
        | ApiTotrinnsvurderingRetur
        | ApiStansAutomatiskBehandlingSaksbehandler
        | ApiOpphevStansAutomatiskBehandlingSaksbehandler
        | ApiPeriodeHistorikkElementNy
        | null
        | undefined,
): Kommentar[] =>
    historikkelement?.type === 'ApiLagtPaVent' ||
    historikkelement?.type === 'ApiEndrePaVent' ||
    historikkelement?.type === 'ApiTotrinnsvurderingRetur' ||
    historikkelement?.type === 'ApiStansAutomatiskBehandlingSaksbehandler' ||
    historikkelement?.type === 'ApiOpphevStansAutomatiskBehandlingSaksbehandler'
        ? (historikkelement.kommentarer ?? []).map(toKommentar)
        : [];

const getTidligsteVurderingstidsstempelForPeriode = (
    period: ApiBeregnetPeriode,
    behandlinger: ApiBehandling[],
): string | null =>
    [...behandlinger]
        ?.reverse()
        ?.flatMap((it) =>
            it?.perioder
                .filter(isBeregnetPeriode)
                .find(
                    (periode: ApiBeregnetPeriode) =>
                        periode.vedtaksperiodeId === period.vedtaksperiodeId &&
                        periode.utbetaling.vurdering?.godkjent === true,
                ),
        )
        ?.filter(isBeregnetPeriode)
        ?.shift()?.utbetaling.vurdering?.tidsstempel ?? null;

export const getDagoverstyringer = (
    period: ApiBeregnetPeriode,
    inntektsforhold: Inntektsforhold,
): DagoverstyringhendelseObject[] => {
    const behandlinger: ApiBehandling[] = inntektsforhold.behandlinger;
    const overstyringer: ApiOverstyring[] = inntektsforhold.overstyringer;
    const vurderingstidsstempel = getTidligsteVurderingstidsstempelForPeriode(period, behandlinger);
    const førsteVurdertePeriodeForArbeidsgiver = getFørsteVurdertePeriodeForSkjæringstidspunktet(
        period.skjaeringstidspunkt,
        behandlinger,
    );

    const sisteVurdertePeriodeForArbeidsgiverISkjæringstidspunktet = behandlinger[0]
        ? getSisteVurdertePeriodeForSkjæringstidspunktet(period.skjaeringstidspunkt, behandlinger[0])
        : undefined;

    return overstyringer
        .filter(isDagoverstyring)
        .filter(
            (it) =>
                dayjs(it.dager[0]?.dato, ISO_DATOFORMAT).isSameOrAfter(førsteVurdertePeriodeForArbeidsgiver?.fom) &&
                dayjs(it.dager[0]?.dato, ISO_DATOFORMAT).isSameOrBefore(
                    sisteVurdertePeriodeForArbeidsgiverISkjæringstidspunktet?.tom,
                ),
        )
        .map((overstyring) => ({
            id: overstyring.hendelseId,
            type: 'Dagoverstyring',
            erRevurdering: dayjs(overstyring.timestamp).isAfter(vurderingstidsstempel),
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            begrunnelse: overstyring.begrunnelse,
            dager: overstyring.dager,
        }));
};

export const getDagoverstyringerForAUU = (
    period: ApiUberegnetPeriode,
    inntektsforhold: Inntektsforhold,
): DagoverstyringhendelseObject[] => {
    const behandlinger = inntektsforhold.behandlinger;
    const sisteTomForIkkeGhostsPåSkjæringstidspunktet =
        behandlinger[0] && getSisteTomForIkkeGhostsPåSkjæringstidspunktet(period.skjaeringstidspunkt, behandlinger[0]);

    return inntektsforhold.overstyringer
        .filter(isDagoverstyring)
        .filter(
            (it) =>
                dayjs(it.dager[0]?.dato, ISO_DATOFORMAT).isSameOrAfter(period?.fom) &&
                dayjs(it.dager[0]?.dato, ISO_DATOFORMAT).isSameOrBefore(
                    sisteTomForIkkeGhostsPåSkjæringstidspunktet?.tom,
                ),
        )
        .map((overstyring) => ({
            id: overstyring.hendelseId,
            type: 'Dagoverstyring',
            erRevurdering: false,
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            begrunnelse: overstyring.begrunnelse,
            dager: overstyring.dager,
        }));
};

const periodeErAttestert = (periode: ApiBeregnetPeriode): boolean => {
    return periode.historikkinnslag.some(
        (historikkelement) => historikkelement.historikktype === ApiPeriodehistorikkType.TOTRINNSVURDERING_ATTESTERT,
    );
};

export const getUtbetalingshendelse = (periode: ApiBeregnetPeriode): UtbetalinghendelseObject | null => {
    if (!periode.utbetaling.vurdering || periodeErAttestert(periode)) {
        return null;
    }

    const { automatisk, godkjent, tidsstempel, ident } = periode.utbetaling.vurdering;

    return {
        id: `utbetaling-${periode.utbetaling.id}`,
        type: 'Utbetaling',
        automatisk: automatisk,
        godkjent: godkjent,
        utbetalingstype: periode.utbetaling.type,
        saksbehandler: ident,
        timestamp: tidsstempel,
    };
};

const getFørsteVurdertePeriodeForSkjæringstidspunktet = (
    skjæringstidspunkt: DateString,
    behandlinger: ApiBehandling[],
): ApiBeregnetPeriode | undefined =>
    [...behandlinger]
        .flatMap<ApiPeriode | undefined>((behandling: ApiBehandling) =>
            behandling.perioder.flatMap((p: ApiPeriode) =>
                p.skjaeringstidspunkt === skjæringstidspunkt ? p : undefined,
            ),
        )
        .filter((period) => period !== undefined)
        .filter(isBeregnetPeriode)
        .sort((a, b) => dayjs(b.fom).diff(dayjs(a.fom)))
        .pop();

export const getFørstePeriodeForSkjæringstidspunkt = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: Inntektsforhold,
): ApiPeriode | undefined =>
    arbeidsgiver.behandlinger.length
        ? [...arbeidsgiver.behandlinger][0]?.perioder
              .filter((periode) => periode.skjaeringstidspunkt === skjæringstidspunkt)
              .pop()
        : undefined;

export const kanStrekkes = (
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode,
    inntektsforhold: Inntektsforhold,
): boolean => {
    const erFørstePeriodePåSkjæringstidspunkt =
        getFørstePeriodeForSkjæringstidspunkt(periode.skjaeringstidspunkt, inntektsforhold)?.id === periode.id;

    const sistePeriodeFørAktivPeriode = inntektsforhold.behandlinger[0]?.perioder.filter((p) =>
        dayjs(p.tom).isBefore(periode.fom),
    )[0];

    const tidligerePeriodeErIkkeSammenhengende =
        sistePeriodeFørAktivPeriode && dayjs(sistePeriodeFørAktivPeriode.tom).add(1, 'day').isBefore(periode.fom);

    return (erFørstePeriodePåSkjæringstidspunkt || tidligerePeriodeErIkkeSammenhengende) ?? false;
};

const getSisteVurdertePeriodeForSkjæringstidspunktet = (
    skjæringstidspunkt: DateString,
    behandling: ApiBehandling,
): ApiBeregnetPeriode | undefined =>
    behandling.perioder
        .filter(isBeregnetPeriode)
        .filter(
            (beregnetPeriodeFragment: ApiBeregnetPeriode) =>
                beregnetPeriodeFragment.skjaeringstidspunkt === skjæringstidspunkt,
        )
        .shift();

const getSisteTomForIkkeGhostsPåSkjæringstidspunktet = (
    skjæringstidspunkt: DateString,
    behandling: ApiBehandling,
): ApiPeriode | undefined =>
    behandling.perioder
        .filter((periode) => !isGhostPeriode(periode) && periode.skjaeringstidspunkt === skjæringstidspunkt)
        .shift();

const getOpprinneligVurderingForFørstePeriodeISkjæringstidspunkt = (
    skjæringstidspunkt: DateString,
    behandlinger: ApiBehandling[],
): ApiVurdering | null => {
    const førsteVurdertePeriodeForSkjæringstidspunktet = getFørsteVurdertePeriodeForSkjæringstidspunktet(
        skjæringstidspunkt,
        behandlinger,
    );

    return førsteVurdertePeriodeForSkjæringstidspunktet?.utbetaling.vurdering ?? null;
};

export const getInntektoverstyringer = (
    period: ApiBeregnetPeriode | ApiUberegnetPeriode,
    inntektsforhold: Inntektsforhold,
): InntektoverstyringhendelseObject[] => {
    const skjæringstidspunkt = period.skjaeringstidspunkt;
    const vurdering = getOpprinneligVurderingForFørstePeriodeISkjæringstidspunkt(
        skjæringstidspunkt,
        inntektsforhold.behandlinger,
    );

    return inntektsforhold.overstyringer
        .filter(isInntektoverstyring)
        .filter((it) => it.inntekt.skjaeringstidspunkt === skjæringstidspunkt)
        .map((overstyring: ApiInntektoverstyring) => ({
            id: overstyring.hendelseId,
            type: 'Inntektoverstyring',
            erRevurdering: dayjs(overstyring.timestamp).isAfter(vurdering?.tidsstempel),
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            inntekt: overstyring.inntekt,
            inntektsforholdReferanse: tilReferanse(inntektsforhold),
        }));
};

export const getInntektoverstyringerForGhost = (
    skjaeringstidspunkt: string,
    arbeidsgiver: ApiArbeidsgiver,
    person: ApiSaksbildePerson,
): InntektoverstyringhendelseObject[] => {
    return arbeidsgiver.overstyringer
        .filter(isInntektoverstyring)
        .filter((it) => it.inntekt.skjaeringstidspunkt === skjaeringstidspunkt)
        .map((overstyring: ApiInntektoverstyring) => ({
            id: overstyring.hendelseId,
            type: 'Inntektoverstyring',
            erRevurdering: !harIngenUtbetaltePerioderFor(person, skjaeringstidspunkt),
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            inntekt: overstyring.inntekt,
            inntektsforholdReferanse: tilReferanse(arbeidsgiver),
        }));
};

export const getArbeidsforholdoverstyringhendelser = (
    period: ApiBeregnetPeriode | ApiGhostPeriode,
    inntektsforhold: Inntektsforhold,
): ArbeidsforholdoverstyringhendelseObject[] => {
    return inntektsforhold.overstyringer
        .filter(isArbeidsforholdoverstyring)
        .filter((it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt)
        .map((it) => ({
            id: it.hendelseId,
            type: 'Arbeidsforholdoverstyring',
            erDeaktivert: it.deaktivert,
            saksbehandler: it.saksbehandler.ident ?? it.saksbehandler.navn,
            timestamp: it.timestamp,
            begrunnelse: it.begrunnelse,
            forklaring: it.forklaring,
            skjæringstidspunkt: it.skjaeringstidspunkt,
        }));
};

export const getAnnetArbeidsforholdoverstyringhendelser = (
    period: ApiBeregnetPeriode | ApiGhostPeriode,
    andreInntektsforhold: Inntektsforhold[],
): AnnetArbeidsforholdoverstyringhendelseObject[] =>
    andreInntektsforhold
        .flatMap((it) => ({ inntektsforholdReferanse: tilReferanse(it), overstyringer: it.overstyringer }))
        .reduce<AnnetArbeidsforholdoverstyringhendelseObject[]>(
            (output, { inntektsforholdReferanse, overstyringer }) =>
                output.concat(
                    overstyringer
                        .filter(isArbeidsforholdoverstyring)
                        .filter((it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt)
                        .map((it) => ({
                            id: it.hendelseId,
                            type: 'AnnetArbeidsforholdoverstyring',
                            erDeaktivert: it.deaktivert,
                            saksbehandler: it.saksbehandler.ident ?? it.saksbehandler.navn,
                            timestamp: it.timestamp,
                            begrunnelse: it.begrunnelse,
                            forklaring: it.forklaring,
                            skjæringstidspunkt: it.skjaeringstidspunkt,
                            inntektsforholdReferanse: inntektsforholdReferanse,
                        })),
                ),
            [] as AnnetArbeidsforholdoverstyringhendelseObject[],
        );

export const getSykepengegrunnlagskjønnsfastsetting = (
    period: ApiBeregnetPeriode | ApiUberegnetPeriode,
    inntektsforhold: Inntektsforhold,
    andreInntektsforhold: Inntektsforhold[],
): SykepengegrunnlagskjonnsfastsettinghendelseObject[] =>
    inntektsforhold.overstyringer
        .filter(isSykepengegrunnlagskjønnsfastsetting)
        .filter((it) => it.skjonnsfastsatt.skjaeringstidspunkt === period.skjaeringstidspunkt)
        .map((overstyring: ApiSykepengegrunnlagskjonnsfastsetting) => ({
            id: overstyring.hendelseId,
            type: 'Sykepengegrunnlagskjonnsfastsetting',
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            skjønnsfastsatt: overstyring.skjonnsfastsatt,
            arbeidsgivere: getAlleInntektsforholdÅrsinntekter(overstyring.hendelseId, [
                inntektsforhold,
                ...andreInntektsforhold,
            ]),
        }));

const getAlleInntektsforholdÅrsinntekter = (
    hendelseId: string,
    alleInntektsforhold: Inntektsforhold[],
): ArbeidsgiverSkjønnHendelse[] =>
    alleInntektsforhold.reduce((liste: ArbeidsgiverSkjønnHendelse[], inntektsforhold) => {
        const skjønnsfastsatt = inntektsforhold.overstyringer
            .filter(isSykepengegrunnlagskjønnsfastsetting)
            .filter((it) => it.hendelseId === hendelseId)
            ?.shift()?.skjonnsfastsatt;

        if (skjønnsfastsatt !== undefined) {
            liste.push({
                inntektsforholdReferanse: tilReferanse(inntektsforhold),
                årlig: skjønnsfastsatt?.arlig ?? 0,
                fraÅrlig: skjønnsfastsatt?.fraArlig ?? 0,
            });
        }
        return liste;
    }, []);

export const getMinimumSykdomsgradoverstyring = (
    period: ApiBeregnetPeriode,
    inntektsforhold: Inntektsforhold,
): MinimumSykdomsgradhendelseObject[] => {
    const behandlinger = inntektsforhold.behandlinger;
    const førsteVurdertePeriodeForArbeidsgiver = getFørsteVurdertePeriodeForSkjæringstidspunktet(
        period.skjaeringstidspunkt,
        behandlinger,
    );
    const sisteVurdertePeriodeForArbeidsgiverISkjæringstidspunktet = behandlinger[0]
        ? getSisteVurdertePeriodeForSkjæringstidspunktet(period.skjaeringstidspunkt, behandlinger[0])
        : undefined;

    return inntektsforhold.overstyringer
        .filter(isMinimumSykdomsgradsoverstyring)
        .filter((it) => {
            const førsteFom =
                it.minimumSykdomsgrad.perioderVurdertOk?.[0]?.fom ??
                it.minimumSykdomsgrad.perioderVurdertIkkeOk[0]!.fom;
            return (
                dayjs(førsteFom, ISO_DATOFORMAT).isSameOrAfter(førsteVurdertePeriodeForArbeidsgiver?.fom) &&
                dayjs(førsteFom, ISO_DATOFORMAT).isSameOrBefore(
                    sisteVurdertePeriodeForArbeidsgiverISkjæringstidspunktet?.tom,
                )
            );
        })
        .map((overstyring) => ({
            id: overstyring.hendelseId,
            type: 'MinimumSykdomsgradoverstyring',
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            minimumSykdomsgrad: overstyring.minimumSykdomsgrad,
        }));
};

export const tilNotathendelse = (apiNotater: ApiNotat[]) => {
    const notater = apiNotater.map(toNotat);
    return notater.map(
        (notat: Notat) =>
            ({
                id: notat.id,
                dialogRef: notat.dialogRef,
                type: 'Notat',
                tekst: notat.tekst,
                erOpphevStans: notat.erOpphevStans,
                saksbehandler: notat.saksbehandler.ident,
                timestamp: notat.opprettet.format(ISO_TIDSPUNKTFORMAT),
                feilregistrert: notat.feilregistrert,
                vedtaksperiodeId: notat.vedtaksperiodeId,
                kommentarer: notat.kommentarer,
                erNyesteNotatMedType:
                    [...notater].sort(byTimestamp).find((it) => it.erOpphevStans === notat.erOpphevStans)?.id ===
                    notat.id,
            }) satisfies NotathendelseObject,
    );
};

export function getSaksbehandlerhandlinger(
    handlinger: ApiSaksbehandlerhandling[],
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode,
): SaksbehandlerhandlinghendelseObject[] {
    return handlinger
        .filter((handling) => saksbehandlerhandlingGjelderPeriode(handling, periode))
        .map((handling) => ({
            id: handling.handlingId,
            type: 'Saksbehandlerhandling',
            handlingType: handling.handlingType,
            saksbehandler: handling.saksbehandlerIdent,
            timestamp: handling.tidspunkt,
        }));
}

const toNotat = (apiNotat: ApiNotat): Notat => ({
    id: `${apiNotat.id}`,
    dialogRef: apiNotat.dialogRef,
    tekst: apiNotat.tekst,
    saksbehandler: {
        navn: apiNotat.saksbehandlerNavn,
        oid: apiNotat.saksbehandlerOid,
        epost: apiNotat.saksbehandlerEpost,
        ident: apiNotat.saksbehandlerIdent,
    },
    opprettet: dayjs(apiNotat.opprettet),
    vedtaksperiodeId: apiNotat.vedtaksperiodeId,
    feilregistrert: apiNotat.feilregistrert,
    erOpphevStans: apiNotat.type === 'OpphevStans',
    kommentarer: apiNotat.kommentarer.map(toKommentar) ?? [],
});

const toKommentar = (apiKommentar: ApiKommentar | ApiSaksbildeKommentar): Kommentar => ({
    id: apiKommentar.id,
    tekst: apiKommentar.tekst,
    opprettet: apiKommentar.opprettet,
    saksbehandlerident: apiKommentar.saksbehandlerident,
    feilregistrert_tidspunkt: apiKommentar.feilregistrert_tidspunkt ?? undefined,
});

const byTimestamp = (a: Notat, b: Notat): number => {
    return dayjs(b.opprettet).diff(dayjs(a.opprettet));
};

const byTimestampHistorikkinnslag = (a: ApiHistorikkinnslag, b: ApiHistorikkinnslag): number => {
    return dayjs(b.timestamp).diff(dayjs(a.timestamp));
};

function isNonEmpty(begrunnelse: string | null): boolean {
    return begrunnelse !== null && begrunnelse !== undefined && begrunnelse !== '';
}
