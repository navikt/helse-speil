import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { Dag, Dagstatus, Utbetalingstabell } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../utils/date';
import { Dagtype, Sykdomsdag, Utbetalingsdag } from '../context/types.internal';
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
    sykdomstidslinje.find((sykdomsdag) => utbetalingsdag.dato.isSame(sykdomsdag.dato))![nøkkel];

const status = (dag: Utbetalingsdag, maksdato?: Dayjs): Dagstatus | undefined =>
    [Dagtype.Avvist, Dagtype.Foreldet].includes(dag.type)
        ? Dagstatus.Inaktiv
        : maksdato && dag.dato.isSame(maksdato, 'day')
        ? Dagstatus.Feil
        : undefined;

const feilmelding = (dag: Utbetalingsdag, maksdato?: Dayjs) =>
    maksdato && dag.dato.isSame(maksdato, 'day') ? 'Siste utbetalingsdag for sykepenger' : undefined;

const gradering = (dag: Utbetalingsdag): number | undefined =>
    (dag.type !== Dagtype.Helg && dag.type !== Dagtype.Ferie && dag.gradering) || undefined;

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { maksdato } = useMaksdato();

    const dager: Dag[] | undefined = aktivVedtaksperiode?.utbetalingstidslinje.map((dag) => {
        if (dag.type === Dagtype.Avvist) {
            const tilsvarendeDag = aktivVedtaksperiode?.sykdomstidslinje.find((sykdomsdag) =>
                dag.dato.isSame(sykdomsdag.dato)
            )!;
            return {
                dato: dag.dato.format(NORSK_DATOFORMAT),
                type: tilsvarendeDag.type,
                gradering: tilsvarendeDag.gradering,
                utbetaling: 'Ingen utbetaling',
                status: status(dag, maksdato),
                feilmelding: feilmelding(dag, maksdato),
            };
        }
        return {
            dato: dag.dato.format(NORSK_DATOFORMAT),
            type: dag.type,
            gradering: gradering(dag),
            utbetaling: dag.utbetaling,
            status: status(dag, maksdato),
            feilmelding: feilmelding(dag, maksdato),
        };
    });

    return (
        <Container>
            {dager ? <Utbetalingstabell dager={dager} /> : <Normaltekst>Ingen data</Normaltekst>}
            <Navigasjonsknapper />
        </Container>
    );
};

export default Utbetalingsoversikt;
