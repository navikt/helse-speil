import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { Dag, Utbetalingstabell } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../utils/date';

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const dager: Dag[] | undefined = aktivVedtaksperiode?.utbetalingstidslinje.map(dag => ({
        dato: dag.dato.format(NORSK_DATOFORMAT),
        type: dag.type,
        gradering: dag.gradering,
        utbetaling: dag.utbetaling
    }));

    return (
        <Container>
            {dager ? <Utbetalingstabell dager={dager} /> : <Normaltekst>Ingen data</Normaltekst>}
            <Navigasjonsknapper />
        </Container>
    );
};

export default Utbetalingsoversikt;
