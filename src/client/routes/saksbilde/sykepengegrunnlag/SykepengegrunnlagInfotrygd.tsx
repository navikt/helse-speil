import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Inntektsgrunnlag } from 'internal-types';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { FlexColumn } from '../../../components/Flex';
import { Kilde } from '../../../components/Kilde';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { getKildeType, kilde } from '../../../utils/inntektskilde';
import { somPenger } from '../../../utils/locale';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';

interface SykepengegrunnlagInfotrygdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
}

const Container = styled(FlexColumn)`
    --fixed-column-width: 20rem;
`;

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

const Kolonnetittel = styled(BodyShort)`
    color: var(--navds-color-gray-60);
    font-size: 14px;
`;

const Table = styled.table`
    text-align: left;
    border-collapse: collapse;
    width: max-content;
    margin-bottom: 1.75rem;

    td,
    th {
        padding: 0.25rem 0.5rem;

        &:not(:last-of-type) {
            padding-right: 1.75rem;
        }
    }

    tr > th:first-of-type,
    tr > td:first-of-type {
        width: var(--fixed-column-width);
    }

    thead > tr:first-of-type > th {
        padding-bottom: 0.75rem;
    }

    tbody:before {
        content: '';
        display: block;
        height: 0.5rem;
    }

    tfoot:before {
        content: '';
        display: block;
        height: 1.75rem;
    }

    tfoot > tr:first-of-type > td {
        padding: 0.75rem 0.5rem;
        border-top: 1px solid var(--navds-color-text-primary);
    }
`;

const InntektMedKilde = styled.div`
    display: flex;
    align-items: center;

    > *:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

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

export const SykepengegrunnlagInfotrygd = ({ inntektsgrunnlag }: SykepengegrunnlagInfotrygdProps) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    return (
        <Container className="SykepengegrunnlagInfotrygd">
            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            <Bold component="p">Inntektsgrunnlag</Bold>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <Kolonnetittel component="p">Inntektskilde</Kolonnetittel>
                        </th>
                        <th>
                            <Kolonnetittel component="p">Sykepengegrunnlag før 6G</Kolonnetittel>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {inntektsgrunnlag.inntekter.map((inntekt, index) => (
                        <ArbeidsgiverRad
                            key={index}
                            erGjeldende={inntektsgrunnlag.organisasjonsnummer === inntekt.organisasjonsnummer}
                        >
                            <td>
                                <BodyShort>
                                    {anonymiseringEnabled
                                        ? `${getAnonymArbeidsgiverForOrgnr(inntekt.organisasjonsnummer).navn}`
                                        : inntekt.arbeidsgivernavn.toLowerCase() !== 'ikke tilgjengelig'
                                        ? `${inntekt.arbeidsgivernavn} (${inntekt.organisasjonsnummer})`
                                        : inntekt.organisasjonsnummer}
                                </BodyShort>
                            </td>
                            <td>
                                <InntektMedKilde>
                                    <BodyShort>
                                        {inntekt.omregnetÅrsinntekt
                                            ? somPenger(inntekt.omregnetÅrsinntekt.beløp)
                                            : 'Ukjent'}
                                    </BodyShort>
                                    {inntekt.omregnetÅrsinntekt && (
                                        <Kilde type={getKildeType(inntekt.omregnetÅrsinntekt.kilde)}>
                                            {kilde(inntekt.omregnetÅrsinntekt.kilde)}
                                        </Kilde>
                                    )}
                                </InntektMedKilde>
                            </td>
                        </ArbeidsgiverRad>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <Bold component="p">Total</Bold>
                        </td>
                        <td>
                            <Bold component="p">{somPenger(inntektsgrunnlag.omregnetÅrsinntekt)}</Bold>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Bold component="p">Sykepengegrunnlag</Bold>
                        </td>
                        <td>
                            <Bold component="p">{somPenger(inntektsgrunnlag.sykepengegrunnlag)}</Bold>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </Container>
    );
};
