import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '../../../components/Kilde';
import { useArbeidsgivernavnRender } from '../../../state/person';
import { getKildeType, kilde } from '../../../utils/inntektskilde';
import { somPenger } from '../../../utils/locale';

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

    > *:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

interface InntektssammenligningProps {
    organisasjonsnummer: string;
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
    sammenligningsgrunnlag: number | null;
    erGjeldende: boolean;
    onSetAktivInntektskilde: () => void;
}

export const Inntektssammenligning = ({
    organisasjonsnummer,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    erGjeldende,
    onSetAktivInntektskilde,
}: InntektssammenligningProps) => {
    const arbeidsgivernavn = useArbeidsgivernavnRender(organisasjonsnummer);
    return (
        <ArbeidsgiverRad erGjeldende={erGjeldende} onClick={onSetAktivInntektskilde}>
            <td>
                <BodyShort>{organisasjonsnummer}</BodyShort>
            </td>
            <td>
                <InntektMedKilde>
                    <BodyShort>{omregnetÅrsinntekt ? somPenger(omregnetÅrsinntekt.beløp) : 'Ukjent'}</BodyShort>
                    {omregnetÅrsinntekt && (
                        <Kilde type={getKildeType(omregnetÅrsinntekt.kilde)}>{kilde(omregnetÅrsinntekt.kilde)}</Kilde>
                    )}
                </InntektMedKilde>
            </td>
            <td>
                <InntektMedKilde>
                    <BodyShort>{somPenger(sammenligningsgrunnlag)}</BodyShort>
                    <Kilde type="Aordningen">AO</Kilde>
                </InntektMedKilde>
            </td>
        </ArbeidsgiverRad>
    );
};
