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
    }
};

const getUtbetalingstabelldagtype = (dag: Dag): Utbetalingstabelldagtype => {
    switch (dag.utbetalingsdagtype) {
        case Utbetalingsdagtype.Arbeidsdag:
            return 'Arbeid';
        case Utbetalingsdagtype.Navhelgdag:
        case Utbetalingsdagtype.Helgedag:
            return 'Helg';
        case Utbetalingsdagtype.Navdag:
            return 'Syk';
        case Utbetalingsdagtype.AvvistDag:
            return 'Avslått';
    }
    switch (dag.sykdomsdagtype) {
        case Sykdomsdagtype.Arbeidsdag:
            return 'Arbeid';
        case Sykdomsdagtype.Feriedag:
            return 'Ferie';
        case Sykdomsdagtype.Permisjonsdag:
            return 'Permisjon';
        case Sykdomsdagtype.Arbeidsgiverdag:
        case Sykdomsdagtype.Sykedag:
            return 'Syk';
        case Sykdomsdagtype.SykHelgedag:
        case Sykdomsdagtype.FriskHelgedag:
            return 'Helg';
        case Sykdomsdagtype.Avslatt:
            return 'Avslått';
        case Sykdomsdagtype.Ubestemtdag:
        default:
            return 'Ukjent';
    }
};

export const createDagerMap = (
    dager: Array<Dag>,
    totaltAntallDagerIgjen: Maybe<number>,
    maksdato?: DateString
): Map<DateString, UtbetalingstabellDag> => {
    const map = new Map<DateString, UtbetalingstabellDag>();
    let dagerIgjen = totaltAntallDagerIgjen;

    for (let i = 0; i < dager.length; i++) {
        const currentDag = dager[i];

        if (typeof dagerIgjen === 'number') {
            dagerIgjen = currentDag.utbetalingsdagtype === 'NAVDAG' ? dagerIgjen - 1 : dagerIgjen;
        }

        map.set(currentDag.dato, {
            dato: currentDag.dato,
            kilde: currentDag.kilde,
            type: getUtbetalingstabelldagtype(currentDag),
            erAGP: currentDag.utbetalingsdagtype === 'ARBEIDSGIVERPERIODEDAG',
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
};

export const useTabelldagerMap = ({
    tidslinje,
    gjenståendeDager,
    overstyringer = [],
    maksdato,
}: UseTabelldagerMapOptions): Map<string, UtbetalingstabellDag> =>
    useMemo(() => {
        const antallDagerIgjen: number | null =
            typeof gjenståendeDager === 'number'
                ? gjenståendeDager + antallSykedagerTilOgMedMaksdato(tidslinje, maksdato)
                : null;

        const dager: Map<DateString, UtbetalingstabellDag> = createDagerMap(tidslinje, antallDagerIgjen);

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
