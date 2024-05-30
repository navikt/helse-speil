import classNames from 'classnames';
import React, { useState } from 'react';

import { Accordion, Checkbox } from '@navikt/ds-react';

import { Bold } from '@components/Bold';

import { Filter, useToggleFilter } from '../table/state/filter';

import styles from './FilterList.module.css';

interface FilterListProps extends React.HTMLAttributes<HTMLButtonElement> {
    filters: Filter[];
    text: string;
}

export const FilterList = ({ filters, text }: FilterListProps) => {
    const toggleFilter = useToggleFilter();
    const [open, setOpen] = useState(true);

    return (
        <Accordion>
            <Accordion.Item defaultOpen className={styles.liste}>
                <Accordion.Header onClick={() => setOpen(!open)} className={styles.header}>
                    <Bold>{text}</Bold>
                </Accordion.Header>
                <Accordion.Content className={classNames(styles.innhold)}>
                    {filters.map((it) => (
                        <Checkbox
                            className={styles.checkbox}
                            size="medium"
                            checked={it.active}
                            onChange={() => toggleFilter(it.label)}
                            key={it.key}
                        >
                            {it.label}
                        </Checkbox>
                    ))}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
