import dayjs from 'dayjs';
import * as R from 'remeda';

import { DateString } from '@typer/shared';
import { Utbetalingstabelldag, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';
import { ISO_DATOFORMAT } from '@utils/date';

const finnDagerIHalen = (dager: Utbetalingstabelldag[], hale: DateString): Utbetalingstabelldag[] => {
    return dager.find((dag) => dag.dato === hale)
        ? dager.reverse().reduce((latest: Utbetalingstabelldag[], periode) => {
              return dayjs(
                  latest[latest.length - 1]?.dato ?? dayjs(hale, ISO_DATOFORMAT).add(1, 'days').format(ISO_DATOFORMAT),
              )
                  .subtract(1, 'days')
                  .format(ISO_DATOFORMAT) === periode.dato || periode.dato === hale
                  ? [...latest, periode]
                  : [...latest];
          }, [])
        : [];
};
const finnDagerISnuten = (dager: Utbetalingstabelldag[], snute: DateString): Utbetalingstabelldag[] => {
    return dager.find((dag) => dag.dato === snute)
        ? dager.reduce((newest: Utbetalingstabelldag[], periode) => {
              return dayjs(
                  newest[newest.length - 1]?.dato ??
                      dayjs(snute, ISO_DATOFORMAT).subtract(1, 'days').format(ISO_DATOFORMAT),
              )
                  .add(1, 'days')
                  .format(ISO_DATOFORMAT) === periode.dato || periode.dato === snute
                  ? [...newest, periode]
                  : [...newest];
          }, [])
        : [];
};

export const arbeidsdagValidering = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    setError: (name: string, message: string) => void,
    erSelvstendig: boolean,
): boolean => {
    const overstyrtTilArbeidsdager = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'Arbeid')
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilArbeidsdager.length === 0) {
        return true;
    }

    const { hale } = getHaleAndSnute(
        alleDager,
        undefined,
        R.last([...Array.from(overstyrteDager.values())])?.dag.speilDagtype,
    );

    const dagerIHalenAvPerioden = finnDagerIHalen(overstyrtTilArbeidsdager, hale);

    const dagerSomKanOverstyresTilArbeidsdag: Utbetalingstabelldag[] = overstyrtTilArbeidsdager.filter(
        (dag) =>
            dag.erAGP ||
            dag.erNyDag ||
            !['Syk', 'SykHelg', 'Ferie'].includes(dag?.fraType ?? '') ||
            dagerIHalenAvPerioden.includes(dag),
    );

    if (dagerSomKanOverstyresTilArbeidsdag.length !== overstyrtTilArbeidsdager.length) {
        if (erSelvstendig) {
            setError(
                'arbeidsdagerKanIkkeOverstyres',
                'Du kan ikke overstyre fra Syk til Arbeid for denne/disse dagen(e). Du kan overstyre til Arbeid i ventetiden eller i slutten av søknadsperioden, eller du kan legge til Arbeidsdager før søknadsperioden',
            );
        } else {
            setError(
                'arbeidsdagerKanIkkeOverstyres',
                'Du kan ikke overstyre Syk eller Ferie til Arbeidsdag. Arbeidsdag kan legges til i forkant av perioden, i slutten av perioden, eller endres i arbeidsgiverperioden',
            );
        }
        return false;
    }
    return true;
};

export const andreYtelserValidering = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    setError: (name: string, message: string) => void,
) => {
    const overstyrtTilAnnenYtelsesdag = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) =>
            [
                'Foreldrepenger',
                'AAP',
                'Dagpenger',
                'Svangerskapspenger',
                'Pleiepenger',
                'Omsorgspenger',
                'Opplæringspenger',
            ].includes(overstyrtDag.dag.speilDagtype),
        )
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilAnnenYtelsesdag.length === 0) {
        return true;
    }

    const { hale, snute } = getHaleAndSnute(
        alleDager,
        R.first([...Array.from(overstyrteDager.values())])?.dag.speilDagtype,
        R.last([...Array.from(overstyrteDager.values())])?.dag.speilDagtype,
    );

    const dagerIHalenAvPerioden = finnDagerIHalen(overstyrtTilAnnenYtelsesdag, hale);
    const dagerISnutenAvPerioden = finnDagerISnuten(overstyrtTilAnnenYtelsesdag, snute);

    const dagerSomKanOverstyresTilAnnenYtelse: Utbetalingstabelldag[] = overstyrtTilAnnenYtelsesdag.filter(
        (dag) => dag.erNyDag || dagerIHalenAvPerioden.includes(dag) || dagerISnutenAvPerioden.includes(dag),
    );

    if (dagerSomKanOverstyresTilAnnenYtelse.length !== overstyrtTilAnnenYtelsesdag.length) {
        setError(
            'kanIkkeOverstyreTilAnnenYtelse',
            'Andre ytelser kan legges til i forkant av perioden, i starten av perioden eller i slutten av perioden',
        );
        return false;
    }
    return true;
};

