import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { Utbetalingstabelldag, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { helgetyper } from '../utbetaling/utbetalingstabell/helgUtils';

import styles from './Row.module.scss';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    erAvvist?: boolean;
    erAGP?: boolean;
    type?: Utbetalingstabelldagtype;
    markertDag?: Utbetalingstabelldag;
    nyDag?: boolean;
    erHelg?: boolean;
}

export const Row = ({
    children,
    erAvvist = false,
    erAGP = false,
    type,
    markertDag,
    nyDag = false,
    erHelg = false,
    className = '',
}: RowProps): ReactElement => {
    const viseHelgStil = (type && [...helgetyper, 'Helg'].includes(type)) || erHelg;
    return (
        <Table.Row
            className={classNames(
                styles.row,
                markertDag && styles.markert,
                viseHelgStil && styles.helg,
                erAvvist && styles.avvist,
                erAGP && styles.agp,
                nyDag && styles.nydag,
                className,
            )}
        >
            {children}
        </Table.Row>
    );
};
