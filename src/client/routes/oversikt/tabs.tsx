import React from 'react';
import styled from '@emotion/styled';
import { atom, useRecoilState } from 'recoil';

export const tabState = atom<'alle' | 'mine'>({
    key: 'tabState',
    default: 'alle',
});

const Tablist = styled.div`
    border-bottom: 1px solid var(--navds-color-border);
    margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    font-family: inherit;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--navds-color-text-primary);
    cursor: pointer;
    transition: box-shadow 0.1s ease;
    box-shadow: inset 0 0 0 0 var(--navds-color-action-default);
    outline: none;

    &:hover,
    &:focus {
        color: var(--navds-color-action-default);
    }

    ${({ active }) => active && `box-shadow: inset 0 -5px 0 0 var(--navds-color-action-default);`}
`;

const AlleSakerTab = () => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    return (
        <Tab
            role="tab"
            aria-selected={aktivTab === 'alle'}
            active={aktivTab === 'alle'}
            onClick={() => setAktivTab('alle')}
        >
            Saker
        </Tab>
    );
};

const MineSakerTab = () => {
    const [aktivTab, setAktivTab] = useRecoilState(tabState);
    return (
        <Tab
            role="tab"
            aria-selected={aktivTab === 'mine'}
            active={aktivTab === 'mine'}
            onClick={() => setAktivTab('mine')}
        >
            Mine saker
        </Tab>
    );
};

export const Tabs = () => (
    <Tablist>
        <AlleSakerTab />
        <MineSakerTab />
    </Tablist>
);
