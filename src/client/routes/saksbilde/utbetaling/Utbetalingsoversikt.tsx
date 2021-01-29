import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import Element from 'nav-frontend-typografi/lib/element';
import classNames from 'classnames';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { Dagtype, Utbetalingsdag, Vedtaksperiode } from 'internal-types';
import { dato, gradering, ikon, merknad, type, utbetaling } from '../../../components/tabell/rader';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { toKronerOgØre } from '../../../utils/locale';
import { maksdatoForPeriode } from '../../../mapping/selectors';

type Utbetalingsceller = [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];

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

export const totalUtbetaling = (aktivVedtaksperiode: Vedtaksperiode | undefined): number => {
    return (
        aktivVedtaksperiode?.utbetalingstidslinje
            .filter((dag: Utbetalingsdag) => dag.utbetaling && dag.type !== Dagtype.Avvist && dag.utbetaling > 0)
            .reduce((a, b) => a + b.utbetaling!!, 0) ?? 0
    );
};
export const totaltAntallUtbetalingsdager = (aktivVedtaksperiode: Vedtaksperiode | undefined): number => {
    return (
        aktivVedtaksperiode?.utbetalingstidslinje.filter(
            (dag: Utbetalingsdag) => dag.utbetaling && dag.type !== Dagtype.Avvist && dag.utbetaling > 0
        ).length ?? 0
    );
};

const UtbetalingTotal = styled(Element)`
    white-space: nowrap;
    text-align: right;
`;

const genererTotalRad = (aktivVedtaksperiode: Vedtaksperiode | undefined): Utbetalingstabellrad => {
    const totalBeløp = totalUtbetaling(aktivVedtaksperiode);
    const antallDager = totaltAntallUtbetalingsdager(aktivVedtaksperiode);
    const dagerIgjen = totaltAntallDagerIgjen(aktivVedtaksperiode);

    const rad: Utbetalingsceller = [
        undefined,
        'TOTAL',
        undefined,
        <TotalUtbetalingsdager className="dager">{antallDager} dager</TotalUtbetalingsdager>,
        undefined,
        <UtbetalingTotal>{`${toKronerOgØre(totalBeløp)} kr`}</UtbetalingTotal>,
        <Element>{aktivVedtaksperiode?.vilkår?.dagerIgjen.gjenståendeDager ? dagerIgjen : ''}</Element>,
        undefined,
    ];

    return {
        celler: rad,
        className: 'h',
    };
};

export const vedtaksperiodeDagerIgjen = (aktivVedtaksperiode: Vedtaksperiode | undefined): number[] => {
    let dagerIgjenPåDato = totaltAntallDagerIgjen(aktivVedtaksperiode);

    return (
        aktivVedtaksperiode?.utbetalingstidslinje.map((dag) => {
            if (dag.type === Dagtype.Syk) {
                dagerIgjenPåDato = dagerIgjenPåDato > 0 ? dagerIgjenPåDato - 1 : dagerIgjenPåDato;
            }
            return dagerIgjenPåDato;
        }) ?? []
    );
};

export const totaltAntallDagerIgjen = (aktivVedtaksperiode: Vedtaksperiode | undefined): number => {
    const maksdato = aktivVedtaksperiode?.vilkår?.dagerIgjen?.maksdato;
    return (
        (aktivVedtaksperiode?.vilkår?.dagerIgjen.gjenståendeDager ?? 0) +
        (aktivVedtaksperiode?.utbetalingstidslinje.filter(
            (dag) => dag.type === Dagtype.Syk && maksdato && dag.dato.isSameOrBefore(maksdato)
        ).length ?? 0)
    );
};

interface UtbetalingsoversiktProps {
    vedtaksperiode: Vedtaksperiode;
}

export const Utbetalingsoversikt = ({ vedtaksperiode }: UtbetalingsoversiktProps) => {
    const maksdato = vedtaksperiode && maksdatoForPeriode(vedtaksperiode);
    const fom = vedtaksperiode.fom.format(NORSK_DATOFORMAT);
    const tom = vedtaksperiode.tom.format(NORSK_DATOFORMAT);
    const gjenståendeDagerErSatt = vedtaksperiode.vilkår?.dagerIgjen.gjenståendeDager;
    const dagerIgjenIVedtaksperiode: number[] = vedtaksperiodeDagerIgjen(vedtaksperiode);

    const erMaksdato = (dag: Utbetalingsdag) => maksdato && dag.dato.isSame(maksdato, 'day');
    const erAvvist = (dag: Utbetalingsdag) => dag.type === Dagtype.Avvist;

    const tilUtbetalingsrad = (dag: Utbetalingsdag, dagerIgjenForDato: number | string) =>
        erMaksdato(dag) && dag.dato.isBefore(vedtaksperiode.tom)
            ? maksdatorad(dag, dagerIgjenForDato)
            : erAvvist(dag)
            ? avvistRad(dag, dagerIgjenForDato)
            : utbetalingstabellrad(dag, dagerIgjenForDato);

    const rader =
        vedtaksperiode.utbetalingstidslinje.map((dag, i) =>
            tilUtbetalingsrad(dag, gjenståendeDagerErSatt ? dagerIgjenIVedtaksperiode[i] : '')
        ) ?? [];

    const raderPlussTotalRad: Utbetalingstabellrad[] = [genererTotalRad(vedtaksperiode), ...rader];

    const headere = [
        { render: '' },
        { render: <Element>Dato</Element> },
        { render: <Element>Utbet. dager</Element>, kolonner: 2 },
        { render: <Element>Grad</Element> },
        { render: <Element>Utbetaling</Element> },
        { render: <Element>Dager igjen</Element>, kolonner: 2 },
    ];

    return (
        <Utbetalingstabell
            beskrivelse={`Utbetalinger for sykmeldingsperiode fra ${fom} til ${tom}`}
            rader={raderPlussTotalRad}
            headere={headere}
        />
    );
};
