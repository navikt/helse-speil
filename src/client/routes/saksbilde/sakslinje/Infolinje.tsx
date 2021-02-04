import React from 'react';
import styled from '@emotion/styled';
import { Flex } from '../../../components/Flex';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Tooltip } from '../../../components/Tooltip';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { Undertekst } from 'nav-frontend-typografi';
import { UfullstendigVedtaksperiode, Vedtaksperiode } from 'internal-types';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { LovdataLenke } from '../../../components/LovdataLenke';

const InfolinjeContainer = styled(Flex)`
    margin-left: auto;
`;

const Strek = styled.hr`
    margin-left: 1.25rem;
    width: 1px;
    height: 2rem;
    border: 0;
    background-color: var(--navds-color-border);
`;

const InfolinjeElement = styled(Flex)`
    align-items: center;
    margin-left: 1.25rem;
    line-height: 32px;

    svg {
        margin-right: 0.5rem;
    }
`;

interface InfolinjeProps {
    vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode;
}

export const Infolinje = ({ vedtaksperiode }: InfolinjeProps) => {
    const fom = vedtaksperiode.fom.format(NORSK_DATOFORMAT_KORT);
    const tom = vedtaksperiode.tom.format(NORSK_DATOFORMAT_KORT);
    const skjæringstidspunkt =
        (vedtaksperiode as Vedtaksperiode).vilkår?.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT_KORT) ??
        'Ukjent skjæringstidspunkt';
    const maksdato =
        (vedtaksperiode as Vedtaksperiode).vilkår?.dagerIgjen.maksdato?.format(NORSK_DATOFORMAT_KORT) ??
        'Ukjent maksdato';
    const over67År = ((vedtaksperiode as Vedtaksperiode).vilkår?.alder.alderSisteSykedag ?? 0) >= 67;

    return (
        <InfolinjeContainer alignItems="center">
            <Strek />
            <InfolinjeElement data-tip="Arbeidsgiver">
                <Arbeidsgiverikon />{' '}
                {(vedtaksperiode as Vedtaksperiode).inntektskilder?.[0].arbeidsgiver ?? 'Ukjent arbeidsgiver'}
            </InfolinjeElement>
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
                {over67År && (
                    <Flex alignItems="center" style={{ marginLeft: '8px' }}>
                        <Advarselikon height={16} width={16} />
                        <Undertekst>
                            <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                        </Undertekst>
                    </Flex>
                )}
            </InfolinjeElement>
            <Tooltip />
        </InfolinjeContainer>
    );
};
