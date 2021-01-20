import React, { ReactNode } from 'react';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import styled from '@emotion/styled';
import { Vedtaksperiode } from 'internal-types';
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
    vedtaksperiode?: Vedtaksperiode;
}

export const Faresignaler = ({ vedtaksperiode }: FaresignalerProps) => {
    if (!vedtaksperiode) return null;

    return (
        <AgurkErrorBoundary sidenavn="Faresignaler">
            <Container className="faresignaler">
                {vedtaksperiode.risikovurdering?.arbeidsuførhetvurdering && (
                    <Faresignalkategori
                        ikon={<Advarselikon />}
                        overskrift="Faresignaler oppdaget"
                        vurderinger={vedtaksperiode.risikovurdering.arbeidsuførhetvurdering}
                        vurderingIkon={<Utropstegnikon />}
                        testid="faresignaler-oppdaget"
                    />
                )}
                {vedtaksperiode.risikovurdering?.arbeidsuførhetvurdering && (
                    <Faresignalkategori
                        ikon={<GrøntSjekkikon />}
                        overskrift="Faresignaler kontrollert"
                        vurderinger={vedtaksperiode.risikovurdering.arbeidsuførhetvurdering}
                        vurderingIkon={<Sjekkikon />}
                        testid="faresignaler-kontrollert"
                    />
                )}
            </Container>
        </AgurkErrorBoundary>
    );
};

interface FaresignalkategoriProps {
    ikon: ReactNode;
    overskrift: String;
    vurderinger: String[];
    vurderingIkon: ReactNode;
    testid: String;
}

const Faresignalkategori = ({ ikon, overskrift, vurderinger, vurderingIkon, testid }: FaresignalkategoriProps) => {
    return (
        <Kolonne data-testid={testid}>
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
};
