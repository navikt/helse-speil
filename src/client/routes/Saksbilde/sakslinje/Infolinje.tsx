import React from 'react';
import styled from '@emotion/styled';
import { Flex } from '../../../components/Flex';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { Tooltip } from '../../../components/Tooltip';

const InfolinjeContainer = styled(Flex)`
    margin-left: auto;
`;

const Strek = styled.hr`
    margin: 0 2rem;
    width: 1px;
    height: 2rem;
    border: 0;
    background-color: #b7b1a9;
`;

const InfolinjeElement = styled(Flex)`
    align-items: center;
    margin-left: 1.25rem;
    line-height: 32px;

    svg {
        margin-right: 0.5rem;
    }
`;

export const Infolinje = () => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    if (!aktivVedtaksperiode) return null;

    const fom = aktivVedtaksperiode.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode.tom.format(NORSK_DATOFORMAT);
    const skjæringstidspunkt =
        aktivVedtaksperiode.vilkår?.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT) ??
        'Ukjent skjæringstidspunkt';
    const maksdato = aktivVedtaksperiode.vilkår?.dagerIgjen.maksdato?.format(NORSK_DATOFORMAT) ?? 'Ukjent maksdato';

    return (
        <InfolinjeContainer alignItems="center">
            <Strek />
            <InfolinjeElement data-tip="Sykmeldingsperiode">
                <Sykmeldingsperiodeikon />
                {`${fom} - ${tom}`}
            </InfolinjeElement>
            <InfolinjeElement data-tip="Skjæringstidspunkt">
                <Skjæringstidspunktikon />
                {skjæringstidspunkt}
            </InfolinjeElement>
            <InfolinjeElement data-tip="Maksdato">
                <Maksdatoikon />
                {maksdato}
            </InfolinjeElement>
            <Tooltip />
        </InfolinjeContainer>
    );
};
