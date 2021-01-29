import React, { ReactNode } from 'react';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import styled from '@emotion/styled';
import { Faresignal, Risikovurdering } from 'internal-types';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { GrøntSjekkikon } from '../../../components/ikoner/GrøntSjekkikon';
import { FlexColumn } from '../../../components/Flex';
import { Normaltekst } from 'nav-frontend-typografi';
import { Utropstegnikon } from '../../../components/ikoner/Utropstegnikon';
import { Sjekkikon } from '../../../components/ikoner/Sjekkikon';

const Container = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
`;

const Linje = styled.div`
    display: flex;
    align-items: start;
    flex-wrap: nowrap;
    margin-bottom: 1rem;

    &:first-of-type {
        margin-bottom: 1.5rem;
    }
`;

const IkonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    width: 2.5rem;
    min-height: 1.5rem;
`;

const Kolonne = styled(FlexColumn)`
    max-width: 480px;
    min-width: 480px;

    &:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

export const Faresignaler = ({ risikovurdering }: { risikovurdering: Risikovurdering }) => (
    <AgurkErrorBoundary sidenavn="Faresignaler">
        <Container className="faresignaler">
            {risikovurdering && risikovurdering.funn.length > 0 && (
                <Faresignalkategori
                    ikon={<Advarselikon />}
                    overskrift="Faresignaler oppdaget"
                    faresignaler={risikovurdering.funn}
                    vurderingIkon={<Utropstegnikon />}
                />
            )}
            {risikovurdering && risikovurdering.kontrollertOk.length > 0 && (
                <Faresignalkategori
                    ikon={<GrøntSjekkikon />}
                    overskrift="Faresignaler kontrollert"
                    faresignaler={risikovurdering.kontrollertOk}
                    vurderingIkon={<Sjekkikon />}
                />
            )}
        </Container>
    </AgurkErrorBoundary>
);

interface FaresignalkategoriProps {
    ikon: ReactNode;
    overskrift: String;
    faresignaler: Faresignal[];
    vurderingIkon: ReactNode;
}

const Faresignalkategori = ({ ikon, overskrift, faresignaler, vurderingIkon }: FaresignalkategoriProps) => (
    <Kolonne>
        <Linje>
            <IkonContainer>{ikon}</IkonContainer>
            <Normaltekst>{overskrift}</Normaltekst>
        </Linje>
        {faresignaler.map((faresignal, i) => (
            <Linje key={i}>
                <IkonContainer>{vurderingIkon}</IkonContainer>
                <Normaltekst>{faresignal.beskrivelse}</Normaltekst>
            </Linje>
        ))}
    </Kolonne>
);
