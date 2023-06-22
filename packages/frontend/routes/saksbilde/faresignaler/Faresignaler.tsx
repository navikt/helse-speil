import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { AgurkErrorBoundary } from '@components/AgurkErrorBoundary';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { FlexColumn } from '@components/Flex';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Utropstegnikon } from '@components/ikoner/Utropstegnikon';
import { Faresignal, Maybe, Risikovurdering } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

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

const harFunn = (funn?: Maybe<Faresignal[]>): funn is Faresignal[] => {
    return typeof funn === 'object';
};

interface FaresignalkategoriProps {
    ikon: ReactNode;
    overskrift: string;
    faresignaler: Faresignal[];
    vurderingIkon: ReactNode;
}

const Faresignalkategori = ({ ikon, overskrift, faresignaler, vurderingIkon }: FaresignalkategoriProps) => (
    <Kolonne>
        <Linje>
            <IkonContainer>{ikon}</IkonContainer>
            <BodyShort>{overskrift}</BodyShort>
        </Linje>
        {faresignaler.map((faresignal, i) => (
            <Linje key={i}>
                <IkonContainer>{vurderingIkon}</IkonContainer>
                <BodyShort>{faresignal.beskrivelse}</BodyShort>
            </Linje>
        ))}
    </Kolonne>
);

interface FaresignalerWithContentProps {
    risikovurdering: Risikovurdering;
}

export const FaresignalerWithContent: React.FC<FaresignalerWithContentProps> = ({ risikovurdering }) => (
    <AgurkErrorBoundary sidenavn="Faresignaler">
        <Container className="faresignaler">
            {risikovurdering && harFunn(risikovurdering.funn) && risikovurdering.funn.length > 0 && (
                <Faresignalkategori
                    ikon={<Advarselikon />}
                    overskrift="Faresignaler oppdaget"
                    faresignaler={risikovurdering.funn}
                    vurderingIkon={<Utropstegnikon alt="Oppdaget" />}
                />
            )}
            {risikovurdering && (risikovurdering.kontrollertOk?.length ?? 0) > 0 && (
                <Faresignalkategori
                    ikon={<GrøntSjekkikon />}
                    overskrift="Faresignaler kontrollert"
                    faresignaler={risikovurdering.kontrollertOk}
                    vurderingIkon={<Sjekkikon alt="Kontrollert" />}
                />
            )}
        </Container>
    </AgurkErrorBoundary>
);

const FaresignalerContainer = () => {
    const activePeriod = useActivePeriod();

    if (isBeregnetPeriode(activePeriod) && activePeriod.risikovurdering) {
        return <FaresignalerWithContent risikovurdering={activePeriod.risikovurdering} />;
    }

    return null;
};

const FaresignalerSkeleton = () => {
    return <div />;
};

const FaresignalerError = () => {
    return <div />;
};

export const Faresignaler = () => {
    return (
        <React.Suspense fallback={<FaresignalerSkeleton />}>
            <ErrorBoundary fallback={<FaresignalerError />}>
                <FaresignalerContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};

export default Faresignaler;