export const arbeidIkkeGjenopptattValidering = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    setError: (name: string, message: string) => void,
) => {
    const overstyrtTilArbeidIkkeGjenopptatt = Array.from(overstyrteDager.values()).filter(
        (overstyrtDag) =>
            overstyrtDag.dag.speilDagtype === 'ArbeidIkkeGjenopptatt' && overstyrtDag.kilde.type !== 'SAKSBEHANDLER',
    );
    if (overstyrtTilArbeidIkkeGjenopptatt.length > 0) {
        setError(
            'kanIkkeOverstyreTilArbeidIkkeGjenopptatt',
            'Du kan ikke overstyre til arbeid ikke gjenopptatt. Du kan bare overstyre til arbeid ikke gjenopptatt på dager som allerede er overstyrt av saksbehandler eller så kan arbeid ikke gjenopptatt legges til som en ny dag i starten av perioden.',
        );
        return false;
    }
    return true;
};

export const sykNavValidering = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    setError: (name: string, message: string) => void,
): boolean => {
    const overstyrtTilSykNav = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'SykNav')
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilSykNav.length === 0) {
        return true;
    }

    const dagerSomKanOverstyresTilSykNav: Utbetalingstabelldag[] = overstyrtTilSykNav.filter(
        (dag) => dag.erAGP || dag.erNyDag,
    );

    if (dagerSomKanOverstyresTilSykNav.length !== overstyrtTilSykNav.length) {
        setError(
            'kanIkkeOverstyreTilSykNav',
            'Syk (NAV) kan kun overstyres i arbeidsgiverperioden eller legges til som en ny dag.',
        );
        return false;
    }
    return true;
};
export const egenmeldingValidering = (
    overstyrteDager: Map<string, Utbetalingstabelldag>,
    alleDager: Map<string, Utbetalingstabelldag>,
    setError: (name: string, message: string) => void,
): boolean => {
    const overstyrtTilEgenmelding = Array.from(overstyrteDager.values())
        .filter((overstyrtDag) => overstyrtDag.dag.speilDagtype === 'Egenmelding')
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilEgenmelding.length === 0) {
        return true;
    }

    const førsteDagMedAgp = Array.from(alleDager.values())
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)))
        .find((dag) => dag.erAGP && dag.dag.speilDagtype === 'Syk')?.dato;

    const dagerSomKanOverstyresTilEgenmelding: Utbetalingstabelldag[] = overstyrtTilEgenmelding.filter((dag) => {
        return dag.erAGP || dag.erNyDag || dayjs(dag.dato).isBefore(førsteDagMedAgp ?? null);
    });

    if (dagerSomKanOverstyresTilEgenmelding.length !== overstyrtTilEgenmelding.length) {
        setError(
            'kanIkkeOverstyreTilEgenmelding',
            'Egenmelding kan kun overstyres i eller før arbeidsgiverperioden eller legges til som en ny dag.',
        );
        return false;
    }
    return true;
};

type SnuteAndHale = {
    snute: DateString;
    hale: DateString;
};

const getHaleAndSnute = (
    alleDager: Map<string, Utbetalingstabelldag>,
    førsteOverstyrteDagtype?: Utbetalingstabelldagtype,
    sisteOverstyrteDagtype?: Utbetalingstabelldagtype,
): SnuteAndHale => {
    // TODO: ikke sjekk mot visningstekst
    const snute = førsteOverstyrteDagtype
        ? (R.first([...Array.from(alleDager.values())].filter((it) => it.dag.visningstekst !== førsteOverstyrteDagtype))
              ?.dato ?? '')
        : '';
    const hale = sisteOverstyrteDagtype
        ? (R.last([...Array.from(alleDager.values())].filter((it) => it.dag.visningstekst !== sisteOverstyrteDagtype))
              ?.dato ?? '')
        : '';

    return { snute, hale };
};
