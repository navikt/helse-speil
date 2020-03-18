import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { utbetalingstidslinje } from '../context/mapping/dagmapper';
import { Utbetalingstabell } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const dager = utbetalingstidslinje(aktivVedtaksperiode);

    return (
        <Container>
            {dager ? <Utbetalingstabell dager={dager} /> : <Normaltekst>Ingen data</Normaltekst>}
            <Navigasjonsknapper />
        </Container>
    );
};

export default Utbetalingsoversikt;
