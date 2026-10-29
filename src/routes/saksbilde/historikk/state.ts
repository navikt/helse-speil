import dayjs from 'dayjs';
import { atom, useAtom, useAtomValue } from 'jotai';

import {
    ApiAnnullering,
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiNotat,
    ApiSaksbehandlerhandling,
    ApiSaksbildePerson,
    ApiUberegnetPeriode,
} from '@io/rest/generated/spesialist.schemas';
import { useAnnulleringForPeriode } from '@state/annullering';
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
    getSaksbehandlerhandlinger,
    getSykepengegrunnlagskjønnsfastsetting,
    getUtbetalingshendelse,
    getVedtakBegrunnelser,
    tilNotathendelse,
} from './mapping';

const byTimestamp = (a: HendelseObject, b: HendelseObject): number => {
    return dayjs(b.timestamp).diff(dayjs(a.timestamp));
};

const getHendelserForBeregnetPeriode = (
    periode: ApiBeregnetPeriode,
    person: ApiSaksbildePerson,
    notater: ApiNotat[],
    saksbehandlerhandlinger: ApiSaksbehandlerhandling[],
    annullering: ApiAnnullering | null,
): HendelseObject[] => {
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
        ...getSaksbehandlerhandlinger(saksbehandlerhandlinger, periode),
    ].filter(hendelseTidspunktLiktEllerFørUtbetalingForPeriode(periode));

    const hendelserForAlleUtbetalinger = [
        ...tilNotathendelse(notater),
        ...getHistorikkinnslag(periode),
        getUtbetalingshendelse(periode),
        getAnnullering(annullering),
    ].filter((hendelse) => hendelse !== null) as HendelseObject[];

    return [...hendelserTomUtbetalingstidspunkt, ...hendelserForAlleUtbetalinger].sort(byTimestamp);
};

const hendelseTidspunktLiktEllerFørUtbetalingForPeriode = (period: ApiBeregnetPeriode) => (hendelse: HendelseObject) =>
    period.utbetaling.vurdering?.tidsstempel
        ? hendelse.timestamp &&
          dayjs(hendelse.timestamp).startOf('s').isSameOrBefore(period.utbetaling.vurdering.tidsstempel)
        : true;

const getHendelserForGhostPeriode = (periode: ApiGhostPeriode, person: ApiSaksbildePerson): HendelseObject[] => {
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
    periode: ApiUberegnetPeriode,
    person: ApiSaksbildePerson,
    notater: ApiNotat[],
    saksbehandlerhandlinger: ApiSaksbehandlerhandling[],
): HendelseObject[] => {
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
        ...tilNotathendelse(notater),
        ...getSaksbehandlerhandlinger(saksbehandlerhandlinger, periode),
        ...getHistorikkinnslag(periode),
    ].sort(byTimestamp);
};

const useHistorikk = (
    person: ApiSaksbildePerson | null,
    notater: ApiNotat[],
    saksbehandlerhandlinger: ApiSaksbehandlerhandling[],
): HendelseObject[] => {
    const activePeriod = useActivePeriod(person);
    const annullering = useAnnulleringForPeriode(person, activePeriod);
    if (!person || !activePeriod) {
        return [];
    }

    if (isBeregnetPeriode(activePeriod)) {
        return getHendelserForBeregnetPeriode(activePeriod, person, notater, saksbehandlerhandlinger, annullering);
    } else if (isUberegnetPeriode(activePeriod)) {
        return getHendelserForUberegnetPeriode(activePeriod, person, notater, saksbehandlerhandlinger);
    } else if (isGhostPeriode(activePeriod)) {
        return getHendelserForGhostPeriode(activePeriod, person);
    } else {
        return [];
    }
};

const filterState = atom<Filtertype>('Historikk');

const filterMap: Record<Filtertype, Hendelsetype[]> = {
    Historikk: [
        'Dagoverstyring',
        'Arbeidsforholdoverstyring',
        'AnnetArbeidsforholdoverstyring',
        'Inntektoverstyring',
        'Sykepengegrunnlagskjonnsfastsetting',
        'MinimumSykdomsgradoverstyring',
        'Saksbehandlerhandling',
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
        'Saksbehandlerhandling',
    ],
};

const showHistorikkState = atomWithSessionStorage('showHistorikkState', true);

export const useShowHistorikkState = () => useAtom(showHistorikkState);

export const useFilteredHistorikk = (
    person: ApiSaksbildePerson | null,
    notater: ApiNotat[],
    saksbehandlerhandlinger: ApiSaksbehandlerhandling[],
): HendelseObject[] => {
    const filter = useAtomValue(filterState);
    const historikk = useHistorikk(person, notater, saksbehandlerhandlinger);

    return historikk.filter((hendelse) => filterMap[filter].includes(hendelse.type));
};

export const useFilterState = () => useAtom(filterState);

const showHøyremenyState = atomWithSessionStorage('showHøyremenyState', true);

export const useShowHøyremenyState = () => useAtom(showHøyremenyState);
