import React, { ReactNode, useContext } from 'react';
import styled from '@emotion/styled';
import Element from 'nav-frontend-typografi/lib/element';
import classNames from 'classnames';
import Navigasjonsknapper from '../../components/navigationButtons';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { Feilikon } from '../../components/ikoner/Feilikon';
import { Normaltekst } from 'nav-frontend-typografi';
import { useMaksdato } from '../../hooks/useMaksdato';
import { PersonContext } from '../../context/PersonContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Dagtype, Utbetalingsdag } from '../../context/types.internal';
import { dato, gradering, ikon, type, utbetaling } from '../../components/tabell/rader';

type Utbetalingsceller = [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];

type Utbetalingstabellrad = {
    celler: Utbetalingsceller;
    className: string;
};

const Utbetalingstabell = styled(Tabell)`
    thead tr th {
        vertical-align: bottom;
        box-sizing: border-box;
        height: 51px;
    }
`;

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const Feilmeldingsikon = styled(Feilikon)`
    display: flex;
    margin-right: -1rem;
`;

const Feilmelding = styled(Normaltekst)`
    margin-left: 1rem;
`;

const utbetalingsceller = (dag: Utbetalingsdag): Utbetalingsceller => [
    undefined,
    dato(dag),
    ikon(dag),
    type(dag),
    gradering(dag),
    utbetaling(dag),
    undefined,
];

const cellerPåMaksdato = (dag: Utbetalingsdag): Utbetalingsceller => [
    <Feilmeldingsikon height={20} width={20} />,
    dato(dag),
    ikon(dag),
    type(dag),
    gradering(dag),
    utbetaling(dag),
    <Feilmelding>Siste utbetalingsdag for sykepenger</Feilmelding>,
];

const maksdatorad = (dag: Utbetalingsdag): Utbetalingstabellrad => ({
    celler: cellerPåMaksdato(dag),
    className: classNames('error', dag.type === Dagtype.Helg && 'disabled'),
});

const etterMaksdatoRad = (dag: Utbetalingsdag): Utbetalingstabellrad => ({
    celler: utbetalingsceller(dag),
    className: classNames('inactive', dag.type === Dagtype.Helg && 'disabled'),
});

const utbetalingstabellrad = (dag: Utbetalingsdag): Utbetalingstabellrad => ({
    celler: utbetalingsceller(dag),
    className: classNames(dag.type === Dagtype.Helg && 'disabled'),
});

const utbetalingsheadere = [
    '',
    {
        render: <Element>Sykmeldingsperiode</Element>,
        kolonner: 3,
    },
    <Element>Gradering</Element>,
    <Element>Utbetaling</Element>,
    '',
];

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { maksdato } = useMaksdato();
    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);

    const erMaksdato = (dag: Utbetalingsdag) => maksdato && dag.dato.isSame(maksdato, 'day');
    const erEtterMaksdato = (dag: Utbetalingsdag) => maksdato && dag.dato.isAfter(maksdato, 'day');
    const tilUtbetalingsrad = (dag: Utbetalingsdag) =>
        erMaksdato(dag) ? maksdatorad(dag) : erEtterMaksdato(dag) ? etterMaksdatoRad(dag) : utbetalingstabellrad(dag);

    const rader = aktivVedtaksperiode?.utbetalingstidslinje.map(tilUtbetalingsrad) ?? [];
    const headere = utbetalingsheadere;
    const tabellbeskrivelse = `Utbetalinger for sykmeldingsperiode fra ${fom} til ${tom}`;

    return (
        <Container>
            <ErrorBoundary>
                {rader ? (
                    <Utbetalingstabell beskrivelse={tabellbeskrivelse} rader={rader} headere={headere} />
                ) : (
                    <Normaltekst>Ingen data</Normaltekst>
                )}
            </ErrorBoundary>
            <Navigasjonsknapper />
        </Container>
    );
};

export default Utbetalingsoversikt;
