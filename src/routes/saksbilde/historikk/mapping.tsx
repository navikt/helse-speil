import dayjs from 'dayjs';

import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Hendelse,
    Inntektoverstyring,
    Inntektsmelding,
    Maybe,
    NotatType,
    Periode,
    PeriodehistorikkType,
    PersonFragment,
    SoknadArbeidsgiver,
    SoknadArbeidsledig,
    SoknadFrilans,
    SoknadNav,
    Sykepengegrunnlagskjonnsfastsetting,
    Sykmelding,
    UberegnetPeriodeFragment,
    Vurdering,
} from '@io/graphql';
import {
    AnnetArbeidsforholdoverstyringhendelseObject,
    ArbeidsforholdoverstyringhendelseObject,
    ArbeidsgiverSkjønnHendelse,
    AvslaghendelseObject,
    HendelseObject,
    HistorikkhendelseObject,
    InntektoverstyringhendelseObject,
    NotathendelseObject,
    SykepengegrunnlagskjonnsfastsettinghendelseObject,
    UtbetalinghendelseObject,
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
    isSykepengegrunnlagskjønnsfastsetting,
    isUberegnetPeriode,
} from '@utils/typeguards';

import { harIngenUtbetaltePerioderFor } from '../sykepengegrunnlag/inntekt/inntektOgRefusjonUtils';

const isInntektsmelding = (hendelse: Hendelse): hendelse is Inntektsmelding => {
    return hendelse.type === 'INNTEKTSMELDING';
};

