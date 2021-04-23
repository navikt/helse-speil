import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import Element from 'nav-frontend-typografi/lib/element';
import classNames from 'classnames';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { Dagtype, Periode, Utbetalingsdag } from 'internal-types';
import { dato, gradering, ikon, merknad, totalGradering, type, utbetaling } from '../../../components/tabell/rader';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { toKronerOgØre } from '../../../utils/locale';
import { Dayjs } from 'dayjs';

type Utbetalingsceller = [
    ReactNode,
    ReactNode,
    ReactNode,
    ReactNode,
    ReactNode,
    ReactNode,
    ReactNode,
    ReactNode,
    ReactNode,
    ReactNode
];

type Utbetalingstabellrad = {
    celler: Utbetalingsceller;
    className: string;
};

const Utbetalingstabell = styled(Tabell)`
    thead tr th {
        vertical-align: top;
        box-sizing: border-box;
        padding-top: 0;
    }

    tbody tr td:not(:nth-of-type(3)):not(:first-of-type) {
        padding-right: 3rem;
    }

    thead tr th,
    tbody tr:first-of-type td {
        border-bottom: 1px solid var(--navds-color-text-primary);
    }
`;

const utbetalingsceller = (
    dag: Utbetalingsdag,
    dagerIgjenForDato: number | string,
    merknadTekst?: string
): Utbetalingsceller => [
    undefined,
    dato(dag),
    ikon(dag),
    type(dag),
    gradering(dag),
    totalGradering(dag),
    undefined,
    utbetaling(dag),
    dagerIgjenForDato,
    merknad(dag, merknadTekst),
];

const maksdatorad = (dag: Utbetalingsdag, dagerIgjenForDato: number | string): Utbetalingstabellrad => ({
    celler: utbetalingsceller(dag, dagerIgjenForDato, 'Siste utbetalingsdag for sykepenger'),
    className: '',
});

const avvistRad = (dag: Utbetalingsdag, dagerIgjenForDato: number | string): Utbetalingstabellrad => ({
    celler: utbetalingsceller(dag, dagerIgjenForDato),
    className: classNames('error'),
});

const utbetalingstabellrad = (dag: Utbetalingsdag, dagerIgjenForDato: number | string): Utbetalingstabellrad => ({
    celler: utbetalingsceller(dag, dagerIgjenForDato),
    className: classNames(dag.type === Dagtype.Helg && 'disabled'),
});

const TotalUtbetalingsdager = styled(Element)`
    &.dager {
        margin-left: -32px;
    }
`;

export const totalUtbetaling = (utbetalingstidslinje: Utbetalingsdag[]): number => {
    return utbetalingstidslinje
        .filter((dag: Utbetalingsdag) => dag.utbetaling && dag.type !== Dagtype.Avvist && dag.utbetaling > 0)
        .reduce((a, b) => a + b.utbetaling!!, 0);
};
export const totaltAntallUtbetalingsdager = (utbetalingstidslinje: Utbetalingsdag[]): number => {
    return (
        utbetalingstidslinje.filter(
            (dag: Utbetalingsdag) => dag.utbetaling && dag.type !== Dagtype.Avvist && dag.utbetaling > 0
        ).length ?? 0
    );
};

const UtbetalingTotal = styled(Element)`
    white-space: nowrap;
    text-align: right;
`;

const genererTotalRad = (
    maksdato: Dayjs | undefined,
    gjenståendeDager: number | undefined,
    utbetalingstidslinje: Utbetalingsdag[]
): Utbetalingstabellrad => {
    const totalBeløp = totalUtbetaling(utbetalingstidslinje);
    const antallDager = totaltAntallUtbetalingsdager(utbetalingstidslinje);
    const dagerIgjen = totaltAntallDagerIgjen(maksdato, gjenståendeDager, utbetalingstidslinje);

    const rad: Utbetalingsceller = [
        undefined,
        'TOTAL',
        undefined,
        <TotalUtbetalingsdager className="dager">{antallDager} dager</TotalUtbetalingsdager>,
        undefined,
        undefined,
        undefined,
        <UtbetalingTotal>{`${toKronerOgØre(totalBeløp)} kr`}</UtbetalingTotal>,
        <Element>{gjenståendeDager ? dagerIgjen : ''}</Element>,
        undefined,
    ];

    return {
        celler: rad,
        className: 'h',
    };
};

