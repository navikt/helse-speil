import classNames from 'classnames';
import React, { Dispatch, SetStateAction, useMemo } from 'react';

import { Checkbox } from '@navikt/ds-react';

import { dagKanOverstyres } from './RadmarkeringCheckbox';

import styles from './MarkerAlleDagerCheckbox.module.css';

const useOverstyrbareDager = (
    alleDager: Map<DateString, UtbetalingstabellDag>,
    skjæringstidspunkt: DateString
): Map<DateString, UtbetalingstabellDag> => {
    return useMemo(
        () =>
            Array.from(alleDager.entries()).reduce(
                (dager, [key, dag]) =>
                    dagKanOverstyres(dag.dato, dag.erAGP, dag.erForeldet, dag.type, skjæringstidspunkt)
                        ? dager.set(key, dag)
                        : dager,
                new Map()
            ),
        [alleDager]
    );
};

interface MarkerAlleDagerCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    alleDager: Map<string, UtbetalingstabellDag>;
    markerteDager: Map<string, UtbetalingstabellDag>;
    setMarkerteDager: Dispatch<SetStateAction<Map<string, UtbetalingstabellDag>>>;
    skjæringstidspunkt: string;
}

export const MarkerAlleDagerCheckbox: React.FC<MarkerAlleDagerCheckboxProps> = ({
    alleDager,
    markerteDager,
    setMarkerteDager,
    skjæringstidspunkt,
    ...rest
}) => {
    const overstyrbareDager = useOverstyrbareDager(alleDager, skjæringstidspunkt);

    const hasSelectedSome = markerteDager.size > 0 && markerteDager.size !== overstyrbareDager.size;

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setMarkerteDager(overstyrbareDager);
        } else {
            setMarkerteDager(new Map());
        }
    };

    return (
        <div className={styles.MarkerAlleDagerCheckbox}>
            <Checkbox
                className={classNames(styles.Checkbox, hasSelectedSome && styles.partial)}
                onChange={onChange}
                checked={overstyrbareDager.size === markerteDager.size}
                {...rest}
                hideLabel
            >
                Marker alle dager
            </Checkbox>
        </div>
    );
};
