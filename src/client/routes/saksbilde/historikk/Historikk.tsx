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
    --speil-historikk-width: 272px;
    width: var(--speil-historikk-width);
    min-width: var(--speil-historikk-width);
    max-width: var(--speil-historikk-width);
    flex: 1;
    flex-shrink: 0;
    padding: 0 24px;
    box-sizing: border-box;
`;

export const Historikk = () => {
    const historikk = useHistorikk();

    const [show, setShow] = useShowHistorikkState();

    useOppdaterHistorikk();

    return (
        <motion.div
            initial={false}
            animate={{ width: show ? 'var(--speil-historikk-width)' : 0 }}
            transition={{
                type: 'tween',
                duration: 0.2,
                ease: 'easeInOut',
            }}
            style={{
                overflow: 'visible',
                borderLeft: '1px solid var(--navds-color-border)',
                boxSizing: 'border-box',
                maxWidth: 'var(--speil-historikk-width)',
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
