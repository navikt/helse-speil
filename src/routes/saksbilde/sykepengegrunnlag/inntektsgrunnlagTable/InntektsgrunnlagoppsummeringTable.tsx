import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { somPenger } from '@utils/locale';
import { Maybe } from '@utils/ts';

import { TableCell } from './TableCell';

import styles from './SykepengegrunnlagPanel.module.css';

interface InntektsgrunnlagoppsummeringTableProps {
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    avviksprosent?: Maybe<number>;
}

export const InntektsgrunnlagoppsummeringTable = ({
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    avviksprosent,
}: InntektsgrunnlagoppsummeringTableProps) => {
    return (
        <table className={classNames(styles.Table, styles.inntektsgrunnlagoppsummeringTable)}>
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
