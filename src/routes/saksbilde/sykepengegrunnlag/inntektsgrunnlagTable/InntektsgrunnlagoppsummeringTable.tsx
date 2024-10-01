import classNames from 'classnames';
import React from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { somPenger } from '@utils/locale';

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
        <Table className={classNames(styles.Table, styles.inntektsgrunnlagoppsummeringTable)}>
            <Table.Body>
                <Table.Row className={styles.oppsummeringRow}>
                    <TableCellText text="Total omregnet årsinntekt" />
                    <TableCell content={<BodyShort>{somPenger(omregnetÅrsinntekt)}</BodyShort>} />
                </Table.Row>
                <Table.Row>
                    <TableCellText text="Total rapportert årsinntekt" />
                    <TableCell content={<BodyShort>{somPenger(sammenligningsgrunnlag)}</BodyShort>} />
                </Table.Row>
            </Table.Body>
            <tfoot>
                <Table.Row className={styles.PaddedRow}>
                    <TableCellBold text="Utregnet avvik" />
                    <TableCell
                        content={
                            <BodyShort weight="semibold">
                                {avviksprosent ? `${Math.floor(avviksprosent)} %` : '-'}
                            </BodyShort>
                        }
                    />
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