export const periodeDagerIgjen = (
    maksdato: Dayjs | undefined,
    gjenståendeDager: number | undefined,
    utbetalingstidslinje: Utbetalingsdag[]
): number[] => {
    let dagerIgjenPåDato = totaltAntallDagerIgjen(maksdato, gjenståendeDager, utbetalingstidslinje);

    return (
        utbetalingstidslinje.map((dag) => {
            if (dag.type === Dagtype.Syk) {
                dagerIgjenPåDato = dagerIgjenPåDato > 0 ? dagerIgjenPåDato - 1 : dagerIgjenPåDato;
            }
            return dagerIgjenPåDato;
        }) ?? []
    );
};

export const totaltAntallDagerIgjen = (
    maksdato: Dayjs | undefined,
    gjenståendeDager: number | undefined,
    utbetalingstidslinje: Utbetalingsdag[]
): number => {
    return (
        (gjenståendeDager ?? 0) +
        (utbetalingstidslinje.filter((dag) => dag.type === Dagtype.Syk && maksdato && dag.dato.isSameOrBefore(maksdato))
            .length ?? 0)
    );
};

interface UtbetalingsoversiktProps {
    maksdato?: Dayjs;
    gjenståendeDager?: number;
    utbetalingstidslinje: Utbetalingsdag[];
    periode: Periode;
}

export const Utbetalingsoversikt = ({
    maksdato,
    gjenståendeDager,
    utbetalingstidslinje,
    periode,
}: UtbetalingsoversiktProps) => {
    const fom = periode.fom.format(NORSK_DATOFORMAT);
    const tom = periode.tom.format(NORSK_DATOFORMAT);
    const gjenståendeDagerErSatt = gjenståendeDager !== undefined;
    const dagerIgjenIVedtaksperiode: number[] = periodeDagerIgjen(maksdato, gjenståendeDager, utbetalingstidslinje);

    const erMaksdato = (dag: Utbetalingsdag) => maksdato && dag.dato.isSame(maksdato, 'day');
    const erAvvist = (dag: Utbetalingsdag) => dag.type === Dagtype.Avvist;

    const tilUtbetalingsrad = (dag: Utbetalingsdag, dagerIgjenForDato: number | string) =>
        erMaksdato(dag) && dag.dato.isBefore(periode.tom)
            ? maksdatorad(dag, dagerIgjenForDato)
            : erAvvist(dag)
            ? avvistRad(dag, dagerIgjenForDato)
            : utbetalingstabellrad(dag, dagerIgjenForDato);

    const rader =
        utbetalingstidslinje.map((dag, i) =>
            tilUtbetalingsrad(dag, gjenståendeDagerErSatt ? dagerIgjenIVedtaksperiode[i] : '')
        ) ?? [];

    const raderPlussTotalRad: Utbetalingstabellrad[] = [
        genererTotalRad(maksdato, gjenståendeDager, utbetalingstidslinje),
        ...rader,
    ];

    const headere = [
        { render: '' },
        { render: <Element>Dato</Element> },
        { render: <Element>Utbet. dager</Element>, kolonner: 2 },
        { render: <Element>Grad</Element> },
        { render: <Element>Total grad</Element>, kolonner: 2 },
        { render: <Element>Utbetaling</Element> },
        { render: <Element>Dager igjen</Element>, kolonner: 2 },
    ];

    const Container = styled.section`
        flex: 1;
        padding: 2rem 0;
    `;

    return (
        <Container>
            <Utbetalingstabell
                beskrivelse={`Utbetalinger for sykmeldingsperiode fra ${fom} til ${tom}`}
                rader={raderPlussTotalRad}
                headere={headere}
            />
        </Container>
    );
};
