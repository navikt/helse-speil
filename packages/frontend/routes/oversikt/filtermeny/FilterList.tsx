import classNames from 'classnames';
import React, { MouseEvent, useState } from 'react';

import { Accordion, Checkbox } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { Filter, useSetMultipleFilters, useToggleFilter } from '../table/state/filter';

import styles from './FilterList.module.css';

interface FilterListProps extends React.HTMLAttributes<HTMLButtonElement> {
    filters: Filter<OppgaveTilBehandling>[];
    text: string;
}

export const FilterList = ({ filters, text }: FilterListProps) => {
    const setFilters = useSetMultipleFilters();
    const toggleFilter = useToggleFilter();
    const [open, setOpen] = useState(true);

    const allFiltersAreActive = filters.every((it) => it.active);

    const toggleAllFilters = (event: MouseEvent<HTMLSpanElement>) => {
        event.stopPropagation();
        setFilters(!allFiltersAreActive, ...filters.map((it) => it.label));
    };

    return (
        <Accordion.Item defaultOpen className={styles.liste}>
            <Accordion.Header onClick={() => setOpen(!open)} className={styles.header}>
                <Checkbox
                    className={styles.checkbox}
                    size="medium"
                    checked={allFiltersAreActive}
                    onClick={toggleAllFilters}
                >
                    {text}
                </Checkbox>
            </Accordion.Header>
            <Accordion.Content className={classNames(styles.innhold)}>
                {filters.map((it) => (
                    <Checkbox
                        className={styles.checkbox}
                        size="medium"
                        checked={it.active}
                        onChange={() => toggleFilter(it.label)}
                    >
                        {it.label}
                    </Checkbox>
                ))}
            </Accordion.Content>
        </Accordion.Item>
    );
};
