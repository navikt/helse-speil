import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Navigasjonsknapper } from '../../../components/Navigasjonsknapper';
import '@navikt/helse-frontend-tabell/lib/main.css';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';
import { OverstyrbarSykmeldingsperiodetabell } from './OverstyrbarSykmeldingsperiodetabell';
import { OverstyringTimeoutModal } from './OverstyringTimeoutModal';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;
`;

export const Sykmeldingsperiode = () => {
    const [overstyrer, setOverstyrer] = useState(false);
    const [kalkulerer, setKalkulerer] = useState(false);
    const [overstyringTimedOut, setOverstyringTimedOut] = useState(false);

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
                    />
                ) : (
                    <Sykmeldingsperiodetabell toggleOverstyring={() => setOverstyrer((o) => !o)} />
                )}
            </AgurkErrorBoundary>
            {overstyringTimedOut && <OverstyringTimeoutModal onRequestClose={() => setOverstyringTimedOut(false)} />}
            {!overstyrer && <Navigasjonsknapper />}
        </Container>
    );
};
