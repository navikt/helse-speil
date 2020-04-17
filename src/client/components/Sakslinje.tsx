import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Vedtaksperiodeinfo from './Vedtaksperiodeinfo';
import Sakslinje from '@navikt/helse-frontend-sakslinje';
import { LoggHeader } from '@navikt/helse-frontend-logg';
import { PersonContext } from '../context/PersonContext';

const StyledSakslinje = styled(Sakslinje)`
    border: none;
    border-bottom: 1px solid #c6c2bf;
    > div:first-of-type {
        width: 250px;
    }
    > div:last-of-type {
        width: 210px;
    }
`;

export default () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    if (!personTilBehandling) return <Sakslinje />;

    return (
        <StyledSakslinje
            venstre={<div />}
            midt={<Vedtaksperiodeinfo periode={aktivVedtaksperiode} person={personTilBehandling} />}
            høyre={<LoggHeader />}
        />
    );
};
