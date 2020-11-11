import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Flex } from '../../../components/Flex';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Sykpengeperiodeikon } from '../../../components/ikoner/Sykpengeperiodeikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';

const InfolinjeContainer = styled(Flex)`
    margin-left: auto;
`;

const InfolinjeElement = styled(Flex)`
    align-items: center;
    margin-left: 1.25rem;
    svg {
        margin-right: 0.5rem;
    }
`;

export const Infolinje = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const sykpengeperiode = fom && tom ? `${fom} - ${tom}` : 'Ukjent periode';
    const skjæringstidspunkt =
        aktivVedtaksperiode?.vilkår?.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT) ?? 'ukjent';
    const maksdato = aktivVedtaksperiode?.vilkår?.dagerIgjen.maksdato?.format(NORSK_DATOFORMAT) ?? 'ukjent';

    return (
        <InfolinjeContainer alignItems="center">
            <InfolinjeElement>
                <Sykpengeperiodeikon />
                {sykpengeperiode}
            </InfolinjeElement>
            <InfolinjeElement>
                <Skjæringstidspunktikon />
                {skjæringstidspunkt}
            </InfolinjeElement>
            <InfolinjeElement>
                <Maksdatoikon />
                {maksdato}
            </InfolinjeElement>
        </InfolinjeContainer>
    );
};
