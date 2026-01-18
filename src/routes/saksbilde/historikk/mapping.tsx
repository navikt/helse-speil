import dayjs from 'dayjs';

import {
    Arbeidsgiver,
    Behandling,
    BeregnetPeriodeFragment,
    EndrePaVent,
    FjernetFraPaVent,
    GhostPeriodeFragment,
    Hendelse,
    Historikkinnslag,
    InntektHentetFraAOrdningen,
    Inntektoverstyring,
    Inntektsmelding,
    Kommentar,
    LagtPaVent,
    OpphevStansAutomatiskBehandlingSaksbehandler,
    Overstyring,
    Periode,
    PeriodeHistorikkElementNy,
    PeriodehistorikkType,
    PersonFragment,
    SoknadArbeidsgiver,
    SoknadArbeidsledig,
    SoknadFrilans,
    SoknadNav,
    SoknadSelvstendig,
    StansAutomatiskBehandlingSaksbehandler,
    Sykepengegrunnlagskjonnsfastsetting,
    Sykmelding,
    TotrinnsvurderingRetur,
    UberegnetPeriodeFragment,
    Vurdering,
} from '@io/graphql';
import { Inntektsforhold, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { toNotat } from '@state/notater';
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
    SykepengegrunnlagskjonnsfastsettinghendelseObject,
    UtbetalinghendelseObject,
    VedtakBegrunnelseObject,
} from '@typer/historikk';
import { Notat } from '@typer/notat';
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

const isInntektsmelding = (hendelse: Hendelse): hendelse is Inntektsmelding => {
    return hendelse.type === 'INNTEKTSMELDING';
};

const isSykmelding = (hendelse: Hendelse): hendelse is Sykmelding => {
    return hendelse.type === 'NY_SOKNAD';
};

const isInntektHentetFraAordningen = (hendelse: Hendelse): hendelse is InntektHentetFraAOrdningen => {
    return hendelse.type === 'INNTEKT_HENTET_FRA_AORDNINGEN';
};

const isSøknadNav = (hendelse: Hendelse): hendelse is SoknadNav => {
    return hendelse.type === 'SENDT_SOKNAD_NAV';
};

const isSøknadArbeidsgiver = (hendelse: Hendelse): hendelse is SoknadArbeidsgiver => {
    return hendelse.type === 'SENDT_SOKNAD_ARBEIDSGIVER';
};

const isSøknadArbeidsledig = (hendelse: Hendelse): hendelse is SoknadArbeidsgiver => {
    return hendelse.type === 'SENDT_SOKNAD_ARBEIDSLEDIG';
};

const isSøknadFrilans = (hendelse: Hendelse): hendelse is SoknadFrilans => {
    return hendelse.type === 'SENDT_SOKNAD_FRILANS';
};

const isSøknadSelvstendig = (hendelse: Hendelse): hendelse is SoknadSelvstendig => {
    return hendelse.type === 'SENDT_SOKNAD_SELVSTENDIG';
};

