import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Sykepengegrunnlagsgrense } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { SykepengegrunnlagsgrenseView } from './SykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';
import { TableCell } from './TableCell';

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
        <table className={styles.Table}>
            <tbody>
                <tr className={styles.oppsummeringRow}>
                    <TableCellText text="Total omregnet årsinntekt" />
                    <TableCell content={<BodyShort>{somPenger(omregnetÅrsinntekt)}</BodyShort>} />
                </tr>
                <tr>
                    <TableCellText text="Total rapportert årsinntekt" />
                    <TableCell content={<BodyShort>{somPenger(sammenligningsgrunnlag)}</BodyShort>} />
                </tr>
            </tbody>
            <tfoot>
                <tr className={styles.PaddedRow}>
                    <TableCellBold text="Utregnet avvik" />
                    <TableCell content={<Bold>{avviksprosent ? `${Math.floor(avviksprosent)} %` : '-'}</Bold>} />
                </tr>
                <tr className={styles.sykepengegrunnlagRow}>
                    <TableCellBold text="Sykepengegrunnlag" />
                    <TableCell content={<Bold className={styles.rightAligned}>{somPenger(sykepengegrunnlag)}</Bold>} />
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

interface TableCellTextProps {
    text: string;
}

const TableCellText = ({ text }: TableCellTextProps) => (
    <td>
        <BodyShort>{text}</BodyShort>
    </td>
);

interface TableCellBoldProps {
    text: string;
}

const TableCellBold = ({ text }: TableCellBoldProps) => (
    <td>
        <Bold>{text}</Bold>
    </td>
);
