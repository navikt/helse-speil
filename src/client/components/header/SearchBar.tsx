import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Search as SearchIcon } from '@navikt/ds-icons';

const Container = styled.div`
    position: relative;
`;

const SearchButton = styled.button`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    background: none;
    width: max-content;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;

    > svg > path {
        fill: var(--navds-color-gray-40);
    }

    &:hover svg path,
    &:focus svg path {
        fill: var(--navds-color-gray-10);
    }

    &:active,
    &:focus {
        outline: none;
    }

    &:active svg path {
        fill: var(--navds-color-gray-40);
    }
`;

const Input = styled.input`
    background: transparent;
    height: 32px;
    box-sizing: border-box;
    border: none;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px var(--navds-color-gray-40);
    padding: 0.5rem 2rem 0.5rem 0.5rem;
    font-size: 1rem;
    color: var(--navds-color-gray-10);

    &:hover {
        box-shadow: inset 0 0 0 1px var(--navds-color-gray-10);
    }

    &:active,
    &:focus {
        outline: none;
        box-shadow: inset 0 0 0 1px var(--navds-color-orange-40);
    }
`;

interface SearchBarProps {
    onSearch: (value: string) => Promise<any>;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [value, setValue] = useState('');

    const search = () => {
        if (value.length > 0) {
            onSearch(value.trim()).then(() => setValue(''));
        }
    };

    const onKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && value.length > 0) {
            search();
        }
    };

    const onChange = (event: React.ChangeEvent) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <Container>
            <Input onChange={onChange} onKeyPress={onKeyPress} value={value} />
            <SearchButton onClick={search}>
                <SearchIcon />
            </SearchButton>
        </Container>
    );
};
