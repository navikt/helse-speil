import styled from '@emotion/styled';
import React from 'react';

import { getErrorMessageForTidslinjetilstand } from '../errorMessages';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    grid-column-start: venstremeny;
    grid-column-end: høyremeny;
`;

const ErrorContainer = styled.div`
    width: 100%;
`;

interface SaksbildeUfullstendigVedtaksperiodeProps {
    aktivPeriode: TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær;
}

export const SaksbildeUfullstendigPeriode = ({ aktivPeriode }: SaksbildeUfullstendigVedtaksperiodeProps) => {
    const errorMelding = getErrorMessageForTidslinjetilstand(aktivPeriode.tilstand);

    return (
        <Container data-testid="saksbilde-ufullstendig-vedtaksperiode">
            <ErrorContainer>{errorMelding}</ErrorContainer>
        </Container>
    );
};