const isSykmelding = (hendelse: Hendelse): hendelse is Sykmelding => {
    return hendelse.type === 'NY_SOKNAD';
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

const isDokument = (
    hendelse: Hendelse,
): hendelse is Inntektsmelding | Sykmelding | SoknadNav | SoknadArbeidsgiver | SoknadArbeidsledig | SoknadFrilans => {
    return (
        isInntektsmelding(hendelse) ||
        isSykmelding(hendelse) ||
        isSøknadNav(hendelse) ||
        isSøknadArbeidsgiver(hendelse) ||
        isSøknadArbeidsledig(hendelse) ||
        isSøknadFrilans(hendelse)
    );
};

export const getDokumenter = (period: Periode | GhostPeriodeFragment): Array<HendelseObject> => {
    if (!isBeregnetPeriode(period) && !isUberegnetPeriode(period)) {
        return [];
    }

    return period.hendelser.filter(isDokument).map((hendelse) => {
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
};

export const getMeldingOmVedtak = (period: Periode): Array<HendelseObject> =>
    isBeregnetPeriode(period) && period.utbetaling.vurdering?.godkjent
        ? [
              {
                  id: period.utbetaling.id,
                  type: 'Dokument',
                  dokumenttype: 'Vedtak',
                  timestamp: period.utbetaling.vurdering.tidsstempel,
                  dokumentId: period.utbetaling.id,
              },
          ]
        : [];

export const getAvslag = (period: Periode): Array<AvslaghendelseObject> => {
    if (!isBeregnetPeriode(period)) {
        return [];
    }

    return period.avslag.map((avslag, index) => {
        return {
            id: `avslag-${index}`,
            type: 'Avslag',
            avslagstype: avslag.type,
            begrunnelse: avslag.begrunnelse,
            saksbehandler: avslag.saksbehandlerIdent,
            timestamp: avslag.opprettet,
        };
    });
};

export const getPeriodehistorikk = (periode: BeregnetPeriodeFragment): Array<HistorikkhendelseObject> => {
    return periode.periodehistorikk
        .filter((historikkelement) =>
            historikkelement.type === PeriodehistorikkType.TotrinnsvurderingRetur ? !historikkelement.notat_id : true,
        )
        .map((historikkelement, index) => ({
            id: `periodehistorikk-${index}`,
            type: 'Historikk',
            historikktype: historikkelement.type,
            saksbehandler: historikkelement.saksbehandler_ident,
            timestamp: historikkelement.timestamp as DateString,
        }));
};

const getTidligsteVurderingstidsstempelForPeriode = (
    period: BeregnetPeriodeFragment,
    arbeidsgiver: ArbeidsgiverFragment,
): Maybe<string> => {
    return (
        [...arbeidsgiver.generasjoner]
            ?.reverse()
            ?.flatMap((it) =>
                it?.perioder
                    .filter(isBeregnetPeriode)
                    .find(
                        (periode) =>
                            periode.vedtaksperiodeId === period.vedtaksperiodeId &&
                            periode.utbetaling.vurdering?.godkjent,
                    ),
            )
            ?.filter(isBeregnetPeriode)
            ?.shift()?.utbetaling.vurdering?.tidsstempel ?? null
    );
};

export const getDagoverstyringer = (
    period: BeregnetPeriodeFragment,
    arbeidsgiver: ArbeidsgiverFragment,
): Array<HendelseObject> => {
    const vurderingstidsstempel = getTidligsteVurderingstidsstempelForPeriode(period, arbeidsgiver);
    const førsteVurdertePeriodeForArbeidsgiver = getFørsteVurdertePeriodeForSkjæringstidspunktet(
        period.skjaeringstidspunkt,
        arbeidsgiver,
    );
    const sisteVurdertePeriodeForArbeidsgiverISkjæringstidspunktet = getSisteVurdertePeriodeForSkjæringstidspunktet(
        period.skjaeringstidspunkt,
        arbeidsgiver,
    );

    return arbeidsgiver.overstyringer
        .filter(isDagoverstyring)
        .filter(
            (it) =>
                dayjs(it.dager[0].dato, ISO_DATOFORMAT).isSameOrAfter(førsteVurdertePeriodeForArbeidsgiver?.fom) &&
                dayjs(it.dager[0].dato, ISO_DATOFORMAT).isSameOrBefore(
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
    arbeidsgiver: ArbeidsgiverFragment,
): Array<HendelseObject> => {
    const sisteTomForIkkeGhostsPåSkjæringstidspunktet = getSisteTomForIkkeGhostsPåSkjæringstidspunktet(
        period.skjaeringstidspunkt,
        arbeidsgiver,
    );

    return arbeidsgiver.overstyringer
        .filter(isDagoverstyring)
        .filter(
            (it) =>
                dayjs(it.dager[0].dato, ISO_DATOFORMAT).isSameOrAfter(period?.fom) &&
                dayjs(it.dager[0].dato, ISO_DATOFORMAT).isSameOrBefore(
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
    return periode.periodehistorikk.some(
        (historikkelement) => historikkelement.type === PeriodehistorikkType.TotrinnsvurderingAttestert,
    );
};

export const getUtbetalingshendelse = (periode: BeregnetPeriodeFragment): Maybe<UtbetalinghendelseObject> => {
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
    arbeidsgiver: ArbeidsgiverFragment,
): BeregnetPeriodeFragment | undefined =>
    [...arbeidsgiver.generasjoner]
        .flatMap<Periode | undefined>((generasjon) =>
            generasjon.perioder.flatMap((p) => (p.skjaeringstidspunkt === skjæringstidspunkt ? p : undefined)),
        )
        .filter((period) => period !== undefined)
        .filter(isBeregnetPeriode)
        .sort((a, b) => dayjs(b.fom).diff(dayjs(a.fom)))
        .pop();

export const getFørstePeriodeForSkjæringstidspunkt = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: Maybe<ArbeidsgiverFragment>,
): BeregnetPeriodeFragment | UberegnetPeriodeFragment | undefined => {
    if (!arbeidsgiver) return undefined;

    return [...arbeidsgiver.generasjoner]
        .flatMap<Periode | undefined>((generasjon) =>
            generasjon.perioder.flatMap((p) => (p.skjaeringstidspunkt === skjæringstidspunkt ? p : undefined)),
        )
        .filter((periode) => periode !== undefined)
        .filter(isBeregnetPeriode || isUberegnetPeriode)
        .pop();
};

const getSisteVurdertePeriodeForSkjæringstidspunktet = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: ArbeidsgiverFragment,
): BeregnetPeriodeFragment | undefined => {
    const sisteGenerasjon = arbeidsgiver.generasjoner[0];
    return sisteGenerasjon.perioder
        .filter(isBeregnetPeriode)
        .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
        .shift();
};

const getSisteTomForIkkeGhostsPåSkjæringstidspunktet = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: ArbeidsgiverFragment,
): Periode | undefined => {
    const sisteGenerasjon = arbeidsgiver.generasjoner[0];
    return sisteGenerasjon.perioder
        .filter((it) => !isGhostPeriode(it))
        .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
        .shift();
};

const getOpprinneligVurderingForFørstePeriodeISkjæringstidspunkt = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: ArbeidsgiverFragment,
): Maybe<Vurdering> => {
    const førsteVurdertePeriodeForSkjæringstidspunktet = getFørsteVurdertePeriodeForSkjæringstidspunktet(
        skjæringstidspunkt,
        arbeidsgiver,
    );

    return førsteVurdertePeriodeForSkjæringstidspunktet?.utbetaling.vurdering ?? null;
};

export const getInntektoverstyringer = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: ArbeidsgiverFragment,
): Array<InntektoverstyringhendelseObject> => {
    const vurdering = getOpprinneligVurderingForFørstePeriodeISkjæringstidspunkt(skjæringstidspunkt, arbeidsgiver);

    return arbeidsgiver.overstyringer
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
    arbeidsgiver: ArbeidsgiverFragment,
    person: PersonFragment,
): Array<InntektoverstyringhendelseObject> => {
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
    arbeidsgiver: ArbeidsgiverFragment,
): Array<ArbeidsforholdoverstyringhendelseObject> => {
    return arbeidsgiver.overstyringer
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
    arbeidsgiver: Maybe<ArbeidsgiverFragment>,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Array<AnnetArbeidsforholdoverstyringhendelseObject> => {
    return arbeidsgivere
        .filter((it) => it.organisasjonsnummer !== arbeidsgiver?.organisasjonsnummer)
        .reduce<Array<AnnetArbeidsforholdoverstyringhendelseObject>>(
            (output, { navn, overstyringer }) =>
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
                            navn: navn,
                        })),
                ),
            [] as AnnetArbeidsforholdoverstyringhendelseObject[],
        );
};

