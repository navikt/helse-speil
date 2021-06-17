import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { Hendelsetype } from './Historikk.types';
import IconDokumenter from './icons/IconDokumenter.svg';
import IconHistorikk from './icons/IconHistorikk.svg';
import { useFilterState, useShowHistorikkState } from './state';

const Header = styled.div`
    --historikk-header-height: 48px;
    display: flex;
    justify-content: flex-end;
    height: var(--historikk-header-height);
    box-sizing: border-box;
`;

const TabButton = styled.button<{ active: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--historikk-header-height);
    width: var(--historikk-header-height);
    box-sizing: border-box;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
    border-bottom: 1px solid var(--navds-color-border);
    transition: background-color 0.1s ease;

    &:hover {
        background-color: var(--navds-color-gray-10);
    }

    &:active {
        background-color: var(--navds-color-gray-20);
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 3px var(--navds-text-focus);
    }

    &:before {
        position: absolute;
        content: '';
        background: var(--navds-color-action-default);
        bottom: 0;
        left: 0;
        height: 0;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        width: var(--historikk-header-height);
        transition: height 0.1s ease;
    }

    ${(props) =>
        props.active &&
        css`
            &:before {
                height: 4px;
            }
        `}
`;

export const HistorikkHeader = () => {
    const [filter, setFilter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();

    return (
        <Header>
            {showHistorikk ? (
                <>
                    <TabButton
                        active={filter === Hendelsetype.Historikk}
                        onClick={() => setFilter(Hendelsetype.Historikk)}
                    >
                        <IconHistorikk />
                    </TabButton>
                    <TabButton
                        active={filter === Hendelsetype.Dokument}
                        onClick={() => setFilter(Hendelsetype.Dokument)}
                    >
                        <IconDokumenter />
                    </TabButton>
                </>
            ) : (
                <>
                    <TabButton
                        active={false}
                        onClick={() => {
                            setFilter(Hendelsetype.Historikk);
                            setShowHistorikk(true);
                        }}
                    >
                        <IconHistorikk />
                    </TabButton>
                    <TabButton
                        active={false}
                        onClick={() => {
                            setFilter(Hendelsetype.Dokument);
                            setShowHistorikk(true);
                        }}
                    >
                        <IconDokumenter />
                    </TabButton>
                </>
            )}
        </Header>
    );
};
