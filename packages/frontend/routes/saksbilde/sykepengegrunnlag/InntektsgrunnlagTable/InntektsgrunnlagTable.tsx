import React, { Dispatch, SetStateAction } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { Inntektssammenligning } from './Inntektssammenligning';
import { SykepengegrunnlagsgrenseView } from './SykepengegrunnlagsgrenseView';

import styles from './InntektsgrunnlagTable.module.css';

interface InntektsgrunnlagTableProps {
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    avviksprosent?: Maybe<number>;
    sykepengegrunnlag: number;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    aktivInntektskilde?: Arbeidsgiverinntekt;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const InntektsgrunnlagTable: React.FC<InntektsgrunnlagTableProps> = ({
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    avviksprosent,
    sykepengegrunnlag,
    setAktivInntektskilde,
    aktivInntektskilde,
    sykepengegrunnlagsgrense,
}) => {
    return (
        <div className={styles.InntektsgrunnlagTable}>
            <table className={styles.Table}>
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
                            <BodyShort className={styles.ColumnTitle}>Inntektskilde</BodyShort>
                        </th>
                        <th>
                            <BodyShort className={styles.ColumnTitle}>Omregnet årsinntekt</BodyShort>
                        </th>
                        <th>
                            <BodyShort className={styles.ColumnTitle}>Rapportert årsinntekt</BodyShort>
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
            </table>
            <table className={styles.Table} style={{ marginBottom: '0' }}>
                <tbody>
                    <tr>
                        <td>
                            <BodyShort>Total omregnet årsinntekt</BodyShort>
                        </td>
                        <td>
                            <BodyShort className={styles.rightAligned}>{somPenger(omregnetÅrsinntekt)}</BodyShort>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <BodyShort>Total rapportert årsinntekt</BodyShort>
                        </td>
                        <td>
                            <BodyShort className={styles.rightAligned}>{somPenger(sammenligningsgrunnlag)}</BodyShort>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className={styles.PaddedRow}>
                        <td>
                            <Bold>Utregnet avvik</Bold>
                        </td>
                        <td>
                            <Bold className={styles.rightAligned}>
                                {avviksprosent ? `${Math.floor(avviksprosent)} %` : '-'}
                            </Bold>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ paddingBottom: 0 }}>
                            <Bold>Sykepengegrunnlag</Bold>
                        </td>
                        <td style={{ paddingBottom: 0 }}>
                            <Bold className={styles.rightAligned}>{somPenger(sykepengegrunnlag)}</Bold>
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
            </table>
        </div>
    );
};
