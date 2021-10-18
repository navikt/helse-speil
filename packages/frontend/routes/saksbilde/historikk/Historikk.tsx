import styled from '@emotion/styled';
import React, { useLayoutEffect, useState } from 'react';

import { CloseButton } from '../../../components/CloseButton';
import { EndringsloggOverstyrtInntekt } from '../../../components/EndringsloggOverstyrtInntekt';
import { EndringsloggOverstyrteDager } from '../../../components/EndringsloggOverstyrteDager';
import { useNotaterForVedtaksperiode } from '../../../state/notater';

import { NotatListeModal } from '../../oversikt/table/rader/notat/NotatListeModal';
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
    const notaterForPeriode = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showNotatListeModal, setShowNotatListeModal] = useState(false);

    const [endring, setEndring] = useState<Overstyring | null>(null);
    const [inntektendring, setInntektendring] = useState<ExternalInntektoverstyring | null>(null);

    useLayoutEffect(() => {
        if (showHistorikk) {
            document.documentElement.style.setProperty('--speil-hoyremeny-width', '272px');
        } else {
            document.documentElement.style.setProperty('--speil-hoyremeny-width', '0px');
        }
    }, [showHistorikk]);

    useOppdaterHistorikk({
        onClickNotat: () => setShowNotatListeModal(true),
        onClickTidslinjeendring: setEndring,
        onClickInntektendring: setInntektendring,
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
                    notater={notaterForPeriode}
                    personinfo={personinfo}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onClose={() => setShowNotatListeModal(false)}
                    erPåVent={tildeling?.påVent}
                />
            )}
            <EndringsloggOverstyrteDager
                endringer={
                    endring?.overstyrteDager.map((it) => ({
                        timestamp: endring.timestamp,
                        navn: endring.saksbehandlerNavn,
                        ident: endring.saksbehandlerIdent,
                        begrunnelse: endring.begrunnelse,
                        grad: it.grad,
                        type: it.type,
                        dato: it.dato,
                    })) ?? []
                }
                isOpen={endring !== null}
                onRequestClose={() => setEndring(null)}
            />
            {inntektendring && (
                <EndringsloggOverstyrtInntekt
                    endringer={[
                        {
                            skjæringstidspunkt: inntektendring.overstyrtInntekt.skjæringstidspunkt,
                            månedligInntekt: inntektendring.overstyrtInntekt.månedligInntekt,
                            forklaring: inntektendring.overstyrtInntekt.forklaring,
                            begrunnelse: inntektendring.begrunnelse,
                            saksbehandlerIdent: inntektendring.saksbehandlerIdent ?? inntektendring.saksbehandlerNavn,
                            timestamp: inntektendring.timestamp,
                        },
                    ]}
                    isOpen={inntektendring !== null}
                    onRequestClose={() => setInntektendring(null)}
                />
            )}
        </>
    );
});
