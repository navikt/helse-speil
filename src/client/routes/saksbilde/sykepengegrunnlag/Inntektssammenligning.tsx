import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Kildetype, OmregnetÅrsinntekt, Sammenligningsgrunnlag } from 'internal-types';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '../../../components/Kilde';
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

interface Props {
    arbeidsgiver: string;
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
    sammenligningsgrunnlag?: Sammenligningsgrunnlag;
    erGjeldende: boolean;
    onSetAktivInntektskilde: () => void;
}

export const Inntektssammenligning = ({
    arbeidsgiver,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    erGjeldende,
    onSetAktivInntektskilde,
}: Props) => (
    <ArbeidsgiverRad erGjeldende={erGjeldende} onClick={onSetAktivInntektskilde}>
        <td>
            <BodyShort>{arbeidsgiver}</BodyShort>
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
                <BodyShort>{somPenger(sammenligningsgrunnlag?.beløp)}</BodyShort>
                <Kilde type={Kildetype.Aordningen}>AO</Kilde>
            </InntektMedKilde>
        </td>
    </ArbeidsgiverRad>
);
