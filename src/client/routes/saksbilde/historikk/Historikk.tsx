import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { Personinfo, TildelingType } from 'internal-types';
import React from 'react';
import { useState } from 'react';

import { CloseButton } from '../../../components/CloseButton';

import { NotatListeModal } from '../../oversikt/table/rader/notat/NotatListeModal';
import { NyttNotatModal } from '../../oversikt/table/rader/notat/NyttNotatModal';
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

interface HistorikkProps {
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    tildeling?: TildelingType;
}

export const Historikk = ({ vedtaksperiodeId, tildeling, personinfo }: HistorikkProps) => {
    const historikk = useHistorikk();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showNotatListeModal, setShowNotatListeModal] = useState(false);
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);

    useOppdaterHistorikk(() => setShowNotatListeModal(true));

    return (
        <AnimatePresence initial={false}>
            {showHistorikk && (
                <motion.div
                    key="historikk"
                    initial={{ width: 0 }}
                    animate={{ width: 'var(--speil-historikk-width)' }}
                    exit={{ width: 0 }}
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
                            <CloseButton onClick={() => setShowHistorikk(false)} />
                        </HistorikkTitle>
                        {showNotatListeModal && (
                            <NotatListeModal
                                vedtaksperiodeId={vedtaksperiodeId}
                                lukk={() => setShowNotatListeModal(false)}
                                åpneNyttNotatModal={() => setShowNyttNotatModal(true)}
                                tildeling={tildeling}
                            />
                        )}
                        {showNyttNotatModal && (
                            <NyttNotatModal
                                lukkModal={() => setShowNyttNotatModal(false)}
                                personinfo={personinfo}
                                vedtaksperiodeId={vedtaksperiodeId}
                                navigerTilbake={() => {
                                    setShowNotatListeModal(true);
                                    setShowNyttNotatModal(false);
                                }}
                            />
                        )}
                        {historikk.map((it) => (
                            <HistorikkHendelse key={it.id} {...it} />
                        ))}
                    </Hendelser>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
