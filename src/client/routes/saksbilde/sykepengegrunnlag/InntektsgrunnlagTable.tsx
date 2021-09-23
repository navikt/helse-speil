import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { FlexColumn } from '../../../components/Flex';
import { somPenger } from '../../../utils/locale';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { Inntektssammenligning } from './Inntektssammenligning';

interface InntektsgrunnlaginnholdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    anonymiseringEnabled: boolean;
    aktivInntektskilde: Arbeidsgiverinntekt;
    setAktivInntektskilde: (inntektskilde: Arbeidsgiverinntekt) => void;
}

const Container = styled(FlexColumn)`
    --fixed-column-width: 14rem;
`;

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

const RightAligned = styled(BodyShort)`
    text-align: right;
`;

const BoldRightAligned = styled(Bold)`
    text-align: right;
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

export const InntektsgrunnlagTable = ({
    inntektsgrunnlag,
    anonymiseringEnabled,
    aktivInntektskilde,
    setAktivInntektskilde,
}: InntektsgrunnlaginnholdProps) => (
    <Container className="Inntektsgunnlaginnhold">
        <Table>
            <thead>
                <tr>
                    <th />
                    <th>
                        <Bold as="p">Inntektsgrunnlag</Bold>
                    </th>
                    <th>
                        <Bold as="p">Sammenligningsgrunnlag</Bold>
                    </th>
                </tr>
                <tr>
                    <th>
                        <Kolonnetittel as="p">Inntektskilde</Kolonnetittel>
                    </th>
                    <th>
                        <Kolonnetittel as="p">Omregnet årsinntekt</Kolonnetittel>
                    </th>
                    <th>
                        <Kolonnetittel as="p">Rapportert årsinntekt</Kolonnetittel>
                    </th>
                </tr>
            </thead>
            <tbody>
                {inntektsgrunnlag.inntekter.map((inntekt, index) => (
                    <Inntektssammenligning
                        onSetAktivInntektskilde={() => setAktivInntektskilde(inntekt)}
                        key={inntekt.organisasjonsnummer + index}
                        arbeidsgiver={
                            anonymiseringEnabled
                                ? `${getAnonymArbeidsgiverForOrgnr(inntekt.organisasjonsnummer).navn}`
                                : inntekt.arbeidsgivernavn.toLowerCase() !== 'ikke tilgjengelig'
                                ? `${inntekt.arbeidsgivernavn} (${inntekt.organisasjonsnummer})`
                                : inntekt.organisasjonsnummer
                        }
                        omregnetÅrsinntekt={inntekt.omregnetÅrsinntekt}
                        sammenligningsgrunnlag={inntekt.sammenligningsgrunnlag}
                        erGjeldende={aktivInntektskilde.organisasjonsnummer === inntekt.organisasjonsnummer}
                    />
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <Bold as="p">Total</Bold>
                    </td>
                    <td>
                        <Bold as="p">{somPenger(inntektsgrunnlag.omregnetÅrsinntekt)}</Bold>
                    </td>
                    <td>
                        <Bold as="p">{somPenger(inntektsgrunnlag.sammenligningsgrunnlag)}</Bold>
                    </td>
                </tr>
            </tfoot>
        </Table>
        <Table>
            <tbody>
                <tr>
                    <td>
                        <BodyShort>Total omregnet årsinntekt</BodyShort>
                    </td>
                    <td>
                        <RightAligned as="p">{somPenger(inntektsgrunnlag.omregnetÅrsinntekt)}</RightAligned>
                    </td>
                </tr>
                <tr>
                    <td>
                        <BodyShort>Total rapportert årsinntekt</BodyShort>
                    </td>
                    <td>
                        <RightAligned as="p">{somPenger(inntektsgrunnlag.sammenligningsgrunnlag)}</RightAligned>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <Bold as="p">Utregnet avvik</Bold>
                    </td>
                    <td>
                        <BoldRightAligned as="p">
                            {inntektsgrunnlag.avviksprosent ? `${Math.floor(inntektsgrunnlag.avviksprosent)} %` : '-'}
                        </BoldRightAligned>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Bold as="p">Sykepengegrunnlag</Bold>
                    </td>
                    <td>
                        <BoldRightAligned as="p">{somPenger(inntektsgrunnlag.sykepengegrunnlag)}</BoldRightAligned>
                    </td>
                </tr>
            </tfoot>
        </Table>
    </Container>
);
