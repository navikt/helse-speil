import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import { Sykmeldingstabell } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import { sykdomstidslinje } from '../context/mapping/dagmapper';

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const Sykmeldingsperiode = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const dager = sykdomstidslinje(aktivVedtaksperiode);

    return (
        <Container>
            <Sykmeldingstabell dager={dager} />
            <Navigasjonsknapper next={pages.INNGANGSVILKÅR} />
        </Container>
    );
};

export default Sykmeldingsperiode;
