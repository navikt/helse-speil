import styled from '@emotion/styled';
import React from 'react';

import { Togglegruppe } from '@navikt/helse-frontend-toggle';
import '@navikt/helse-frontend-toggle/lib/main.css';

import { Tidslinjeutsnitt } from './Tidslinje.types';

const Container = styled.div`
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

interface UtsnittsvelgerProps {
    utsnitt: Tidslinjeutsnitt[];
    aktivtUtsnitt: number;
    setAktivtUtsnitt: (index: number) => void;
}

export const LasterUtsnittsvelger = () => (
    <Container>
        <Togglegruppe toggles={[{ render: '6 mnd' }, { render: '1 år' }, { render: '3 år' }]} />
    </Container>
);

export const Utsnittsvelger = React.memo(({ utsnitt, aktivtUtsnitt, setAktivtUtsnitt }: UtsnittsvelgerProps) => {
    const toggles = utsnitt.map((utsnitt, i) => ({
        render: utsnitt.label,
        toggled: aktivtUtsnitt === i,
        onToggle: () => aktivtUtsnitt !== i && setAktivtUtsnitt(i),
    }));

    return (
        <Container>
            <Togglegruppe toggles={toggles} />
        </Container>
    );
});
