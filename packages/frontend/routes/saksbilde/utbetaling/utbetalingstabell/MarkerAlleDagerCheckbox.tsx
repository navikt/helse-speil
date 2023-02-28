import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useMemo } from 'react';

import { Checkbox } from '@navikt/ds-react';

import { erDev, erLocal } from '@utils/featureToggles';

import styles from './MarkerAlleDagerCheckbox.module.css';

const dagKanOverstyres = (type: Utbetalingstabelldagtype, dato: DateString, skjæringstidspunkt: DateString) =>
    (!dayjs(dato).isSame(skjæringstidspunkt, 'day') &&
        type !== 'Helg' &&
        ['Syk', 'Ferie', 'Egenmelding'].includes(type)) ||
    ((erDev() || erLocal()) && ['Permisjon', 'Arbeid'].includes(type));

const useOverstyrbareDager = (
    alleDager: Map<DateString, UtbetalingstabellDag>,
    skjæringstidspunkt: DateString
): Map<DateString, UtbetalingstabellDag> => {
    return useMemo(
        () =>
            Array.from(alleDager.entries()).reduce(
                (dager, [key, dag]) =>
                    dagKanOverstyres(dag.type, dag.dato, skjæringstidspunkt) ? dager.set(key, dag) : dager,
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
