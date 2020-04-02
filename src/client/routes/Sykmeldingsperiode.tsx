import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { NORSK_DATOFORMAT } from '../utils/date';
import { Dag, Dagtype, Sykmeldingstabell } from '@navikt/helse-frontend-tabell';

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const Sykmeldingsperiode = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const dager: Dag[] | undefined = aktivVedtaksperiode?.sykdomstidslinje.map(dag => ({
        dato: dag.dato.format(NORSK_DATOFORMAT),
        type: dag.type as Dagtype,
        gradering: dag.type === Dagtype.Helg ? undefined : dag.gradering,
        kilde: dag.type === Dagtype.Helg ? undefined : { label: dag.kilde! }
    }));

    return (
        <Container>
            {dager ? <Sykmeldingstabell dager={dager} /> : <Normaltekst>Ingen data</Normaltekst>}
            <Navigasjonsknapper />
        </Container>
    );
};

export default Sykmeldingsperiode;
