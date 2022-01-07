import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { FlexColumn } from '../../../components/Flex';
import { Kilde } from '../../../components/Kilde';
import { useArbeidsgivernavnRender, useOrganisasjonsnummerRender } from '../../../state/person';
import { getKildeType, kilde } from '../../../utils/inntektskilde';
import { somPenger } from '../../../utils/locale';

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

interface SykepengegrunnlagInfotrygdProps {
    vilkårsgrunnlag: ExternalInfotrygdVilkårsgrunnlag;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagInfotrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
}: SykepengegrunnlagInfotrygdProps) => {
    return (
        <Container className="SykepengegrunnlagInfotrygd">
            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            <Bold as="p">Inntektsgrunnlag</Bold>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <Kolonnetittel as="p">Inntektskilde</Kolonnetittel>
                        </th>
                        <th>
                            <Kolonnetittel as="p">Sykepengegrunnlag før 6G</Kolonnetittel>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {vilkårsgrunnlag.inntekter.map((inntekt, index) => (
                        <InfotrygdInntekt index={index} aktivtOrgnummer={organisasjonsnummer} inntekt={inntekt} />
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <Bold as="p">Total</Bold>
                        </td>
                        <td>
                            <Bold as="p">{somPenger(vilkårsgrunnlag.omregnetÅrsinntekt)}</Bold>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Bold as="p">Sykepengegrunnlag</Bold>
                        </td>
                        <td>
                            <Bold as="p">{somPenger(vilkårsgrunnlag.sykepengegrunnlag)}</Bold>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </Container>
    );
};

interface InfotrygdInntektProps {
    index: number;
    aktivtOrgnummer: string;
    inntekt: ExternalArbeidsgiverinntekt;
}

const InfotrygdInntekt = ({ index, aktivtOrgnummer, inntekt }: InfotrygdInntektProps) => {
    const arbeidsgivernavn = useArbeidsgivernavnRender(inntekt.organisasjonsnummer);
    const renderedOrganisasjonsnummer = useOrganisasjonsnummerRender(inntekt.organisasjonsnummer);
    return (
        <ArbeidsgiverRad key={index} erGjeldende={aktivtOrgnummer === inntekt.organisasjonsnummer}>
            <td>
                <BodyShort>
                    {arbeidsgivernavn.toLowerCase() === 'ikke tilgjengelig'
                        ? renderedOrganisasjonsnummer
                        : `${arbeidsgivernavn} (${renderedOrganisasjonsnummer})`}
                </BodyShort>
            </td>
            <td>
                <InntektMedKilde>
                    <BodyShort>
                        {inntekt.omregnetÅrsinntekt ? somPenger(inntekt.omregnetÅrsinntekt.beløp) : 'Ukjent'}
                    </BodyShort>
                    {inntekt.omregnetÅrsinntekt && (
                        <Kilde type={getKildeType(inntekt.omregnetÅrsinntekt.kilde)}>
                            {kilde(inntekt.omregnetÅrsinntekt.kilde)}
                        </Kilde>
                    )}
                </InntektMedKilde>
            </td>
        </ArbeidsgiverRad>
    );
};
