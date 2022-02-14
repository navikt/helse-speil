import styled from '@emotion/styled';
import React, { useLayoutEffect, useState } from 'react';

import { useNotaterForVedtaksperiode } from '@state/notater';
import { CloseButton } from '@components/CloseButton';
import { EndringsloggOverstyrteDager } from '@components/EndringsloggOverstyrteDager';
import { EndringsloggOverstyrtInntektEllerArbeidsforhold } from '@components/EndringsloggOverstyrtInntektEllerArbeidsforhold';

import { NotatListeModal } from '../../oversikt/table/rader/notat/NotatListeModal';
import { HistorikkHendelse } from './HistorikkHendelse';
import { filterState, useHistorikk, useOppdaterHistorikk, useShowHistorikkState } from './state';
import { Hendelsetype } from './Historikk.types';
import { useRecoilValue } from 'recoil';

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
    personinfo: Personinfo;
    tildeling?: Tildeling;
    vedtaksperiodeId?: string;
}

export const Historikk = React.memo(({ vedtaksperiodeId, tildeling, personinfo }: HistorikkProps) => {
    const historikk = useHistorikk();
    const notaterForPeriode = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showNotatListeModal, setShowNotatListeModal] = useState(false);
    const filter = useRecoilValue(filterState);

    const [endring, setEndring] = useState<Overstyring | null>(null);
    const [inntektendring, setInntektendring] = useState<ExternalInntektoverstyring | null>(null);
    const [arbeidsforholdendring, setArbeidsforholdendring] = useState<ExternalArbeidsforholdoverstyring | null>(null);

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
        onClickArbeidsforholdendring: setArbeidsforholdendring,
    });

    const tittel = Hendelsetype[filter] === 'Dokument' ? 'DOKUMENTER' : 'HISTORIKK';

    return (
        <>
            <Container>
                <Hendelser>
                    <HistorikkTitle>
                        {tittel}
                        <CloseButton onClick={() => setShowHistorikk(false)} />
                    </HistorikkTitle>
                    {historikk.map((it) => (
                        <HistorikkHendelse key={it.id} {...it} />
                    ))}
                </Hendelser>
            </Container>
            {vedtaksperiodeId && showNotatListeModal && (
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

            {(inntektendring || arbeidsforholdendring) && (
                <EndringsloggOverstyrtInntektEllerArbeidsforhold
                    inntektsendringer={
                        inntektendring
                            ? [
                                  {
                                      skjæringstidspunkt: inntektendring.overstyrtInntekt.skjæringstidspunkt,
                                      månedligInntekt: inntektendring.overstyrtInntekt.månedligInntekt,
                                      forklaring: inntektendring.overstyrtInntekt.forklaring,
                                      begrunnelse: inntektendring.begrunnelse,
                                      saksbehandlerIdent:
                                          inntektendring.saksbehandlerIdent ?? inntektendring.saksbehandlerNavn,
                                      timestamp: inntektendring.timestamp,
                                      type: 'Inntekt',
                                  },
                              ]
                            : []
                    }
                    arbeidsforholdendringer={
                        arbeidsforholdendring
                            ? [
                                  {
                                      skjæringstidspunkt:
                                          arbeidsforholdendring.overstyrtArbeidsforhold.skjæringstidspunkt,
                                      deaktivert: arbeidsforholdendring.overstyrtArbeidsforhold.deaktivert,
                                      forklaring: arbeidsforholdendring.overstyrtArbeidsforhold.forklaring,
                                      begrunnelse: arbeidsforholdendring.begrunnelse,
                                      saksbehandlerIdent:
                                          arbeidsforholdendring.saksbehandlerIdent ??
                                          arbeidsforholdendring.saksbehandlerNavn,
                                      timestamp: arbeidsforholdendring.timestamp,
                                      type: 'Arbeidsforhold',
                                  },
                              ]
                            : []
                    }
                    isOpen={inntektendring !== null || arbeidsforholdendring !== null}
                    onRequestClose={() => {
                        setInntektendring(null);
                        setArbeidsforholdendring(null);
                    }}
                />
            )}
        </>
    );
});
