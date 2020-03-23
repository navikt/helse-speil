import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { Dag, Dagstatus, Utbetalingstabell } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../utils/date';
import { Dagtype, Sykdomsdag, Utbetalingsdag } from '../context/types';
import { Dayjs } from 'dayjs';
import { useMaksdato } from '../hooks/useMaksdato';

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

type ValueOf<T> = T[keyof T];

const verdiFraTilsvarendeSykdomsdag = (
    utbetalingsdag: Utbetalingsdag,
    sykdomstidslinje: Sykdomsdag[],
    nøkkel: keyof (Utbetalingsdag | Sykdomsdag)
): ValueOf<Sykdomsdag | Utbetalingsdag> =>
    sykdomstidslinje.find(sykdomsdag => utbetalingsdag.dato.isSame(sykdomsdag.dato))![nøkkel];

const type = (dag: Utbetalingsdag, sykdomstidslinje: Sykdomsdag[]): Dagtype =>
    dag.type === Dagtype.Avvist ? (verdiFraTilsvarendeSykdomsdag(dag, sykdomstidslinje, 'type') as Dagtype) : dag.type;

const gradering = (dag: Utbetalingsdag, sykdomstidslinje: Sykdomsdag[], maksdato?: Dayjs): number | undefined =>
    maksdato && dag.dato.isAfter(maksdato)
        ? (verdiFraTilsvarendeSykdomsdag(dag, sykdomstidslinje, 'gradering') as number)
        : dag.gradering;

const utbetaling = (dag: Utbetalingsdag, maksdato?: Dayjs): string | number | undefined =>
    maksdato && dag.dato.isAfter(maksdato) ? 'Ingen utbetaling' : dag.utbetaling;

const status = (dag: Utbetalingsdag, maksdato?: Dayjs): Dagstatus | undefined =>
    maksdato && dag.dato.isSame(maksdato, 'day')
        ? Dagstatus.Feil
        : maksdato && dag.dato.isAfter(maksdato)
        ? Dagstatus.Inaktiv
        : undefined;

const feilmelding = (dag: Utbetalingsdag, maksdato?: Dayjs) =>
    maksdato && dag.dato.isSame(maksdato, 'day') ? 'Siste utbetalingsdag for sykepenger' : undefined;

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { maksdato } = useMaksdato();

    const dager: Dag[] | undefined = aktivVedtaksperiode?.utbetalingstidslinje.map(dag => ({
        dato: dag.dato.format(NORSK_DATOFORMAT),
        type: type(dag, aktivVedtaksperiode?.sykdomstidslinje),
        gradering: gradering(dag, aktivVedtaksperiode.sykdomstidslinje, maksdato),
        utbetaling: utbetaling(dag, maksdato),
        status: status(dag, maksdato),
        feilmelding: feilmelding(dag, maksdato)
    }));

    console.log(aktivVedtaksperiode?.sykdomstidslinje);

    return (
        <Container>
            {dager ? <Utbetalingstabell dager={dager} /> : <Normaltekst>Ingen data</Normaltekst>}
            <Navigasjonsknapper />
        </Container>
    );
};

export default Utbetalingsoversikt;
