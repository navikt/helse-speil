import dayjs from 'dayjs';
import React from 'react';

import {
    Arbeidsgiver,
    GhostPeriode,
    Hendelse,
    Inntektoverstyring,
    Inntektsmelding,
    Periode,
    PeriodehistorikkType,
    SoknadArbeidsgiver,
    SoknadNav,
    Sykmelding,
    Vurdering,
} from '@io/graphql';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT } from '@utils/date';
import {
    isArbeidsforholdoverstyring,
    isBeregnetPeriode,
    isDagoverstyring,
    isInntektoverstyring,
} from '@utils/typeguards';

import { harIngenUtbetaltePerioderFor } from '../sykepengegrunnlag/inntekt/InntektUtenSykefravær';

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

const isDokument = (hendelse: Hendelse): hendelse is Inntektsmelding | Sykmelding | SoknadNav => {
    return (
        isInntektsmelding(hendelse) || isSykmelding(hendelse) || isSøknadNav(hendelse) || isSøknadArbeidsgiver(hendelse)
    );
};

export const getDokumenter = (period: Periode | GhostPeriode): Array<HendelseObject> => {
    if (!isBeregnetPeriode(period)) {
        return [];
    }

    return period.hendelser.filter(isDokument).map((hendelse) => {
        if (isInntektsmelding(hendelse)) {
            return {
                id: hendelse.id,
                type: 'Dokument',
                dokumenttype: 'Inntektsmelding',
                timestamp: hendelse.mottattDato,
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
            };
        }
    });
};

export const getPeriodehistorikk = (periode: FetchedBeregnetPeriode): Array<HistorikkhendelseObject> => {
    return periode.periodehistorikk
        .filter((historikkelement) => historikkelement.type !== PeriodehistorikkType.TotrinnsvurderingRetur)
        .map((historikkelement, index) => ({
            id: `periodehistorikk-${index}`,
            type: 'Historikk',
            historikktype: historikkelement.type,
            saksbehandler: historikkelement.saksbehandler_ident,
            timestamp: historikkelement.timestamp as DateString,
        }));
};

const getVurderingstidsstempelForTilsvarendePeriodeIFørsteGenerasjon = (
    period: FetchedBeregnetPeriode,
    arbeidsgiver: Arbeidsgiver
): string | null => {
    return (
        arbeidsgiver.generasjoner[arbeidsgiver.generasjoner.length - 1].perioder
            .filter(isBeregnetPeriode)
            .find((it) => it.vedtaksperiodeId === period.vedtaksperiodeId && it.utbetaling.vurdering?.godkjent)
            ?.utbetaling.vurdering?.tidsstempel ?? null
    );
};

export const getDagoverstyringer = (
    period: FetchedBeregnetPeriode,
    arbeidsgiver: Arbeidsgiver
): Array<HendelseObject> => {
    const vurderingstidsstempel = getVurderingstidsstempelForTilsvarendePeriodeIFørsteGenerasjon(period, arbeidsgiver);
    const førsteVurdertePeriodeForArbeidsgiver = getFørsteVurdertePeriodeForSkjæringstidspunktet(period, arbeidsgiver);
    const sisteVurdertePeriodeForArbeidsgiverISkjæringstidspunktet = getSisteVurdertePeriodeForSkjæringstidspunktet(
        period,
        arbeidsgiver
    );

    return arbeidsgiver.overstyringer
        .filter(isDagoverstyring)
        .filter(
            (it) =>
                dayjs(it.dager[0].dato, ISO_DATOFORMAT).isSameOrAfter(førsteVurdertePeriodeForArbeidsgiver?.fom) &&
                dayjs(it.dager[0].dato, ISO_DATOFORMAT).isSameOrBefore(
                    sisteVurdertePeriodeForArbeidsgiverISkjæringstidspunktet?.tom
                )
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

const periodeErAttestert = (periode: FetchedBeregnetPeriode): boolean => {
    return periode.periodehistorikk.some(
        (historikkelement) => historikkelement.type === PeriodehistorikkType.TotrinnsvurderingAttestert
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
    period: FetchedBeregnetPeriode,
    arbeidsgiver: Arbeidsgiver
): FetchedBeregnetPeriode | undefined => {
    const førsteGenerasjon = arbeidsgiver.generasjoner[arbeidsgiver.generasjoner.length - 1];
    return førsteGenerasjon.perioder
        .filter(isBeregnetPeriode)
        .filter((it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt)
        .pop();
};

const getSisteVurdertePeriodeForSkjæringstidspunktet = (
    period: FetchedBeregnetPeriode,
    arbeidsgiver: Arbeidsgiver
): FetchedBeregnetPeriode | undefined => {
    const sisteGenerasjon = arbeidsgiver.generasjoner[0];
    return sisteGenerasjon.perioder
        .filter(isBeregnetPeriode)
        .filter((it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt)
        .shift();
};

const getOpprinneligVurderingForFørstePeriodeISkjæringstidspunkt = (
    period: FetchedBeregnetPeriode,
    arbeidsgiver: Arbeidsgiver
): Vurdering | null => {
    const førsteVurdertePeriodeForSkjæringstidspunktet = getFørsteVurdertePeriodeForSkjæringstidspunktet(
        period,
        arbeidsgiver
    );

    return førsteVurdertePeriodeForSkjæringstidspunktet?.utbetaling.vurdering ?? null;
};

export const getInntektoverstyringer = (
    period: FetchedBeregnetPeriode,
    arbeidsgiver: Arbeidsgiver
): Array<InntektoverstyringhendelseObject> => {
    const vurdering = getOpprinneligVurderingForFørstePeriodeISkjæringstidspunkt(period, arbeidsgiver);

    return arbeidsgiver.overstyringer
        .filter(isInntektoverstyring)
        .filter((it) => it.inntekt.skjaeringstidspunkt === period.skjaeringstidspunkt)
        .map((overstyring: Inntektoverstyring) => ({
            id: overstyring.hendelseId,
            type: 'Inntektoverstyring',
            erRevurdering: dayjs(overstyring.timestamp).isAfter(vurdering?.tidsstempel),
            saksbehandler: overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn,
            timestamp: overstyring.timestamp,
            begrunnelse: overstyring.begrunnelse,
            inntekt: overstyring.inntekt,
        }));
};

export const getInntektoverstyringerForGhost = (
    skjaeringstidspunkt: string,
    arbeidsgiver: Arbeidsgiver,
    person: FetchedPerson
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
            begrunnelse: overstyring.begrunnelse,
            inntekt: overstyring.inntekt,
        }));
};

export const getArbeidsforholdoverstyringhendelser = (
    period: FetchedBeregnetPeriode | GhostPeriode,
    arbeidsgiver: Arbeidsgiver
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
    }));
