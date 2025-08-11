import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { erHelg } from '@utils/date';

import styles from './Row.module.scss';

interface RowProps extends PropsWithChildren {
    dag: Utbetalingstabelldag;
    erMarkert: boolean;
    erOverstyrt: boolean;
}

export const Row = ({ children, dag, erMarkert, erOverstyrt }: RowProps): ReactElement => {
    return (
        <Table.Row
            className={classNames(
                styles.row,
                erMarkert && styles.markert,
                erHelg(dag.dato) && styles.helg,
                !erOverstyrt && (dag.erAvvist || dag.erForeldet) && styles.avvist,
                (dag.erAGP || dag.erVenteperiode) && styles.agpEllerVenteperiode,
                (dag.erNyDag ?? false) && styles.nydag,
            )}
        >
            {children}
        </Table.Row>
    );
};
