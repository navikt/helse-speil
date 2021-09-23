import styled from '@emotion/styled';
import React, { useLayoutEffect, useState } from 'react';

import { CloseButton } from '../../../components/CloseButton';
import { Endringslogg } from '../../../components/Endringslogg';
import { useVedtaksperiode } from '../../../state/tidslinje';

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

export const Historikk = React.memo(({ vedtaksperiodeId, tildeling, personinfo }: HistorikkProps) => {
    const historikk = useHistorikk();
    const vedtaksperiode = useVedtaksperiode(vedtaksperiodeId);
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showNotatListeModal, setShowNotatListeModal] = useState(false);
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);
    const [showEndringslogg, setShowEndringslogg] = useState(false);

    const [endring, setEndring] = useState<Overstyring | null>(null);

    useLayoutEffect(() => {
        if (showHistorikk) {
            document.documentElement.style.setProperty('--speil-hoyremeny-width', '272px');
        } else {
            document.documentElement.style.setProperty('--speil-hoyremeny-width', '0px');
        }
    }, [showHistorikk]);

    useOppdaterHistorikk({
        onClickNotat: () => setShowNotatListeModal(true),
        onClickEndring: setEndring,
    });

    return (
        <>
            <Container>
                <Hendelser>
                    <HistorikkTitle>
                        HISTORIKK
                        <CloseButton onClick={() => setShowHistorikk(false)} />
                    </HistorikkTitle>
                    {historikk.map((it) => (
                        <HistorikkHendelse key={it.id} {...it} />
                    ))}
                </Hendelser>
            </Container>
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
                    vedtaksperiodeId={vedtaksperiodeId}
                    onClose={() => setShowNyttNotatModal(false)}
                    personinfo={personinfo}
                    navigerTilbake={() => {
                        setShowNotatListeModal(true);
                        setShowNyttNotatModal(false);
                    }}
                />
            )}
            <Endringslogg
                overstyringer={
                    endring?.overstyrteDager.map((it) => ({
                        timestamp: it.dato,
                        navn: endring.saksbehandlerNavn,
                        ident: endring.saksbehandlerIdent,
                        begrunnelse: endring.begrunnelse,
                        grad: it.grad,
                        type: it.type,
                    })) ?? []
                }
                isOpen={endring !== null}
                onRequestClose={() => setEndring(null)}
            />
        </>
    );
});