export const getSykepengegrunnlagskjønnsfastsetting = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: ArbeidsgiverFragment,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Array<SykepengegrunnlagskjonnsfastsettinghendelseObject> =>
    arbeidsgiver.overstyringer
        .filter(isSykepengegrunnlagskjønnsfastsetting)
        .filter((it) => it.skjonnsfastsatt.skjaeringstidspunkt === skjæringstidspunkt)
        .map((overstyring: Sykepengegrunnlagskjonnsfastsetting) => ({
            id: overstyring.hendelseId,
            type: 'Sykepengegrunnlagskjonnsfastsetting',
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            skjønnsfastsatt: overstyring.skjonnsfastsatt,
            arbeidsgivere: getArbeidsgivereÅrsinntekt(arbeidsgivere, overstyring.hendelseId),
        }));

export const getNotathendelser = (notater: Array<Notat>): Array<NotathendelseObject> =>
    notater.map(
        (notat: Notat) =>
            ({
                id: notat.id,
                type: 'Notat',
                tekst: notat.tekst,
                notattype: notat.type as NotatType,
                saksbehandler: notat.saksbehandler.ident ?? notat.saksbehandler.navn,
                saksbehandlerOid: notat.saksbehandler.oid,
                timestamp: notat.opprettet.format(ISO_TIDSPUNKTFORMAT),
                feilregistrert: notat.feilregistrert,
                vedtaksperiodeId: notat.vedtaksperiodeId,
                kommentarer: notat.kommentarer,
                erNyesteNotatMedType:
                    [...notater].sort(byTimestamp).find((it) => it.type === notat.type)?.id === notat.id,
            }) satisfies NotathendelseObject,
    );

const byTimestamp = (a: Notat, b: Notat): number => {
    return dayjs(b.opprettet).diff(dayjs(a.opprettet));
};

const getArbeidsgivereÅrsinntekt = (
    arbeidsgivere: ArbeidsgiverFragment[],
    hendelseId: string,
): ArbeidsgiverSkjønnHendelse[] =>
    arbeidsgivere.reduce((liste: ArbeidsgiverSkjønnHendelse[], ag) => {
        const skjønnsfastsatt = ag.overstyringer
            .filter(isSykepengegrunnlagskjønnsfastsetting)
            .filter((it) => it.hendelseId === hendelseId)
            ?.shift()?.skjonnsfastsatt;

        if (skjønnsfastsatt !== undefined) {
            liste.push({
                navn: ag.navn,
                årlig: skjønnsfastsatt?.arlig ?? 0,
                fraÅrlig: skjønnsfastsatt?.fraArlig ?? 0,
            });
        }
        return liste;
    }, []);
