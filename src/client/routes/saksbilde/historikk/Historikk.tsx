import styled from '@emotion/styled';
import React, { useLayoutEffect, useState } from 'react';

import { CloseButton } from '../../../components/CloseButton';

import { NotatListeModal } from '../../oversikt/table/rader/notat/NotatListeModal';
import { NyttNotatModal } from '../../oversikt/table/rader/notat/NyttNotatModal';
import { HistorikkHendelse } from './HistorikkHendelse';
import { useHistorikk, useOppdaterHistorikk, useShowHistorikkState } from './state';

const Container = styled.div`
    grid-area: høyremeny;
    overflow: hidden;
    transition: width 0.2s ease;
`;

const HistorikkTitle = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    font-size: 14px;
`;

const Hendelser = styled.ul`
    padding: 0 1.5rem 2rem;
    box-sizing: border-box;
    border-left: 1px solid var(--navds-color-border);
    height: 100%;
`;

interface HistorikkProps {
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    tildeling?: Tildeling;
}

export const Historikk = ({ vedtaksperiodeId, tildeling, personinfo }: HistorikkProps) => {
    const historikk = useHistorikk();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showNotatListeModal, setShowNotatListeModal] = useState(false);
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);

    useLayoutEffect(() => {
        if (showHistorikk) {
            document.documentElement.style.setProperty('--speil-hoyremeny-width', '272px');
        } else {
            document.documentElement.style.setProperty('--speil-hoyremeny-width', '0px');
        }
    }, [showHistorikk]);

    useOppdaterHistorikk(() => setShowNotatListeModal(true));

    return (
        <Container>
            <Hendelser>
                <HistorikkTitle>
                    HISTORIKK
                    <CloseButton onClick={() => setShowHistorikk(false)} />
                </HistorikkTitle>
                {showNotatListeModal && (
                    <NotatListeModal
                        vedtaksperiodeId={vedtaksperiodeId}
                        onClose={() => setShowNotatListeModal(false)}
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
        </Container>
    );
};
