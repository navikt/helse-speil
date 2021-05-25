import styled from '@emotion/styled';
import { UfullstendigVedtaksperiode } from 'internal-types';
import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex } from '../../../components/Flex';

import { getVedtaksperiodeTilstandError } from '../Saksbilde';

interface SaksbildeUfullstendigVedtaksperiodeProps {
    aktivVedtaksperiode: UfullstendigVedtaksperiode;
}

export const SaksbildeUfullstendigVedtaksperiode = ({
    aktivVedtaksperiode,
}: SaksbildeUfullstendigVedtaksperiodeProps) => {
    const ErrorContainer = styled.div`
        width: 100%;
    `;

    const errorMelding = getVedtaksperiodeTilstandError(aktivVedtaksperiode.tilstand);

    return (
        <Flex justifyContent="space-between" data-testid="saksbilde-ufullstendig-vedtaksperiode">
            <ErrorContainer>{errorMelding}</ErrorContainer>
        </Flex>
    );
};
