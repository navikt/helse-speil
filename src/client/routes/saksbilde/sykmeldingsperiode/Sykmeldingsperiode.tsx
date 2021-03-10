import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import '@navikt/helse-frontend-tabell/lib/main.css';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';
import { OverstyrbarSykmeldingsperiodetabell } from './OverstyrbarSykmeldingsperiodetabell';
import { OverstyringTimeoutModal } from './OverstyringTimeoutModal';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { usePerson } from '../../../state/person';
import { kalkulererToastKey, kalkuleringFerdigToast } from './kalkuleringstoasts';
import { useAddToast, useRemoveToast } from '../../../state/toasts';
import { nyesteOpptegnelseMedTypeOppgaveState } from '../../../state/opptegnelser';
import { useRecoilValue } from 'recoil';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
`;

export const Sykmeldingsperiode = () => {
    const person = usePerson();
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const [overstyrer, setOverstyrer] = useState(false);
    const [kalkulerer, setKalkulerer] = useState(false);
    const [overstyringTimedOut, setOverstyringTimedOut] = useState(false);
    const leggtilEnToast = useAddToast();
    const fjernToast = useRemoveToast();
    const opptegnelser = useRecoilValue(nyesteOpptegnelseMedTypeOppgaveState);

    useEffect(() => {
        if (opptegnelser && kalkulerer) {
            leggtilEnToast(kalkuleringFerdigToast({ callback: () => fjernToast(kalkulererToastKey) }));
            setKalkulerer(false);
        }
    }, [opptegnelser]);

    useEffect(() => {
        let timeoutId: any;
        if (kalkulerer) {
            timeoutId = setTimeout(() => setOverstyringTimedOut(true), 10000);
        }
        return () => {
            !!timeoutId && clearTimeout(timeoutId);
        };
    }, [kalkulerer]);

    return (
        <Container className="Sykmeldingsperiode">
            <AgurkErrorBoundary>
                {overstyrer ? (
                    <OverstyrbarSykmeldingsperiodetabell
                        onOverstyr={() => {
                            setOverstyrer(false);
                            setKalkulerer(true);
                        }}
                        onToggleOverstyring={() => setOverstyrer((o) => !o)}
                        originaleDager={aktivVedtaksperiode?.sykdomstidslinje}
                    />
                ) : (
                    person &&
                    aktivVedtaksperiode && (
                        <Sykmeldingsperiodetabell
                            person={person}
                            vedtaksperiode={aktivVedtaksperiode}
                            toggleOverstyring={() => setOverstyrer((o) => !o)}
                        />
                    )
                )}
            </AgurkErrorBoundary>
            {overstyringTimedOut && <OverstyringTimeoutModal onRequestClose={() => setOverstyringTimedOut(false)} />}
        </Container>
    );
};
