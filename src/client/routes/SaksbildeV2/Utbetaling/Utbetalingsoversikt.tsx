import React, { ReactNode, useContext } from 'react';
import styled from '@emotion/styled';
import Element from 'nav-frontend-typografi/lib/element';
import classNames from 'classnames';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { Normaltekst } from 'nav-frontend-typografi';
import { Dagtype, Utbetalingsdag, Vedtaksperiode } from 'internal-types';
import { Feilikon } from '../../../components/ikoner/Feilikon';
import { dato, gradering, ikon, type, utbetaling } from '../../../components/tabell/rader';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { useMaksdato } from '../../../hooks/useMaksdato';
import { toKronerOgØre } from '../../../utils/locale';

type Utbetalingsceller = [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];

type Utbetalingstabellrad = {
    celler: Utbetalingsceller;
    className: string;
};

const Utbetalingstabell = styled(Tabell)`
    thead tr th {
        vertical-align: bottom;
        box-sizing: border-box;
        padding-top: 0;
    }

    thead tr th,
    tbody tr:first-of-type td {
        border-bottom: 1px solid #3e3832;
    }
`;

const Feilmeldingsikon = styled(Feilikon)`
    display: flex;
    margin-right: -1rem;
`;

const Feilmelding = styled(Normaltekst)`
    margin-left: 1rem;
`;

const utbetalingsceller = (dag: Utbetalingsdag, dagerIgjenForDato: number | string): Utbetalingsceller => [
    undefined,
    dato(dag),
    ikon(dag),
    type(dag),
    gradering(dag),
    utbetaling(dag),
    dagerIgjenForDato,
    undefined,
];

const cellerPåMaksdato = (dag: Utbetalingsdag, dagerIgjenForDato: number | string): Utbetalingsceller => [
    <Feilmeldingsikon height={20} width={20} />,
    dato(dag),
    ikon(dag),
    type(dag),
    gradering(dag),
    utbetaling(dag),
    dagerIgjenForDato,
    <Feilmelding>Siste utbetalingsdag for sykepenger</Feilmelding>,
];

const maksdatorad = (dag: Utbetalingsdag, dagerIgjenForDato: number | string): Utbetalingstabellrad => ({
    celler: cellerPåMaksdato(dag, dagerIgjenForDato),
    className: classNames('error', dag.type === Dagtype.Helg && 'disabled'),
});

const etterMaksdatoRad = (dag: Utbetalingsdag, dagerIgjenForDato: number | string): Utbetalingstabellrad => ({
    celler: utbetalingsceller(dag, dagerIgjenForDato),
    className: classNames('inactive', dag.type === Dagtype.Helg && 'disabled'),
});

const utbetalingstabellrad = (dag: Utbetalingsdag, dagerIgjenForDato: number | string): Utbetalingstabellrad => ({
    celler: utbetalingsceller(dag, dagerIgjenForDato),
    className: classNames(dag.type === Dagtype.Helg && 'disabled'),
});

const utbetalingsheadere = [
    '',
    <Element>Dato</Element>,
    {
        render: <Element>Utbet. dager</Element>,
        kolonner: 2,
    },
    <Element>Grad</Element>,
    <Element>Utbetaling</Element>,
    {
        render: <Element>Dager igjen</Element>,
        kolonner: 2,
    },
];

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
    const dagerIgjen = aktivVedtaksperiode?.vilkår?.dagerIgjen.gjenståendeDager ?? '';

    const rad: Utbetalingsceller = [
        undefined,
        'TOTAL',
        undefined,
        <TotalUtbetalingsdager className="dager">{antallDager} dager</TotalUtbetalingsdager>,
        undefined,
        <UtbetalingTotal>{`${toKronerOgØre(totalBeløp)} kr`}</UtbetalingTotal>,
        <Element>{dagerIgjen}</Element>,
        undefined,
    ];

    return {
        celler: rad,
        className: 'h',
    };
};

export const vedtaksperiodeDagerIgjen = (aktivVedtaksperiode: Vedtaksperiode | undefined): number[] => {
    let dagerIgjen: number = aktivVedtaksperiode?.vilkår?.dagerIgjen.gjenståendeDager ?? -1;

    if (dagerIgjen === -1) {
        return [];
    }

    return (
        aktivVedtaksperiode?.utbetalingstidslinje.map((dag) => {
            if (dag.type === Dagtype.Syk) {
                dagerIgjen = dagerIgjen > 0 ? dagerIgjen - 1 : dagerIgjen;
            }
            return dagerIgjen;
        }) ?? []
    );
};

export const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { maksdato } = useMaksdato();
    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const dagerIgjenIVedtaksperiode: number[] = vedtaksperiodeDagerIgjen(aktivVedtaksperiode);

    const erMaksdato = (dag: Utbetalingsdag) => maksdato && dag.dato.isSame(maksdato, 'day');
    const erEtterMaksdato = (dag: Utbetalingsdag) => maksdato && dag.dato.isAfter(maksdato, 'day');

    const tilUtbetalingsrad = (dag: Utbetalingsdag, dagerIgjenForDato: number) =>
        erMaksdato(dag) && maksdato && maksdato.format(NORSK_DATOFORMAT) < tom!!
            ? maksdatorad(dag, dagerIgjenForDato)
            : erEtterMaksdato(dag)
            ? etterMaksdatoRad(dag, dagerIgjenForDato)
            : utbetalingstabellrad(dag, dagerIgjenForDato);

    const rader =
        aktivVedtaksperiode?.utbetalingstidslinje.map((dag, i) =>
            tilUtbetalingsrad(dag, dagerIgjenIVedtaksperiode[i] ?? '')
        ) ?? [];

    const raderPlussTotalRad: Utbetalingstabellrad[] = [genererTotalRad(aktivVedtaksperiode), ...rader];

    const headere = utbetalingsheadere;
    const tabellbeskrivelse = `Utbetalinger for sykmeldingsperiode fra ${fom} til ${tom}`;

    return rader ? (
        <Utbetalingstabell beskrivelse={tabellbeskrivelse} rader={raderPlussTotalRad} headere={headere} />
    ) : (
        <Normaltekst>Ingen data</Normaltekst>
    );
};
