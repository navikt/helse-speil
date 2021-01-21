import React, { ReactNode } from 'react';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import styled from '@emotion/styled';
import { Risikovurdering } from 'internal-types';
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

interface FaresignalerProps {
    risikovurdering: Risikovurdering;
}

export const Faresignaler = ({ risikovurdering }: FaresignalerProps) => (
    <AgurkErrorBoundary sidenavn="Faresignaler">
        <Container className="faresignaler">
            <Faresignalkategori
                ikon={<Advarselikon />}
                overskrift="Faresignaler oppdaget"
                vurderinger={risikovurdering.arbeidsuførhetvurdering}
                vurderingIkon={<Utropstegnikon />}
            />
            <Faresignalkategori
                ikon={<GrøntSjekkikon />}
                overskrift="Faresignaler kontrollert"
                vurderinger={risikovurdering.arbeidsuførhetvurdering}
                vurderingIkon={<Sjekkikon />}
            />
        </Container>
    </AgurkErrorBoundary>
);

interface FaresignalkategoriProps {
    ikon: ReactNode;
    overskrift: String;
    vurderinger: String[];
    vurderingIkon: ReactNode;
}

const Faresignalkategori = ({ ikon, overskrift, vurderinger, vurderingIkon }: FaresignalkategoriProps) => (
    <Kolonne>
        <Linje>
            <IkonContainer>{ikon}</IkonContainer>
            <Normaltekst>{overskrift}</Normaltekst>
        </Linje>
        {vurderinger.map((vurdering) => (
            <Linje>
                <IkonContainer>{vurderingIkon}</IkonContainer>
                <Normaltekst>{vurdering}</Normaltekst>
            </Linje>
        ))}
    </Kolonne>
);
