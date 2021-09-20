import styled from '@emotion/styled';
import React from 'react';

import { Flex } from '../../../components/Flex';

import { getVedtaksperiodeTilstandError } from '../Saksbilde';

interface SaksbildeUfullstendigVedtaksperiodeProps {
    aktivPeriode: Tidslinjeperiode;
}

export const SaksbildeUfullstendigPeriode = ({ aktivPeriode }: SaksbildeUfullstendigVedtaksperiodeProps) => {
    const ErrorContainer = styled.div`
        width: 100%;
    `;

    const errorMelding = getVedtaksperiodeTilstandError(aktivPeriode.tilstand);

    return (
        <Flex justifyContent="space-between" data-testid="saksbilde-ufullstendig-vedtaksperiode">
            <ErrorContainer>{errorMelding}</ErrorContainer>
        </Flex>
    );
};
