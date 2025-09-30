import dayjs from 'dayjs';
import { atom, useAtom, useAtomValue } from 'jotai';

import {
    BeregnetPeriodeFragment,
    Generasjon,
    GhostPeriodeFragment,
    Maybe,
    Overstyring,
    OverstyringFragment,
    PersonFragment,
    SelvstendigNaering,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import {
    findArbeidsgiverWithGhostPeriode,
    findArbeidsgiverWithPeriode,
    findSelvstendigWithPeriode,
} from '@state/arbeidsgiver';
import { atomWithSessionStorage } from '@state/jotai';
import { toNotat } from '@state/notater';
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

export interface OverstyringForInntektsforhold {
    navn: string;
    organisasjonsnummer: string;
    overstyringer: OverstyringFragment[];
}

const getHendelserForBeregnetPeriode = (
    period: BeregnetPeriodeFragment,
    generasjoner: Generasjon[],
    overstyringerForAlleInntektsforhold: OverstyringForInntektsforhold[],
    identifikator?: string,
): Array<HendelseObject> => {
    console.log(period);
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
    const arbeidsgiver = findArbeidsgiverWithGhostPeriode(period, person.arbeidsgivere);
    const arbeidsforholdoverstyringer = getArbeidsforholdoverstyringhendelser(
        period,
        arbeidsgiver?.overstyringer ?? [],
    );
    const annetarbeidsforholdoverstyringer = getAnnetArbeidsforholdoverstyringhendelser(
        period,
        person.arbeidsgivere.filter(
            (_arbeidsgiver) => _arbeidsgiver.organisasjonsnummer !== arbeidsgiver?.organisasjonsnummer,
        ),
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

    const _arbeidsgiver = findArbeidsgiverWithPeriode(activePeriod, person.arbeidsgivere);
    // Ignorer selvstendig næring fra arbeidsgiverlisten når vi tar i bruk selvstendig feltet på person. Dette for å unngå duplikater.
    const arbeidsgiver = _arbeidsgiver?.organisasjonsnummer !== 'SELVSTENDIG' ? _arbeidsgiver : null;
    const selvstendig: SelvstendigNaering | null = findSelvstendigWithPeriode(activePeriod, person.selvstendigNaering);

    const overstyringer = [...(arbeidsgiver?.overstyringer ?? []), ...(selvstendig?.overstyringer ?? [])];
    const generasjoner = [...(arbeidsgiver?.generasjoner ?? []), ...(selvstendig?.generasjoner ?? [])];

    const overstyringerForAlleInntektsforhold: OverstyringForInntektsforhold[] = [
        ...person.arbeidsgivere
            // Ignorer selvstendig næring fra arbeidsgiverlisten når vi tar i bruk selvstendig feltet på person. Dette for å unngå duplikater.
            .filter((arbeidsgiver) => arbeidsgiver.organisasjonsnummer !== 'SELVSTENDIG')
            .map((arbeidsgiver) => ({
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                overstyringer: arbeidsgiver.overstyringer,
            })),
        {
            navn: 'SELVSTENDIG',
            organisasjonsnummer: 'SELVSTENDIG',
            overstyringer: person.selvstendigNaering?.overstyringer ?? [],
        },
    ];

    if (isBeregnetPeriode(activePeriod)) {
        return getHendelserForBeregnetPeriode(
            activePeriod,
            generasjoner,
            overstyringerForAlleInntektsforhold,
            arbeidsgiver?.organisasjonsnummer,
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
