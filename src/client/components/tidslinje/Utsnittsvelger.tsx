import React, { useLayoutEffect, useRef, useState } from 'react';
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
    flex: 1;
    border: none;
    border-bottom: 1px solid #c6c2bf;
`;

const ValgtUtsnittIndikator = styled.div<{ valgt?: boolean }>`
    position: relative;
    border-bottom: 1px solid #c6c2be;

    ${({ valgt }) =>
        valgt &&
        `
        &:before {
            position: absolute;
            content: '';
            height: 10px;
            width: 10px;
            left: 50%;
            top: 50%;
            border: 1px solid #c6c2be;
            border-right: none;
            border-bottom: none;
            box-sizing: border-box;
            background: #fff; 
            transform: translate(-50%, -50%) rotate(45deg);
        }
    `}
`;

interface UtsnittsvelgerProps {
    utsnitt: Tidslinjeutsnitt[];
    aktivtUtsnitt: number;
    setAktivtUtsnitt: (index: number) => void;
}

const useButtonWidth = () => {
    const ref = useRef<HTMLButtonElement>(null);
    const [width, setWidth] = useState<number>(0);

    useLayoutEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    }, [ref.current]);

    return { ref, width };
};

const useButtonWidths = () => {
    const { width: w1, ref: r1 } = useButtonWidth();
    const { width: w2, ref: r2 } = useButtonWidth();
    const { width: w3, ref: r3 } = useButtonWidth();
    return { widths: [w1, w2, w3], refs: [r1, r2, r3] };
};

export const Utsnittsvelger = ({ utsnitt, aktivtUtsnitt, setAktivtUtsnitt }: UtsnittsvelgerProps) => {
    const { widths, refs } = useButtonWidths();
    const toggles = utsnitt.map((utsnitt, i) => ({
        render: utsnitt.label,
        toggled: aktivtUtsnitt === i,
        onToggle: () => aktivtUtsnitt !== i && setAktivtUtsnitt(i),
        buttonRef: refs[i],
    }));
    return (
        <Container>
            <Togglegruppe toggles={toggles} />
            <Flex style={{ width: '100%', marginTop: '10px' }} alignItems="center">
                <Separator />
                <ValgtUtsnittIndikator valgt={aktivtUtsnitt === 0} style={{ width: `${widths[0] + 1}px` }} />
                <ValgtUtsnittIndikator valgt={aktivtUtsnitt === 1} style={{ width: `${widths[1] + 1}px` }} />
                <ValgtUtsnittIndikator valgt={aktivtUtsnitt === 2} style={{ width: `${widths[2] + 1}px` }} />
            </Flex>
        </Container>
    );
};
