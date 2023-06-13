import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Sykepengegrunnlagsgrense } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { SykepengegrunnlagsgrenseView } from './SykepengegrunnlagsgrenseView';

import styles from './SykepengegrunnlagPanel.module.css';

interface InntektsgrunnlagoppsummeringTableProps {
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    avviksprosent?: Maybe<number>;
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
}

export const InntektsgrunnlagoppsummeringTable = ({
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    avviksprosent,
    sykepengegrunnlag,
    sykepengegrunnlagsgrense,
}: InntektsgrunnlagoppsummeringTableProps) => {
    return (
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
    );
};
