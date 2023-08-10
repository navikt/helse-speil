import dayjs from 'dayjs';

import { ISO_DATOFORMAT } from '@utils/date';

const finnDagerIHalen = (dager: UtbetalingstabellDag[], hale: DateString): UtbetalingstabellDag[] => {
    return dager.find((dag) => dag.dato === hale)
        ? dager.reverse().reduce((latest: UtbetalingstabellDag[], periode) => {
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
const finnDagerISnuten = (dager: UtbetalingstabellDag[], snute: DateString): UtbetalingstabellDag[] => {
    return dager.find((dag) => dag.dato === snute)
        ? dager.reduce((newest: UtbetalingstabellDag[], periode) => {
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
    overstyrteDager: Map<string, UtbetalingstabellDag>,
    hale: DateString,
    setError: (name: string, message: string) => void,
): boolean => {
    const overstyrtTilArbeidsdager = Array.from(overstyrteDager.values())
        .filter((dag) => dag.type === 'Arbeid')
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilArbeidsdager.length === 0) {
        return true;
    }

    const dagerIHalenAvPerioden = finnDagerIHalen(overstyrtTilArbeidsdager, hale);

    const dagerSomKanOverstyresTilArbeidsdag: UtbetalingstabellDag[] = overstyrtTilArbeidsdager.filter(
        (dag) =>
            dag.erAGP ||
            dag.erNyDag ||
            !['Syk', 'SykHelg', 'Ferie'].includes(dag?.fraType ?? '') ||
            dagerIHalenAvPerioden.includes(dag),
    );

    if (dagerSomKanOverstyresTilArbeidsdag.length !== overstyrtTilArbeidsdager.length) {
        setError(
            'arbeidsdagerKanIkkeOverstyres',
            'Du kan ikke overstyre Syk eller Ferie til Arbeidsdag. Arbeidsdag kan legges til i forkant av perioden, i slutten av perioden, eller endres i arbeidsgiverperioden',
        );
        return false;
    }
    return true;
};

export const andreYtelserValidering = (
    overstyrteDager: Map<string, UtbetalingstabellDag>,
    hale: DateString,
    snute: DateString,
    setError: (name: string, message: string) => void,
) => {
    const overstyrtTilAnnenYtelsesdag = Array.from(overstyrteDager.values())
        .filter((dag) =>
            [
                'Foreldrepenger',
                'AAP',
                'Dagpenger',
                'Svangerskapspenger',
                'Pleiepenger',
                'Omsorgspenger',
                'Opplæringspenger',
            ].includes(dag.type),
        )
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilAnnenYtelsesdag.length === 0) {
        return true;
    }

    const dagerIHalenAvPerioden = finnDagerIHalen(overstyrtTilAnnenYtelsesdag, hale);
    const dagerISnutenAvPerioden = finnDagerISnuten(overstyrtTilAnnenYtelsesdag, snute);

    const dagerSomKanOverstyresTilAnnenYtelse: UtbetalingstabellDag[] = overstyrtTilAnnenYtelsesdag.filter(
        (dag) => dag.erNyDag || dagerIHalenAvPerioden.includes(dag) || dagerISnutenAvPerioden.includes(dag),
    );

    if (dagerSomKanOverstyresTilAnnenYtelse.length !== overstyrtTilAnnenYtelsesdag.length) {
        setError(
            'kanIkkeOverstyreTilAnnenYtelse',
            'Andre ytelser kan legges til i forkant av eller i starten av perioden',
        );
        return false;
    }
    return true;
};

export const ferieUtenSykmeldingValidering = (
    overstyrteDager: Map<string, UtbetalingstabellDag>,
    setError: (name: string, message: string) => void,
) => {
    const overstyrtTilFerieUtenSykmelding = Array.from(overstyrteDager.values()).filter(
        (dag) => dag.type === 'Ferie uten sykmelding' && dag.kilde.type !== 'SAKSBEHANDLER',
    );
    if (overstyrtTilFerieUtenSykmelding.length > 0) {
        setError(
            'kanIkkeOverstyreTilFerieUtenSykmelding',
            'Du kan ikke overstyre til ferie uten sykmelding. Du kan bare overstyre til ferie uten sykmelding på dager som allerede er overstyrt av saksbehandler eller så kan ferie uten sykmelding legges til som en ny dag i starten av perioden.',
        );
        return false;
    }
    return true;
};

export const sykNavValidering = (
    overstyrteDager: Map<string, UtbetalingstabellDag>,
    setError: (name: string, message: string) => void,
): boolean => {
    const overstyrtTilSykNav = Array.from(overstyrteDager.values())
        .filter((dag) => dag.type === 'Syk (NAV)')
        .sort((a, b) => dayjs(a.dato).diff(dayjs(b.dato)));

    if (overstyrtTilSykNav.length === 0) {
        return true;
    }

    const dagerSomKanOverstyresTilSykNav: UtbetalingstabellDag[] = overstyrtTilSykNav.filter(
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
