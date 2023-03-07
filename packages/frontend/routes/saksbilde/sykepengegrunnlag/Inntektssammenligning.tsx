import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Errorikon } from '@components/ikoner/Errorikon';
import { Inntektskilde, OmregnetArsinntekt, Sammenligningsgrunnlag } from '@io/graphql';
import { useArbeidsgiver, useEndringerForPeriode } from '@state/arbeidsgiver';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import { EndringsloggButton } from './inntekt/EndringsloggButton';

const ArbeidsgiverRad = styled.tr<{ erGjeldende: boolean }>`
    padding: 0.25rem;

    > * {
        ${({ erGjeldende }) =>
            erGjeldende &&
            css`
                background-color: #e6f0ff;
                padding-right: 2.5rem;
            `};
    }

    &:hover > * {
        background-color: var(--navds-global-color-gray-100);
        cursor: pointer;
        ${({ erGjeldende }) =>
            erGjeldende &&
            css`
                background-color: var(--speil-light-hover);
            `}
    }
`;

const InntektMedKilde = styled.div`
    display: flex;
    align-items: center;
    justify-content: right;
    gap: 0.5rem;
`;

const Arbeidsgivernavn = styled.div`
    display: flex;
`;
const BagIcon = styled(Arbeidsgiverikon)`
    width: 20px;
    min-width: 20px;
    height: 20px;
    margin-right: 15px;
    position: relative;
    top: 3px;
`;

const ErrorIcon = styled(Errorikon)`
    min-width: 20px;
    margin-right: 15px;
    position: relative;
    top: 3px;
`;

const Loky = styled(AnonymizableText)`
    margin-top: 3px;
`;

const SisteTd = styled.td<{ erGjeldende: boolean }>`
    ${({ erGjeldende }) =>
        erGjeldende &&
        css`
            width: 2.5rem;
        `};
    ${({ erGjeldende }) =>
        !erGjeldende &&
        css`
            margin-right: 2.5rem;
        `};
`;

interface InntektssammenligningProps {
    organisasjonsnummer: string;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    sammenligningsgrunnlag?: Maybe<Sammenligningsgrunnlag>;
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    erGjeldende: boolean;
    onSetAktivInntektskilde: () => void;
}

export const Inntektssammenligning = ({
    organisasjonsnummer,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    arbeidsforholdErDeaktivert,
    erGjeldende,
    onSetAktivInntektskilde,
}: InntektssammenligningProps) => {
    const arbeidsgivernavn = useArbeidsgiver(organisasjonsnummer)?.navn;
    const { inntektsendringer, arbeidsforholdendringer } = useEndringerForPeriode(organisasjonsnummer);

    return (
        <ArbeidsgiverRad erGjeldende={erGjeldende} onClick={onSetAktivInntektskilde}>
            <td>
                <Arbeidsgivernavn>
                    <Tooltip content="Arbeidsgiver">
                        <div>{arbeidsforholdErDeaktivert ? <ErrorIcon /> : <BagIcon alt="Arbeidsgiver" />}</div>
                    </Tooltip>
                    <Loky>{arbeidsgivernavn}</Loky>
                </Arbeidsgivernavn>
            </td>
            <td>
                <InntektMedKilde>
                    {arbeidsforholdErDeaktivert ? (
                        <BodyShort>-</BodyShort>
                    ) : (
                        <BodyShort>{omregnetÅrsinntekt ? somPenger(omregnetÅrsinntekt.belop) : '-'}</BodyShort>
                    )}
                    {omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler || arbeidsforholdErDeaktivert ? (
                        <EndringsloggButton endringer={[...inntektsendringer, ...arbeidsforholdendringer]} />
                    ) : (
                        omregnetÅrsinntekt && (
                            <Kilde type={omregnetÅrsinntekt.kilde}>{kildeForkortelse(omregnetÅrsinntekt.kilde)}</Kilde>
                        )
                    )}
                </InntektMedKilde>
            </td>
            <td>
                <InntektMedKilde>
                    <BodyShort>{somPenger(sammenligningsgrunnlag?.belop)}</BodyShort>
                    <Kilde type={Inntektskilde.Aordningen}>AO</Kilde>
                </InntektMedKilde>
            </td>
            <SisteTd erGjeldende={erGjeldende} />
        </ArbeidsgiverRad>
    );
};
