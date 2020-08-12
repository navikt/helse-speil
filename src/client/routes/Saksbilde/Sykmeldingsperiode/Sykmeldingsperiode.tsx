import React, { useState } from 'react';
import styled from '@emotion/styled';
import Navigasjonsknapper from '../../../components/NavigationButtons';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import '@navikt/helse-frontend-tabell/lib/main.css';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';
import { OverstyrbarSykmeldingsperiodetabell } from './OverstyrbarSykmeldingsperiodetabell';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

export const Sykmeldingsperiode = () => {
    const [overstyrer, setOverstyrer] = useState(false);

    return (
        <Container>
            <ErrorBoundary>
                {overstyrer ? (
                    <OverstyrbarSykmeldingsperiodetabell toggleOverstyring={() => setOverstyrer((o) => !o)} />
                ) : (
                    <Sykmeldingsperiodetabell toggleOverstyring={() => setOverstyrer((o) => !o)} />
                )}
            </ErrorBoundary>
            {!overstyrer && <Navigasjonsknapper />}
        </Container>
    );
};
