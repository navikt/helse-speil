import dayjs from 'dayjs';
import { atom, useAtom, useAtomValue } from 'jotai';

import {
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { finnArbeidsgiverForGhostPeriode } from '@state/inntektsforhold/arbeidsgiver';
import { finnAlleInntektsforhold, finnInntektsforholdForPeriode } from '@state/inntektsforhold/inntektsforhold';
import { atomWithSessionStorage } from '@state/jotai';
import { useActivePeriod } from '@state/periode';
import { Filtertype, HendelseObject, Hendelsetype } from '@typer/historikk';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

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

const getHendelserForBeregnetPeriode = (periode: BeregnetPeriodeFragment, person: PersonFragment): HendelseObject[] => {
    const inntektsforhold = finnInntektsforholdForPeriode(person, periode);
    if (!inntektsforhold) {
        return [];
    }

    const andreInntektsforhold = finnAlleInntektsforhold(person).filter((it) => it !== inntektsforhold);

    const hendelserTomUtbetalingstidspunkt = [
        ...getMeldingOmVedtak(periode),
        ...getDokumenter(periode),
        ...getDagoverstyringer(periode, inntektsforhold),
        ...getInntektoverstyringer(periode, inntektsforhold),
        ...getArbeidsforholdoverstyringhendelser(periode, inntektsforhold),
        ...getAnnetArbeidsforholdoverstyringhendelser(periode, andreInntektsforhold),
        ...getSykepengegrunnlagskjønnsfastsetting(periode, inntektsforhold, andreInntektsforhold),
        ...getMinimumSykdomsgradoverstyring(periode, inntektsforhold),
        ...getVedtakBegrunnelser(periode),
    ].filter(hendelseTidspunktLiktEllerFørUtbetalingForPeriode(periode));

    const hendelserForAlleUtbetalinger = [
        ...getNotathendelser(periode),
        ...getHistorikkinnslag(periode),
        getUtbetalingshendelse(periode),
        getAnnullering(periode),
    ].filter((hendelse) => hendelse !== null) as HendelseObject[];

    return [...hendelserTomUtbetalingstidspunkt, ...hendelserForAlleUtbetalinger].sort(byTimestamp);
};

const hendelseTidspunktLiktEllerFørUtbetalingForPeriode =
    (period: BeregnetPeriodeFragment) => (hendelse: HendelseObject) =>
        period.utbetaling.vurdering?.tidsstempel
            ? hendelse.timestamp &&
              dayjs(hendelse.timestamp).startOf('s').isSameOrBefore(period.utbetaling.vurdering.tidsstempel)
            : true;

const getHendelserForGhostPeriode = (periode: GhostPeriodeFragment, person: PersonFragment): Array<HendelseObject> => {
    const arbeidsgiver = finnArbeidsgiverForGhostPeriode(person, periode);
    if (!arbeidsgiver) {
        return [];
    }

    const andreInntektsforhold = finnAlleInntektsforhold(person).filter((it) => it !== arbeidsgiver);

    return [
        ...getArbeidsforholdoverstyringhendelser(periode, arbeidsgiver),
        ...getAnnetArbeidsforholdoverstyringhendelser(periode, andreInntektsforhold),
        ...getInntektoverstyringerForGhost(periode.skjaeringstidspunkt, arbeidsgiver, person),
    ].sort(byTimestamp);
};

const getHendelserForUberegnetPeriode = (
    periode: UberegnetPeriodeFragment,
    person: PersonFragment,
): Array<HendelseObject> => {
    const inntektsforhold = finnInntektsforholdForPeriode(person, periode);
    if (!inntektsforhold) {
        return [];
    }

    const andreInntektsforhold = finnAlleInntektsforhold(person).filter((it) => it !== inntektsforhold);

    return [
        ...getDokumenter(periode),
        ...getDagoverstyringerForAUU(periode, inntektsforhold),
        ...getInntektoverstyringer(periode, inntektsforhold),
        ...getSykepengegrunnlagskjønnsfastsetting(periode, inntektsforhold, andreInntektsforhold),
        ...getNotathendelser(periode),
    ].sort(byTimestamp);
};

const useHistorikk = (person: Maybe<PersonFragment>): HendelseObject[] => {
    const activePeriod = useActivePeriod(person);
    if (!person || !activePeriod) {
        return [];
    }

    if (isBeregnetPeriode(activePeriod)) {
        return getHendelserForBeregnetPeriode(activePeriod, person);
    } else if (isUberegnetPeriode(activePeriod)) {
        return getHendelserForUberegnetPeriode(activePeriod, person);
    } else if (isGhostPeriode(activePeriod)) {
        return getHendelserForGhostPeriode(activePeriod, person);
    } else {
        return [];
    }
};

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
