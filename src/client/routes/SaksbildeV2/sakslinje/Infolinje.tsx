import React, { useContext } from 'react';
import styled from '@emotion/styled';
import ReactTooltip from 'react-tooltip';
import { Flex } from '../../../components/Flex';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';

const InfolinjeContainer = styled(Flex)`
    margin-left: auto;
`;

const InfolinjeElement = styled(Flex)`
    align-items: center;
    margin-left: 1.25rem;
    line-height: 22px;
    svg {
        margin-right: 0.5rem;
    }
`;

const Tooltip = styled(ReactTooltip)`
    padding: 2px 8px !important;
    font-size: 14px !important;
    line-height: 20px !important;
    border-width: 0 !important;
    border-radius: 4px;
    box-shadow: 0px 1px 2px #b7b1a9;

    &:after {
        display: none !important; // fjerner default-pilen ned
    }
`;

export const Infolinje = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const sykmeldingsperiode = fom && tom ? `${fom} - ${tom}` : 'Ukjent periode';
    const skjæringstidspunkt =
        aktivVedtaksperiode?.vilkår?.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT) ?? 'ukjent';
    const maksdato = aktivVedtaksperiode?.vilkår?.dagerIgjen.maksdato?.format(NORSK_DATOFORMAT) ?? 'ukjent';

    return (
        <InfolinjeContainer alignItems="center">
            <InfolinjeElement data-tip="Sykmeldingsperiode">
                <Sykmeldingsperiodeikon />
                {sykmeldingsperiode}
            </InfolinjeElement>
            <InfolinjeElement data-tip="Skjæringstidspunkt">
                <Skjæringstidspunktikon />
                {skjæringstidspunkt}
            </InfolinjeElement>
            <InfolinjeElement data-tip="Maksdato">
                <Maksdatoikon />
                {maksdato}
            </InfolinjeElement>
            <Tooltip backgroundColor="#FFF5E8" textColor="#3E3832" borderColor="#B7B1A9" />
        </InfolinjeContainer>
    );
};
