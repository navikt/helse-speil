import dayjs from 'dayjs';

import {
    Arbeidsgiver,
    GhostPeriode,
    Hendelse,
    Inntektoverstyring,
    Inntektsmelding,
    Periode,
    PeriodehistorikkType,
    SoknadArbeidsgiver,
    SoknadArbeidsledig,
    SoknadFrilans,
    SoknadNav,
    Sykepengegrunnlagskjonnsfastsetting,
    Sykmelding,
    Vurdering,
} from '@io/graphql';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT } from '@utils/date';
import {
    isArbeidsforholdoverstyring,
    isBeregnetPeriode,
    isDagoverstyring,
    isGhostPeriode,
    isInntektoverstyring,
    isSykepengegrunnlagskjønnsfastsetting,
    isUberegnetPeriode,
    isUberegnetVilkarsprovdPeriode,
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

export const getDokumenter = (period: Periode | GhostPeriode): Array<HendelseObject> => {
    if (!isBeregnetPeriode(period) && !isUberegnetPeriode(period) && !isUberegnetVilkarsprovdPeriode(period)) {
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

export const getPeriodehistorikk = (periode: FetchedBeregnetPeriode): Array<HistorikkhendelseObject> => {
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
    period: FetchedBeregnetPeriode,
    arbeidsgiver: Arbeidsgiver,
): string | null => {
    return (
        [...arbeidsgiver.generasjoner]
            ?.reverse()
            ?.flatMap(
                (it) =>
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
    period: FetchedBeregnetPeriode,
    arbeidsgiver: Arbeidsgiver,
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
                ) &&
                dayjs(it.dager[0].dato, ISO_DATOFORMAT).isSameOrBefore(period?.tom),
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
    period: UberegnetPeriode | UberegnetVilkarsprovdPeriode,
    arbeidsgiver: Arbeidsgiver,
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

const periodeErAttestert = (periode: FetchedBeregnetPeriode): boolean => {
    return periode.periodehistorikk.some(
        (historikkelement) => historikkelement.type === PeriodehistorikkType.TotrinnsvurderingAttestert,
    );
};

export const getUtbetalingshendelse = (periode: FetchedBeregnetPeriode): UtbetalinghendelseObject | null => {
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
    arbeidsgiver: Arbeidsgiver,
): FetchedBeregnetPeriode | undefined =>
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
    arbeidsgiver: Maybe<Arbeidsgiver>,
): FetchedBeregnetPeriode | UberegnetPeriode | undefined => {
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
    arbeidsgiver: Arbeidsgiver,
): FetchedBeregnetPeriode | undefined => {
    const sisteGenerasjon = arbeidsgiver.generasjoner[0];
    return sisteGenerasjon.perioder
        .filter(isBeregnetPeriode)
        .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
        .shift();
};

const getSisteTomForIkkeGhostsPåSkjæringstidspunktet = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: Arbeidsgiver,
): Periode | undefined => {
    const sisteGenerasjon = arbeidsgiver.generasjoner[0];
    return sisteGenerasjon.perioder
        .filter((it) => !isGhostPeriode(it))
        .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
        .shift();
};

const getOpprinneligVurderingForFørstePeriodeISkjæringstidspunkt = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: Arbeidsgiver,
): Vurdering | null => {
    const førsteVurdertePeriodeForSkjæringstidspunktet = getFørsteVurdertePeriodeForSkjæringstidspunktet(
        skjæringstidspunkt,
        arbeidsgiver,
    );

    return førsteVurdertePeriodeForSkjæringstidspunktet?.utbetaling.vurdering ?? null;
};

export const getInntektoverstyringer = (
    skjæringstidspunkt: DateString,
    arbeidsgiver: Arbeidsgiver,
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
    arbeidsgiver: Arbeidsgiver,
    person: FetchedPerson,
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
    period: FetchedBeregnetPeriode | GhostPeriode,
    arbeidsgiver: Arbeidsgiver,
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
    period: FetchedBeregnetPeriode | GhostPeriode,
    arbeidsgiver: Maybe<Arbeidsgiver>,
    arbeidsgivere: Array<Arbeidsgiver>,
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
    arbeidsgiver: Arbeidsgiver,
    arbeidsgivere: Array<Arbeidsgiver>,
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
    notater.map((notat: Notat) => ({
        id: notat.id,
        type: 'Notat',
        tekst: notat.tekst,
        notattype: notat.type,
        saksbehandler: notat.saksbehandler.ident ?? notat.saksbehandler.navn,
        saksbehandlerOid: notat.saksbehandler.oid,
        timestamp: notat.opprettet.format(ISO_TIDSPUNKTFORMAT),
        feilregistrert: notat.feilregistrert,
        vedtaksperiodeId: notat.vedtaksperiodeId,
        kommentarer: notat.kommentarer,
        erNyesteNotatMedType: [...notater].sort(byTimestamp).find((it) => it.type === notat.type)?.id === notat.id,
    }));

const byTimestamp = (a: Notat, b: Notat): number => {
    return dayjs(b.opprettet).diff(dayjs(a.opprettet));
};

const getArbeidsgivereÅrsinntekt = (arbeidsgivere: Arbeidsgiver[], hendelseId: string): ArbeidsgiverSkjønnHendelse[] =>
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
