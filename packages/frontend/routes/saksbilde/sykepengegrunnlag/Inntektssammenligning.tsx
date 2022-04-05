import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { Bag } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Errorikon } from '@components/ikoner/Errorikon';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { useArbeidsgiver, useEndringerForPeriode } from '@state/arbeidsgiver';
import { Inntektskilde, OmregnetArsinntekt, Sammenligningsgrunnlag } from '@io/graphql';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import { EndringsloggButton } from './inntekt/EndringsloggButton';
import { useCurrentPerson } from '@state/person';

const ArbeidsgiverRad = styled.tr<{ erGjeldende: boolean }>`
    padding: 0.25rem;

    > * {
        ${({ erGjeldende }) =>
            erGjeldende &&
            css`
                background-color: var(--speil-light-hover);
            `};
    }

    &:hover > * {
        background-color: var(--navds-color-gray-10);
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

    > *:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

const Arbeidsgivernavn = styled.div`
    display: flex;
`;
const BagIcon = styled(Bag)`
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
                    {arbeidsforholdErDeaktivert ? (
                        <ErrorIcon data-tip="Arbeidsgiver" />
                    ) : (
                        <BagIcon data-tip="Arbeidsgiver" title="Arbeidsgiver" />
                    )}
                    <Loky>{arbeidsgivernavn}</Loky>
                </Arbeidsgivernavn>
            </td>
            <td>
                <InntektMedKilde>
                    {!arbeidsforholdErDeaktivert && (
                        <BodyShort>{omregnetÅrsinntekt ? somPenger(omregnetÅrsinntekt.belop) : '_'}</BodyShort>
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
        </ArbeidsgiverRad>
    );
};
