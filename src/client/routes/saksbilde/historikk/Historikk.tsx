import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import React from 'react';

import { CloseButton } from '../../../components/CloseButton';

import { HistorikkHendelse } from './HistorikkHendelse';
import { useHistorikk, useOppdaterHistorikk, useShowHistorikkState } from './state';

const HistorikkTitle = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    font-size: 14px;
`;

const Hendelser = styled.ul`
    width: var(--historikk-width);
    min-width: var(--historikk-width);
    flex: 1;
    padding: 0 24px;
    box-sizing: border-box;
`;

export const Historikk = () => {
    const historikk = useHistorikk();

    const [show, setShow] = useShowHistorikkState();

    useOppdaterHistorikk();

    return (
        <motion.div
            initial={{ width: show ? 'var(--historikk-width)' : 0 }}
            animate={{ width: show ? 'var(--historikk-width)' : 0 }}
            transition={{
                type: 'tween',
                duration: 0.2,
                ease: 'easeInOut',
            }}
            style={{
                overflow: 'visible',
                borderLeft: '1px solid var(--navds-color-border)',
                boxSizing: 'border-box',
            }}
        >
            <Hendelser>
                <HistorikkTitle>
                    HISTORIKK
                    <CloseButton onClick={() => setShow(false)} />
                </HistorikkTitle>
                {historikk.map((it) => (
                    <HistorikkHendelse key={it.id} {...it} />
                ))}
            </Hendelser>
        </motion.div>
    );
};
