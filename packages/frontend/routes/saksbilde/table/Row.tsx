import styles from './Row.module.scss';
import classNames from 'classnames';
import React from 'react';

import { helgetyper } from '../utbetaling/utbetalingstabell/helgUtils';

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
}: RowProps) => {
    const viseHelgStil = (type && [...helgetyper, 'Helg'].includes(type)) || erHelg;
    return (
        <tr
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
        </tr>
    );
};
