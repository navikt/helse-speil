import dayjs from 'dayjs';
import { useMemo } from 'react';

import { Dag, Dagoverstyring, Dagtype, Maybe, OverstyrtDag, Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';

const getUtbetalingstabelldagtypeFromOverstyrtDag = (dag: OverstyrtDag): Utbetalingstabelldagtype => {
    switch (dag.type) {
        case Dagtype.Egenmeldingsdag:
            return 'Egenmelding';
        case Dagtype.Feriedag:
            return 'Ferie';
        case Dagtype.Permisjonsdag:
            return 'Permisjon';
        case Dagtype.Sykedag:
            return 'Syk';
        case Dagtype.Arbeidsdag:
            return 'Arbeid';
        case Dagtype.SykedagNav:
            return 'Syk (NAV)';
        case Dagtype.Avvistdag:
            return 'Avslått';
    }
};

const getUtbetalingstabelldagtype = (dag: Dag): Utbetalingstabelldagtype => {
    const erSykedagNav = dag.utbetalingsdagtype === 'ARBEIDSGIVERPERIODEDAG' && dag.utbetalingsinfo !== null;

    switch (dag.utbetalingsdagtype) {
        case Utbetalingsdagtype.Arbeidsdag:
            return 'Arbeid';
        case Utbetalingsdagtype.Navhelgdag:
            return 'SykHelg';
        case Utbetalingsdagtype.Navdag:
            return erSykedagNav ? 'Syk (NAV)' : 'Syk';
        case Utbetalingsdagtype.AvvistDag:
        case Utbetalingsdagtype.ForeldetDag:
            return 'Avslått';
    }
    switch (dag.sykdomsdagtype) {
        case Sykdomsdagtype.Arbeidsdag:
            return dag.utbetalingsdagtype === 'HELGEDAG' ? 'Helg' : 'Arbeid';
        case Sykdomsdagtype.Feriedag:
            return dag.utbetalingsdagtype === 'HELGEDAG' ? 'Feriehelg' : 'Ferie';
        case Sykdomsdagtype.Permisjonsdag:
            return 'Permisjon';
        case Sykdomsdagtype.Arbeidsgiverdag: // Spleis bruker bare "Arbeidsgiverdag" om egenmeldingsdager
            return 'Egenmelding';
        case Sykdomsdagtype.Sykedag:
        case Sykdomsdagtype.ForeldetSykedag:
            return erSykedagNav ? 'Syk (NAV)' : 'Syk';
        case Sykdomsdagtype.SykHelgedag:
            return 'SykHelg';
        case Sykdomsdagtype.FriskHelgedag:
            return 'FriskHelg';
        case Sykdomsdagtype.Avslatt:
            return 'Avslått';
        case Sykdomsdagtype.Ubestemtdag:
        default:
            return dag.utbetalingsdagtype === 'HELGEDAG' ? 'Helg' : 'Ukjent';
    }
};

export const createDagerMap = (
    dager: Array<Dag>,
    totaltAntallDagerIgjen: Maybe<number>,
    antallAGPDagerBruktFørPerioden?: number,
    maksdato?: DateString,
): Map<DateString, UtbetalingstabellDag> => {
    const map = new Map<DateString, UtbetalingstabellDag>();
    let dagerIgjen = totaltAntallDagerIgjen;
    let dagnummerAGP = antallAGPDagerBruktFørPerioden ?? 16;

    for (let i = 0; i < dager.length; i++) {
        const currentDag = dager[i];

        if (typeof dagerIgjen === 'number') {
            dagerIgjen = currentDag.utbetalingsdagtype === 'NAVDAG' ? dagerIgjen - 1 : dagerIgjen;
        }

        let erAGP = currentDag.utbetalingsdagtype === 'ARBEIDSGIVERPERIODEDAG';
        if (
            dagnummerAGP < 16 &&
            ['SYKEDAG', 'SYK_HELGEDAG'].includes(currentDag.sykdomsdagtype) &&
            currentDag.utbetalingsdagtype === Utbetalingsdagtype.UkjentDag
        ) {
            erAGP = true;
            dagnummerAGP++;
        }
        map.set(currentDag.dato, {
            dato: currentDag.dato,
            kilde: currentDag.kilde,
            type: getUtbetalingstabelldagtype(currentDag),
            erAGP: erAGP,
            erAvvist: currentDag.utbetalingsdagtype === 'AVVIST_DAG',
            erForeldet: currentDag.utbetalingsdagtype === 'FORELDET_DAG',
            erMaksdato: typeof maksdato === 'string' && dayjs(maksdato).isSame(currentDag.dato, 'day'),
            grad: currentDag.grad,
            dagerIgjen: typeof dagerIgjen === 'number' ? Math.max(dagerIgjen, 0) : null,
            totalGradering: currentDag.utbetalingsinfo?.totalGrad,
            arbeidsgiverbeløp: currentDag.utbetalingsinfo?.arbeidsgiverbelop,
            personbeløp: currentDag.utbetalingsinfo?.personbelop,
            begrunnelser: currentDag.begrunnelser,
        });
    }

    return map;
};

export const antallSykedagerTilOgMedMaksdato = (dager: Array<Dag>, maksdato?: DateString): number =>
    maksdato
        ? dager.filter((it) => it.utbetalingsdagtype === 'NAVDAG' && dayjs(it.dato).isSameOrBefore(maksdato)).length
        : 0;

type UseTabelldagerMapOptions = {
    tidslinje: Array<Dag>;
    gjenståendeDager?: Maybe<number>;
    overstyringer?: Array<Dagoverstyring>;
    maksdato?: DateString;
    skjæringstidspunkt?: DateString;
    antallAGPDagerBruktFørPerioden?: number;
};

export const useTabelldagerMap = ({
    tidslinje,
    gjenståendeDager,
    overstyringer = [],
    maksdato,
    antallAGPDagerBruktFørPerioden,
}: UseTabelldagerMapOptions): Map<string, UtbetalingstabellDag> =>
    useMemo(() => {
        const antallDagerIgjen: number | null =
            typeof gjenståendeDager === 'number'
                ? gjenståendeDager + antallSykedagerTilOgMedMaksdato(tidslinje, maksdato)
                : null;

        const dager: Map<DateString, UtbetalingstabellDag> = createDagerMap(
            tidslinje,
            antallDagerIgjen,
            antallAGPDagerBruktFørPerioden,
        );

        for (const overstyring of overstyringer) {
            for (const dag of overstyring.dager) {
                const existing = dager.get(dag.dato);
                if (existing) {
                    dager.set(dag.dato, {
                        ...existing,
                        overstyringer: (existing.overstyringer ?? []).concat([
                            {
                                hendelseId: overstyring.hendelseId,
                                begrunnelse: overstyring.begrunnelse,
                                saksbehandler: overstyring.saksbehandler,
                                timestamp: overstyring.timestamp,
                                grad: dag.grad,
                                fraGrad: dag.fraGrad,
                                type: getUtbetalingstabelldagtypeFromOverstyrtDag(dag),
                                dato: dag.dato,
                                ferdigstilt: overstyring.ferdigstilt,
                            },
                        ]),
                    });
                }
            }
        }

        return dager;
    }, [tidslinje, overstyringer, gjenståendeDager, maksdato]);
