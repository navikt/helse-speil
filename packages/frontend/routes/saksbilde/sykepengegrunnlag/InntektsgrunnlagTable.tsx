import styled from '@emotion/styled';
import React, { Dispatch, SetStateAction } from 'react';
import { BodyShort } from '@navikt/ds-react';

import { FlexColumn } from '@components/Flex';
import { Bold } from '@components/Bold';
import { somPenger } from '@utils/locale';
import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';

import { Inntektssammenligning } from './Inntektssammenligning';
import { SykepengegrunnlagsgrenseView } from './SykepengegrunnlagsgrenseView';

const Container = styled(FlexColumn)`
    --fixed-column-width: 14rem;
`;

const RightAligned = styled(BodyShort)`
    text-align: right;
`;

const BoldRightAligned = styled(Bold)`
    text-align: right;
`;

const Kolonnetittel = styled(BodyShort)`
    color: var(--navds-global-color-gray-600);
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
        border-top: 1px solid var(--navds-semantic-color-text);
    }
`;

interface InntektsgrunnlaginnholdProps {
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    avviksprosent?: Maybe<number>;
    sykepengegrunnlag: number;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    aktivInntektskilde?: Arbeidsgiverinntekt;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const InntektsgrunnlagTable = ({
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    avviksprosent,
    sykepengegrunnlag,
    setAktivInntektskilde,
    aktivInntektskilde,
    sykepengegrunnlagsgrense,
}: InntektsgrunnlaginnholdProps) => {
    return (
        <Container className="Inntektsgunnlaginnhold">
            <Table>
                <thead>
                    <tr>
                        <th />
                        <th>
                            <Bold>Inntektsgrunnlag</Bold>
                        </th>
                        <th>
                            <Bold>Sammenligningsgrunnlag</Bold>
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
                    {inntekter.map((inntekt, index) => (
                        <Inntektssammenligning
                            key={index}
                            organisasjonsnummer={inntekt.arbeidsgiver}
                            omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                            sammenligningsgrunnlag={inntekt.sammenligningsgrunnlag}
                            arbeidsforholdErDeaktivert={inntekt.deaktivert}
                            erGjeldende={aktivInntektskilde?.arbeidsgiver == inntekt.arbeidsgiver}
                            onSetAktivInntektskilde={() => setAktivInntektskilde(inntekt)}
                        />
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <Bold>Total</Bold>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '3.5rem' }}>
                            <Bold>{somPenger(omregnetÅrsinntekt)}</Bold>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '2.25rem' }}>
                            <Bold>{somPenger(sammenligningsgrunnlag)}</Bold>
                        </td>
                    </tr>
                </tfoot>
            </Table>
            <Table style={{ marginBottom: '0' }}>
                <tbody>
                    <tr>
                        <td>
                            <BodyShort>Total omregnet årsinntekt</BodyShort>
                        </td>
                        <td>
                            <RightAligned as="p">{somPenger(omregnetÅrsinntekt)}</RightAligned>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <BodyShort>Total rapportert årsinntekt</BodyShort>
                        </td>
                        <td>
                            <RightAligned as="p">{somPenger(sammenligningsgrunnlag)}</RightAligned>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <Bold>Utregnet avvik</Bold>
                        </td>
                        <td>
                            <BoldRightAligned>
                                {avviksprosent ? `${Math.floor(avviksprosent)} %` : '-'}
                            </BoldRightAligned>
                        </td>
                    </tr>
                    <br />
                    <br />
                    <tr>
                        <td style={{ paddingBottom: 0 }}>
                            <Bold>Sykepengegrunnlag</Bold>
                        </td>
                        <td style={{ paddingBottom: 0 }}>
                            <BoldRightAligned>{somPenger(sykepengegrunnlag)}</BoldRightAligned>
                        </td>
                    </tr>
                    <tr>
                        {omregnetÅrsinntekt != null && (
                            <td colSpan={4} style={{ paddingTop: 0 }}>
                                <SykepengegrunnlagsgrenseView
                                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                                />
                            </td>
                        )}
                    </tr>
                </tfoot>
            </Table>
        </Container>
    );
};
