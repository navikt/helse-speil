import React from 'react';
import { Tidslinjeutsnitt } from './Tidslinje.types';
import { Togglegruppe } from '@navikt/helse-frontend-toggle';
import '@navikt/helse-frontend-toggle/lib/main.css';
import styled from '@emotion/styled';
import { Flex } from '../Flex';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: 2px;
`;

const Separator = styled.hr`
    width: 100%;
    border: none;
    border-bottom: 1px solid #c6c2bf;
`;

const ValgtUtsnittIndikator = styled.div<{ valgt?: boolean }>`
    position: relative;
    width: 50px;
    border-bottom: 1px solid #c6c2be;

    ${({ valgt }) =>
        valgt &&
        `
        &:before {
            position: absolute;
            content: '';
            height: 10px;
            width: 10px;
            border: 1px solid #c6c2be;
            border-right: none;
            border-bottom: none;
            box-sizing: border-box;
            background: #fff; 
            left: 50%;
            transform: translateX(-50%) translateY(-50%) rotate(45deg);
        }
    `}
`;

interface UtsnittsvelgerProps {
    utsnitt: Tidslinjeutsnitt[];
    aktivtUtsnitt: number;
    setAktivtUtsnitt: (index: number) => void;
}

export const Utsnittsvelger = ({ utsnitt, aktivtUtsnitt, setAktivtUtsnitt }: UtsnittsvelgerProps) => {
    const toggles = utsnitt.map((utsnitt, i) => ({
        render: utsnitt.label,
        toggled: aktivtUtsnitt === i,
        onToggle: () => aktivtUtsnitt !== i && setAktivtUtsnitt(i),
    }));
    return (
        <Container>
            <Togglegruppe toggles={toggles} />
        </Container>
    );
};
