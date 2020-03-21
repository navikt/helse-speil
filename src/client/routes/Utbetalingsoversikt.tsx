import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { Dag, Dagstatus, Utbetalingstabell } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../utils/date';
import { Utbetalingsdag } from '../context/types';
import { Dayjs } from 'dayjs';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const gradering = (dag: Utbetalingsdag, maksdato?: Dayjs) =>
    maksdato && dag.dato.isAfter(maksdato) ? undefined : dag.gradering;

const utbetaling = (dag: Utbetalingsdag, maksdato?: Dayjs) =>
    maksdato && dag.dato.isAfter(maksdato) ? 'Ingen utbetaling' : dag.utbetaling;

const status = (dag: Utbetalingsdag, maksdato?: Dayjs) =>
    maksdato && dag.dato.isSame(maksdato, 'day')
        ? Dagstatus.Feil
        : maksdato && dag.dato.isAfter(maksdato)
        ? Dagstatus.Inaktiv
        : undefined;

const feilmelding = (dag: Utbetalingsdag, maksdato?: Dayjs) =>
    maksdato && dag.dato.isSame(maksdato, 'day') ? 'Siste utbetalingsdag for sykepenger' : undefined;

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const maksdato = aktivVedtaksperiode?.vilkår.dagerIgjen?.maksdato;

    const maksdatoOverskrides =
        maksdato &&
        aktivVedtaksperiode?.utbetalingstidslinje.find(dag => dag.dato.isSameOrAfter(maksdato)) !== undefined;

    const dager: Dag[] | undefined = aktivVedtaksperiode?.utbetalingstidslinje.map(dag => ({
        dato: dag.dato.format(NORSK_DATOFORMAT),
        type: dag.type,
        gradering: gradering(dag, maksdato),
        utbetaling: utbetaling(dag, maksdato),
        status: status(dag, maksdato),
        feilmelding: feilmelding(dag, maksdato)
    }));

    return (
        <>
            {maksdatoOverskrides && (
                <Varsel type={Varseltype.Feil}>Vilkår er ikke oppfylt fra {maksdato!.format(NORSK_DATOFORMAT)}</Varsel>
            )}
            <Container>
                {dager ? <Utbetalingstabell dager={dager} /> : <Normaltekst>Ingen data</Normaltekst>}
                <Navigasjonsknapper />
            </Container>
        </>
    );
};

export default Utbetalingsoversikt;
