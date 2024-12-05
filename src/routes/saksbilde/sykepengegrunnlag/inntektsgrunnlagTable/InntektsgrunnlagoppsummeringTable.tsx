import classNames from 'classnames';
import React from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { somPenger } from '@utils/locale';
import { avviksprosentVisning } from '@utils/tall';

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
        <Table className={classNames(styles.Table, styles.inntektsgrunnlagoppsummeringTable)}>
            <Table.Body className={styles.InntektsgrunnlagTableBody}>
                <Table.Row className={styles.oppsummeringRow}>
                    <TableCellText text="Total omregnet årsinntekt" />
                    <Table.DataCell align="right" className={styles.pengeCell}>
                        <BodyShort>{somPenger(omregnetÅrsinntekt)}</BodyShort>
                    </Table.DataCell>
                </Table.Row>
                <Table.Row className={styles.oppsummeringRow}>
                    <TableCellText text="Total rapportert årsinntekt" />
                    <Table.DataCell align="right" className={styles.pengeCell}>
                        <BodyShort>{somPenger(sammenligningsgrunnlag)}</BodyShort>
                    </Table.DataCell>
                </Table.Row>
            </Table.Body>
            <tfoot>
                <Table.Row>
                    <TableCellBold text="Utregnet avvik" />
                    <Table.DataCell align="right" className={styles.pengeCell}>
                        <BodyShort weight="semibold">
                            {avviksprosent ? avviksprosentVisning(avviksprosent) : '-'}
                        </BodyShort>
                    </Table.DataCell>
                </Table.Row>
            </tfoot>
        </Table>
    );
};

interface TableCellTextProps {
    text: string;
}

const TableCellText = ({ text }: TableCellTextProps) => (
    <Table.DataCell>
        <BodyShort>{text}</BodyShort>
    </Table.DataCell>
);

interface TableCellBoldProps {
    text: string;
}

const TableCellBold = ({ text }: TableCellBoldProps) => (
    <Table.DataCell>
        <BodyShort weight="semibold">{text}</BodyShort>
    </Table.DataCell>
);
