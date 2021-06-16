import styled from '@emotion/styled';
import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex } from '../../../components/Flex';
import { Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';
import { useUfullstendigVedtaksperiode } from '../../../state/tidslinje';

import { getVedtaksperiodeTilstandError } from '../Saksbilde';

interface SaksbildeUfullstendigVedtaksperiodeProps {
    aktivPeriode: Tidslinjeperiode;
}

export const SaksbildeUfullstendigVedtaksperiode = ({ aktivPeriode }: SaksbildeUfullstendigVedtaksperiodeProps) => {
    const vedtaksperiode = useUfullstendigVedtaksperiode(aktivPeriode.id);
    const ErrorContainer = styled.div`
        width: 100%;
    `;

    const errorMelding = getVedtaksperiodeTilstandError(vedtaksperiode.tilstand);

    return (
        <Flex justifyContent="space-between" data-testid="saksbilde-ufullstendig-vedtaksperiode">
            <ErrorContainer>{errorMelding}</ErrorContainer>
        </Flex>
    );
};
