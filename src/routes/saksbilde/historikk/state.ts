import dayjs from 'dayjs';
import { atom, useAtom, useAtomValue } from 'jotai';

import {
    BeregnetPeriodeFragment,
    Generasjon,
    GhostPeriodeFragment,
    Maybe,
    Overstyring,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { findArbeidsgiverWithGhostPeriode } from '@state/inntektsforhold/arbeidsgiver';
import {
    Inntektsforhold,
    finnAlleInntektsforhold,
    finnGenerasjonerForAktivPeriode,
    finnInntektsforholdForPeriode,
    finnOverstyringerForAktivInntektsforhold,
} from '@state/inntektsforhold/inntektsforhold';
import { atomWithSessionStorage } from '@state/jotai';
import { toNotat } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { Filtertype, HendelseObject, Hendelsetype } from '@typer/historikk';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import {
    getAnnetArbeidsforholdoverstyringhendelser,
    getAnnullering,
    getArbeidsforholdoverstyringhendelser,
    getDagoverstyringer,
    getDagoverstyringerForAUU,
    getDokumenter,
    getHistorikkinnslag,
    getInntektoverstyringer,
    getInntektoverstyringerForGhost,
    getMeldingOmVedtak,
    getMinimumSykdomsgradoverstyring,
    getNotathendelser,
    getSykepengegrunnlagskjønnsfastsetting,
    getUtbetalingshendelse,
    getVedtakBegrunnelser,
} from './mapping';

const byTimestamp = (a: HendelseObject, b: HendelseObject): number => {
    return dayjs(b.timestamp).diff(dayjs(a.timestamp));
};

export interface OverstyringForInntektsforhold {
    navn: string;
    organisasjonsnummer: string;
    overstyringer: Overstyring[];
}

export const tilOverstyringerForInntektsforhold = (inntektsforhold: Inntektsforhold) => ({
    navn: isArbeidsgiver(inntektsforhold) ? inntektsforhold.navn : 'SELVSTENDIG',
    organisasjonsnummer: isArbeidsgiver(inntektsforhold) ? inntektsforhold.organisasjonsnummer : 'SELVSTENDIG',
    overstyringer: inntektsforhold.overstyringer,
});

const getHendelserForBeregnetPeriode = (
    period: BeregnetPeriodeFragment,
    generasjoner: Generasjon[],
    overstyringerForAlleInntektsforhold: OverstyringForInntektsforhold[],
    identifikator?: string,
): Array<HendelseObject> => {
    const alleOverstyringer = overstyringerForAlleInntektsforhold.flatMap((o) => o.overstyringer);

    const hendelserTomUtbetalingstidspunkt = [
        ...getMeldingOmVedtak(period),
        ...getDokumenter(period),
        ...getDagoverstyringer(period, generasjoner, alleOverstyringer),
        ...getInntektoverstyringer(period.skjaeringstidspunkt, generasjoner, alleOverstyringer),
        ...getArbeidsforholdoverstyringhendelser(period, alleOverstyringer),
        ...getAnnetArbeidsforholdoverstyringhendelser(
            period,
            overstyringerForAlleInntektsforhold.filter((o) => o.organisasjonsnummer !== identifikator),
        ),
        ...getSykepengegrunnlagskjønnsfastsetting(period.skjaeringstidspunkt, overstyringerForAlleInntektsforhold),
        ...getMinimumSykdomsgradoverstyring(period, generasjoner, alleOverstyringer),
        ...getVedtakBegrunnelser(period),
    ].filter(hendelseTidspunktLiktEllerFørUtbetalingForPeriode(period));

    const hendelserForAlleUtbetalinger = [
        ...getNotathendelser(period.notater.map(toNotat)),
        ...getHistorikkinnslag(period),
        getUtbetalingshendelse(period),
        getAnnullering(period),
    ].filter((hendelse) => hendelse !== null) as HendelseObject[];

    return [...hendelserTomUtbetalingstidspunkt, ...hendelserForAlleUtbetalinger].sort(byTimestamp);
};

const hendelseTidspunktLiktEllerFørUtbetalingForPeriode =
    (period: BeregnetPeriodeFragment) => (hendelse: HendelseObject) =>
        period.utbetaling.vurdering?.tidsstempel
            ? hendelse.timestamp &&
              dayjs(hendelse.timestamp).startOf('s').isSameOrBefore(period.utbetaling.vurdering.tidsstempel)
            : true;

const getHendelserForGhostPeriode = (period: GhostPeriodeFragment, person: PersonFragment): Array<HendelseObject> => {
    const inntektsforhold = finnAlleInntektsforhold(person);
    const arbeidsgiver = findArbeidsgiverWithGhostPeriode(period, person);
    const arbeidsforholdoverstyringer = getArbeidsforholdoverstyringhendelser(
        period,
        arbeidsgiver?.overstyringer ?? [],
    );
    const overstyringerForInntektsforhold: OverstyringForInntektsforhold[] = inntektsforhold
        .map(tilOverstyringerForInntektsforhold)
        .filter(
            (overstyringForInntektsforhold) =>
                overstyringForInntektsforhold.organisasjonsnummer !== arbeidsgiver?.organisasjonsnummer,
        );

    const annetarbeidsforholdoverstyringer = getAnnetArbeidsforholdoverstyringhendelser(
        period,
        overstyringerForInntektsforhold,
    );
    const inntektoverstyringer = arbeidsgiver
        ? getInntektoverstyringerForGhost(period.skjaeringstidspunkt, arbeidsgiver, person)
        : [];

    return [...arbeidsforholdoverstyringer, ...annetarbeidsforholdoverstyringer, ...inntektoverstyringer].sort(
        byTimestamp,
    );
};

const getHendelserForUberegnetPeriode = (
    period: UberegnetPeriodeFragment,
    overstyringer: Overstyring[],
    generasjoner: Generasjon[],
    overstyringerForAlleInntektsforhold: OverstyringForInntektsforhold[],
): Array<HendelseObject> => {
    return [
        ...getDokumenter(period),
        ...getDagoverstyringerForAUU(period, generasjoner, overstyringer),
        ...getInntektoverstyringer(period.skjaeringstidspunkt, generasjoner, overstyringer),
        ...getSykepengegrunnlagskjønnsfastsetting(period.skjaeringstidspunkt, overstyringerForAlleInntektsforhold),
        ...getNotathendelser(period.notater.map(toNotat)),
    ].sort(byTimestamp);
};

const useHistorikk = (person: Maybe<PersonFragment>): HendelseObject[] => {
    const activePeriod = useActivePeriod(person);
    if (!person || !activePeriod) {
        return [];
    }

    const generasjoner = finnGenerasjonerForAktivPeriode(activePeriod, person);
    const overstyringer = finnOverstyringerForAktivInntektsforhold(activePeriod, person);
    const overstyringerForAlleInntektsforhold = finnOverstyringerForAlleInntektsforhold(person);

    const inntektsforhold = finnInntektsforholdForPeriode(person, activePeriod);

    if (isBeregnetPeriode(activePeriod)) {
        return getHendelserForBeregnetPeriode(
            activePeriod,
            generasjoner,
            overstyringerForAlleInntektsforhold,
            isArbeidsgiver(inntektsforhold) ? inntektsforhold.organisasjonsnummer : undefined,
        );
    }

    if (isUberegnetPeriode(activePeriod)) {
        return getHendelserForUberegnetPeriode(
            activePeriod,
            overstyringer,
            generasjoner,
            overstyringerForAlleInntektsforhold,
        );
    }

    if (isGhostPeriode(activePeriod)) {
        return getHendelserForGhostPeriode(activePeriod, person);
    }

    return [];
};

const finnOverstyringerForAlleInntektsforhold = (person: Maybe<PersonFragment>): OverstyringForInntektsforhold[] =>
    finnAlleInntektsforhold(person).map((inntektsforhold) => ({
        navn: isArbeidsgiver(inntektsforhold) ? inntektsforhold.navn : 'SELVSTENDIG',
        organisasjonsnummer: isArbeidsgiver(inntektsforhold) ? inntektsforhold.organisasjonsnummer : 'SELVSTENDIG',
        overstyringer: inntektsforhold.overstyringer,
    }));

const filterState = atom<Filtertype>('Historikk');

const filterMap: Record<Filtertype, Array<Hendelsetype>> = {
    Historikk: [
        'Dagoverstyring',
        'Arbeidsforholdoverstyring',
        'AnnetArbeidsforholdoverstyring',
        'Inntektoverstyring',
        'Sykepengegrunnlagskjonnsfastsetting',
        'MinimumSykdomsgradoverstyring',
        'Dokument',
        'Utbetaling',
        'Historikk',
        'Notat',
        'VedtakBegrunnelse',
        'Annullering',
    ],
    Dokument: ['Dokument'],
    Notat: ['Notat'],
    Overstyring: [
        'Dagoverstyring',
        'Arbeidsforholdoverstyring',
        'AnnetArbeidsforholdoverstyring',
        'Inntektoverstyring',
        'Sykepengegrunnlagskjonnsfastsetting',
        'MinimumSykdomsgradoverstyring',
    ],
};

const showHistorikkState = atomWithSessionStorage('showHistorikkState', true);

export const useShowHistorikkState = () => useAtom(showHistorikkState);

export const useFilteredHistorikk = (person: Maybe<PersonFragment>): Array<HendelseObject> => {
    const filter = useAtomValue(filterState);
    const historikk = useHistorikk(person);

    return historikk.filter((hendelse) => filterMap[filter].includes(hendelse.type));
};

export const useFilterState = () => useAtom(filterState);

const showHøyremenyState = atomWithSessionStorage('showHøyremenyState', true);

export const useShowHøyremenyState = () => useAtom(showHøyremenyState);
