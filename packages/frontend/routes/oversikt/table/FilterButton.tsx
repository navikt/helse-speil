import React, { useRef, useState } from 'react';

import { Collapse, Expand } from '@navikt/ds-icons';
import { Checkbox, Popover } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { Filter, useSetMultipleFilters, useToggleFilter } from './state/filter';

import styles from './FilterButton.module.css';

interface FilterButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    filters: Filter<OppgaveTilBehandling>[];
}

export const FilterButton = ({ children, filters }: FilterButtonProps) => {
    const [active, setActive] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const setFilters = useSetMultipleFilters();
    const toggleFilter = useToggleFilter();

    const allFiltersAreActive = filters.every((it) => it.active);

    const toggleAllFilters = () => {
        setFilters(!allFiltersAreActive, ...filters.map((it) => it.label));
    };

    const togglePopover = () => setActive(!active);

    const closePopover = () => setActive(false);

    return (
        <>
            <button className={styles.FilterButton} onClick={togglePopover} ref={buttonRef}>
                {children}
                {active ? <Collapse title="Lukk" /> : <Expand title="Ekspander" />}
            </button>
            <Popover
                open={active}
                anchorEl={buttonRef.current}
                onClose={closePopover}
                placement="bottom-start"
                arrow={false}
                offset={0}
            >
                <ul className={styles.FilterList}>
                    <li>
                        <Checkbox
                            className={styles.Checkbox}
                            size="small"
                            checked={allFiltersAreActive}
                            onChange={toggleAllFilters}
                        >
                            Velg alle
                        </Checkbox>
                    </li>
                    <hr />
                    {filters.map((it) => (
                        <li key={it.label}>
                            <Checkbox
                                className={styles.Checkbox}
                                size="small"
                                checked={it.active}
                                onChange={() => toggleFilter(it.label)}
                            >
                                {it.label}
                            </Checkbox>
                        </li>
                    ))}
                </ul>
            </Popover>
        </>
    );
};
