import styled from '@emotion/styled';
import { Oppgave } from 'internal-types';
import React, { useRef, useState } from 'react';

import NavFrontendChevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';

import { Popover } from '@navikt/ds-react';

import { Filter, useSetMultipleFilters, useToggleFilter } from './state/filter';

const Button = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    font-size: 1rem;
    cursor: pointer;
    background: none;
    user-select: none;
    color: var(--navds-color-text-primary);
    border: 1px solid #78706a;
    padding: 0 0.5rem;
    height: 2rem;
    border-radius: 0.25rem;
    transition: box-shadow 0.1s ease;

    &:focus {
        outline: none;
        box-shadow: var(--navds-shadow-focus);
    }
`;

const Chevron = styled(NavFrontendChevron)`
    margin-left: 0.5rem;
`;

const FilterList = styled.ul`
    padding: 0.5rem 1rem 0.5rem 0.75rem;
    margin: 0;
    list-style: none;
`;

const FilterListItem = styled.li`
    padding: 0;
    margin: 0.5rem 0;
`;

const Separator = styled.hr`
    margin: 1rem -1rem 1rem -0.75rem;
`;

const CheckboxMini = styled(Checkbox)`
    input[type='checkbox'] + label::before {
        width: 1.25rem;
        height: 1.25rem;
        box-sizing: border-box;
    }
`;

interface FilterButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    filters: Filter<Oppgave>[];
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
            <Button onClick={togglePopover} ref={buttonRef}>
                {children}
                <Chevron type={active ? 'opp' : 'ned'} />
            </Button>
            <Popover
                open={active}
                anchorEl={buttonRef.current}
                onClose={closePopover}
                placement="bottom-start"
                arrow={false}
                offset={0}
            >
                <FilterList>
                    <FilterListItem>
                        <CheckboxMini label="Velg alle" checked={allFiltersAreActive} onChange={toggleAllFilters} />
                    </FilterListItem>
                    <Separator />
                    {filters.map((it) => (
                        <FilterListItem key={it.label}>
                            <CheckboxMini
                                label={it.label}
                                checked={it.active}
                                onChange={() => toggleFilter(it.label)}
                            />
                        </FilterListItem>
                    ))}
                </FilterList>
            </Popover>
        </>
    );
};
