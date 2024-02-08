import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverinntekt, VilkarsgrunnlagInfotrygd } from '@io/graphql';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import styles from './SykepengegrunnlagFraInfotrygd.module.css';

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
        background-color: var(--a-gray-100);
        cursor: pointer;
        ${({ erGjeldende }) =>
            erGjeldende &&
            css`
                background-color: var(--speil-light-hover);
            `}
    }
`;

interface SykepengegrunnlagInfotrygdProps {
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygd;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagInfotrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
}: SykepengegrunnlagInfotrygdProps) => {
    return (
        <div className={styles.sykepengegrunnlag}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th />
                        <th>
                            <Bold>Inntektsgrunnlag</Bold>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <BodyShort as="p" className={styles.kolonnetittel}>
                                Inntektskilde
                            </BodyShort>
                        </th>
                        <th>
                            <BodyShort as="p" className={styles.kolonnetittel}>
                                Sykepengegrunnlag før 6G
                            </BodyShort>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {vilkårsgrunnlag.inntekter.map((inntekt, index) => (
                        <InfotrygdInntekt key={index} aktivtOrgnummer={organisasjonsnummer} inntekt={inntekt} />
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <Bold>Total</Bold>
                        </td>
                        <td>
                            <Bold>{somPenger(vilkårsgrunnlag.omregnetArsinntekt)}</Bold>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Bold>Sykepengegrunnlag</Bold>
                        </td>
                        <td>
                            <Bold>{somPenger(vilkårsgrunnlag.sykepengegrunnlag)}</Bold>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

interface InfotrygdInntektProps {
    aktivtOrgnummer: string;
    inntekt: Arbeidsgiverinntekt;
}

const InfotrygdInntekt = ({ aktivtOrgnummer, inntekt }: InfotrygdInntektProps) => {
    const arbeidsgivernavn = useArbeidsgiver(inntekt.arbeidsgiver)?.navn;
    return (
        <ArbeidsgiverRad erGjeldende={aktivtOrgnummer === inntekt.arbeidsgiver}>
            <td>
                <AnonymizableText>
                    {arbeidsgivernavn?.toLowerCase() === 'ikke tilgjengelig'
                        ? inntekt.arbeidsgiver
                        : `${arbeidsgivernavn} (${inntekt.arbeidsgiver})`}
                </AnonymizableText>
            </td>
            <td>
                <div className={styles.inntekt}>
                    <BodyShort>
                        {inntekt.omregnetArsinntekt ? somPenger(inntekt.omregnetArsinntekt.belop) : 'Ukjent'}
                    </BodyShort>
                    {inntekt.omregnetArsinntekt && (
                        <Kilde type={inntekt.omregnetArsinntekt.kilde}>
                            {kildeForkortelse(inntekt.omregnetArsinntekt.kilde)}
                        </Kilde>
                    )}
                </div>
            </td>
        </ArbeidsgiverRad>
    );
};
