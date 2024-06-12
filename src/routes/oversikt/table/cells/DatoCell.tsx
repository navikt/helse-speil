import classNames from 'classnames';
import React from 'react';

import { Table } from '@navikt/ds-react';

import { NORSK_DATOFORMAT, somDato } from '@utils/date';
import { Maybe } from '@utils/ts';

import styles from './DatoCell.module.css';

interface DatoProps {
    date: Maybe<string>;
    erUtgåttDato: boolean;
}

export const DatoCell = ({ date, erUtgåttDato }: DatoProps) => (
    <Table.DataCell className={classNames(styles.datocell, erUtgåttDato && styles.utgåttfrist)}>
        {date && `${somDato(date).format(NORSK_DATOFORMAT)}`}
    </Table.DataCell>
);