const isDokument = (
    hendelse: Hendelse,
): hendelse is
    | Inntektsmelding
    | Sykmelding
    | SoknadNav
    | SoknadArbeidsgiver
    | SoknadArbeidsledig
    | SoknadFrilans
    | SoknadSelvstendig
    | InntektHentetFraAOrdningen => {
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

export const getDokumenter = (periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment): DokumenthendelseObject[] =>
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

export const getMeldingOmVedtak = (periode: BeregnetPeriodeFragment): DokumenthendelseObject[] =>
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

export const getVedtakBegrunnelser = (period: BeregnetPeriodeFragment): VedtakBegrunnelseObject[] =>
    period.vedtakBegrunnelser
        .filter((vedtakBegrunnelse) => {
            return isNonEmpty(vedtakBegrunnelse.begrunnelse);
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

export const getAnnullering = (period: BeregnetPeriodeFragment): AnnulleringhendelseObject | null => {
    if (!period.annullering) return null;

    const { arsaker, begrunnelse, saksbehandlerIdent, tidspunkt } = period.annullering;

    return {
        id: `annullering-${period.annullering.arbeidsgiverFagsystemId}`,
        type: 'Annullering',
        årsaker: arsaker,
        begrunnelse: begrunnelse,
        saksbehandler: saksbehandlerIdent,
        timestamp: tidspunkt,
    };
};

export const getHistorikkinnslag = (periode: BeregnetPeriodeFragment): HistorikkhendelseObject[] =>
    periode.historikkinnslag.map((historikkelement, index): HistorikkhendelseObject => {
        return {
            id: `historikkinnslag-${index}`,
            historikkinnslagId: historikkelement.id,
            type: 'Historikk',
            historikktype: historikkelement.type,
            saksbehandler: historikkelement.saksbehandlerIdent,
            dialogRef: historikkelement.dialogRef,
            timestamp: historikkelement.timestamp as DateString,
            årsaker: årsaker(historikkelement),
            frist: frist(historikkelement),
            notattekst: notattekst(historikkelement),
            kommentarer: kommentarer(historikkelement),
            erNyestePåVentInnslag:
                [...periode.historikkinnslag]
                    .sort(byTimestampHistorikkinnslag)
                    .find((it) => [PeriodehistorikkType.LeggPaVent, PeriodehistorikkType.EndrePaVent].includes(it.type))
                    ?.id === historikkelement.id,
        };
    });

const årsaker = (
    historikkelement:
        | LagtPaVent
        | FjernetFraPaVent
        | EndrePaVent
        | TotrinnsvurderingRetur
        | StansAutomatiskBehandlingSaksbehandler
        | OpphevStansAutomatiskBehandlingSaksbehandler
        | PeriodeHistorikkElementNy
        | null
        | undefined,
): string[] => {
    if (!historikkelement) return [];
    return historikkelement.__typename === 'LagtPaVent' || historikkelement.__typename === 'EndrePaVent'
        ? historikkelement.arsaker
        : [];
};

const frist = (
    historikkelement:
        | LagtPaVent
        | EndrePaVent
        | FjernetFraPaVent
        | TotrinnsvurderingRetur
        | StansAutomatiskBehandlingSaksbehandler
        | OpphevStansAutomatiskBehandlingSaksbehandler
        | PeriodeHistorikkElementNy
        | null
        | undefined,
): string | null => {
    return historikkelement?.__typename === 'LagtPaVent' || historikkelement?.__typename === 'EndrePaVent'
        ? historikkelement.frist
        : null;
};

const notattekst = (
    historikkelement:
        | LagtPaVent
        | EndrePaVent
        | FjernetFraPaVent
        | TotrinnsvurderingRetur
        | StansAutomatiskBehandlingSaksbehandler
        | OpphevStansAutomatiskBehandlingSaksbehandler
        | PeriodeHistorikkElementNy
        | null
        | undefined,
): string | null => {
    const automatiskReturTekst = 'Perioden er automatisk reberegnet etter at den ble sendt til beslutter.';
    if (
        historikkelement?.__typename === 'LagtPaVent' ||
        historikkelement?.__typename === 'EndrePaVent' ||
        historikkelement?.__typename === 'StansAutomatiskBehandlingSaksbehandler' ||
        historikkelement?.__typename === 'OpphevStansAutomatiskBehandlingSaksbehandler'
    ) {
        return historikkelement.notattekst;
    }
    if (historikkelement?.__typename === 'TotrinnsvurderingRetur') {
        return historikkelement.notattekst !== null ? historikkelement.notattekst : automatiskReturTekst;
    }
    return null;
};

const kommentarer = (
    historikkelement:
        | LagtPaVent
        | EndrePaVent
        | FjernetFraPaVent
        | TotrinnsvurderingRetur
        | StansAutomatiskBehandlingSaksbehandler
        | OpphevStansAutomatiskBehandlingSaksbehandler
        | PeriodeHistorikkElementNy
        | null
        | undefined,
): Kommentar[] =>
    historikkelement?.__typename === 'LagtPaVent' ||
    historikkelement?.__typename === 'EndrePaVent' ||
    historikkelement?.__typename === 'TotrinnsvurderingRetur' ||
    historikkelement?.__typename === 'StansAutomatiskBehandlingSaksbehandler' ||
    historikkelement?.__typename === 'OpphevStansAutomatiskBehandlingSaksbehandler'
        ? historikkelement.kommentarer
        : [];

const getTidligsteVurderingstidsstempelForPeriode = (
    period: BeregnetPeriodeFragment,
    behandlinger: Behandling[],
): string | null =>
    [...behandlinger]
        ?.reverse()
        ?.flatMap((it) =>
            it?.perioder
                .filter(isBeregnetPeriode)
                .find(
                    (periode: BeregnetPeriodeFragment) =>
                        periode.vedtaksperiodeId === period.vedtaksperiodeId &&
                        periode.utbetaling.vurdering?.godkjent === true,
                ),
        )
        ?.filter(isBeregnetPeriode)
        ?.shift()?.utbetaling.vurdering?.tidsstempel ?? null;

export const getDagoverstyringer = (
    period: BeregnetPeriodeFragment,
    inntektsforhold: Inntektsforhold,
): DagoverstyringhendelseObject[] => {
    const behandlinger: Behandling[] = inntektsforhold.behandlinger;
    const overstyringer: Overstyring[] = inntektsforhold.overstyringer;
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
    period: UberegnetPeriodeFragment,
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

const periodeErAttestert = (periode: BeregnetPeriodeFragment): boolean => {
    return periode.historikkinnslag.some(
        (historikkelement) => historikkelement.type === PeriodehistorikkType.TotrinnsvurderingAttestert,
    );
};

export const getUtbetalingshendelse = (periode: BeregnetPeriodeFragment): UtbetalinghendelseObject | null => {
    if (!periode.utbetaling.vurdering || periodeErAttestert(periode)) {
        return null;
    }

    const { automatisk, godkjent, tidsstempel, ident } = periode.utbetaling.vurdering;

    return {
        id: `utbetaling-${periode.beregningId}`,
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
    behandlinger: Behandling[],
): BeregnetPeriodeFragment | undefined =>
    [...behandlinger]
        .flatMap<Periode | undefined>((behandling: Behandling) =>
            behandling.perioder.flatMap((p: Periode) => (p.skjaeringstidspunkt === skjæringstidspunkt ? p : undefined)),
        )
        .filter((period) => period !== undefined)
        .filter(isBeregnetPeriode)
        .sort((a, b) => dayjs(b.fom).diff(dayjs(a.fom)))
        .pop();

export const getFørstePeriodeForSkjæringstidspunkt = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: Inntektsforhold,
): Periode | undefined =>
    arbeidsgiver.behandlinger.length
        ? [...arbeidsgiver.behandlinger][0]?.perioder
              .filter((periode) => periode.skjaeringstidspunkt === skjæringstidspunkt)
              .pop()
        : undefined;

export const kanStrekkes = (
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
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
    behandling: Behandling,
): BeregnetPeriodeFragment | undefined =>
    behandling.perioder
        .filter(isBeregnetPeriode)
        .filter(
            (beregnetPeriodeFragment: BeregnetPeriodeFragment) =>
                beregnetPeriodeFragment.skjaeringstidspunkt === skjæringstidspunkt,
        )
        .shift();

const getSisteTomForIkkeGhostsPåSkjæringstidspunktet = (
    skjæringstidspunkt: DateString,
    behandling: Behandling,
): Periode | undefined =>
    behandling.perioder
        .filter((periode) => !isGhostPeriode(periode) && periode.skjaeringstidspunkt === skjæringstidspunkt)
        .shift();

const getOpprinneligVurderingForFørstePeriodeISkjæringstidspunkt = (
    skjæringstidspunkt: DateString,
    behandlinger: Behandling[],
): Vurdering | null => {
    const førsteVurdertePeriodeForSkjæringstidspunktet = getFørsteVurdertePeriodeForSkjæringstidspunktet(
        skjæringstidspunkt,
        behandlinger,
    );

    return førsteVurdertePeriodeForSkjæringstidspunktet?.utbetaling.vurdering ?? null;
};

export const getInntektoverstyringer = (
    period: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
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
        .map((overstyring: Inntektoverstyring) => ({
            id: overstyring.hendelseId,
            type: 'Inntektoverstyring',
            erRevurdering: dayjs(overstyring.timestamp).isAfter(vurdering?.tidsstempel),
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            inntekt: overstyring.inntekt,
        }));
};

export const getInntektoverstyringerForGhost = (
    skjaeringstidspunkt: string,
    arbeidsgiver: Arbeidsgiver,
    person: PersonFragment,
): InntektoverstyringhendelseObject[] => {
    return arbeidsgiver.overstyringer
        .filter(isInntektoverstyring)
        .filter((it) => it.inntekt.skjaeringstidspunkt === skjaeringstidspunkt)
        .map((overstyring: Inntektoverstyring) => ({
            id: overstyring.hendelseId,
            type: 'Inntektoverstyring',
            erRevurdering: !harIngenUtbetaltePerioderFor(person, skjaeringstidspunkt),
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            inntekt: overstyring.inntekt,
        }));
};

export const getArbeidsforholdoverstyringhendelser = (
    period: BeregnetPeriodeFragment | GhostPeriodeFragment,
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
    period: BeregnetPeriodeFragment | GhostPeriodeFragment,
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
    period: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
    inntektsforhold: Inntektsforhold,
    andreInntektsforhold: Inntektsforhold[],
): SykepengegrunnlagskjonnsfastsettinghendelseObject[] =>
    inntektsforhold.overstyringer
        .filter(isSykepengegrunnlagskjønnsfastsetting)
        .filter((it) => it.skjonnsfastsatt.skjaeringstidspunkt === period.skjaeringstidspunkt)
        .map((overstyring: Sykepengegrunnlagskjonnsfastsetting) => ({
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
    period: BeregnetPeriodeFragment,
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

export const getNotathendelser = (period: BeregnetPeriodeFragment | UberegnetPeriodeFragment) => {
    const notater = period.notater.map(toNotat);
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

const byTimestamp = (a: Notat, b: Notat): number => {
    return dayjs(b.opprettet).diff(dayjs(a.opprettet));
};

const byTimestampHistorikkinnslag = (a: Historikkinnslag, b: Historikkinnslag): number => {
    return dayjs(b.timestamp).diff(dayjs(a.timestamp));
};

function isNonEmpty(begrunnelse: string | null): boolean {
    return begrunnelse !== null && begrunnelse !== undefined && begrunnelse !== '';
}
