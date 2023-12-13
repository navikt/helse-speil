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

interface VurderingsmomenterkategoriProps {
    ikon: ReactNode;
    overskrift: string;
    vurderingsmomenter: Faresignal[];
    vurderingIkon: ReactNode;
}

const VurderingsmomentKategori = ({
    ikon,
    overskrift,
    vurderingsmomenter,
    vurderingIkon,
}: VurderingsmomenterkategoriProps) => (
    <Kolonne>
        <Linje>
            <IkonContainer>{ikon}</IkonContainer>
            <BodyShort>{overskrift}</BodyShort>
        </Linje>
        {vurderingsmomenter.map((vurderingsmoment, i) => (
            <Linje key={i}>
                <IkonContainer>{vurderingIkon}</IkonContainer>
                <BodyShort>{vurderingsmoment.beskrivelse}</BodyShort>
            </Linje>
        ))}
    </Kolonne>
);

interface VurderingsmomenterWithContentProps {
    risikovurdering: Risikovurdering;
}

export const VurderingsmomenterWithContent: React.FC<VurderingsmomenterWithContentProps> = ({ risikovurdering }) => (
    <AgurkErrorBoundary sidenavn="Vurderingsmomenter">
        <Container>
            {risikovurdering && harFunn(risikovurdering.funn) && risikovurdering.funn.length > 0 && (
                <VurderingsmomentKategori
                    ikon={<Advarselikon />}
                    overskrift="Vurderingsmomenter oppdaget"
                    vurderingsmomenter={risikovurdering.funn}
                    vurderingIkon={<Utropstegnikon alt="Oppdaget" />}
                />
            )}
            {risikovurdering && (risikovurdering.kontrollertOk?.length ?? 0) > 0 && (
                <VurderingsmomentKategori
                    ikon={<GrøntSjekkikon />}
                    overskrift="Vurderingsmomenter kontrollert"
                    vurderingsmomenter={risikovurdering.kontrollertOk}
                    vurderingIkon={<Sjekkikon alt="Kontrollert" />}
                />
            )}
        </Container>
    </AgurkErrorBoundary>
);

const VurderingsmomenterContainer = () => {
    const activePeriod = useActivePeriod();

    if (isBeregnetPeriode(activePeriod) && activePeriod.risikovurdering) {
        return <VurderingsmomenterWithContent risikovurdering={activePeriod.risikovurdering} />;
    }

    return null;
};

const VurderingsmomenterSkeleton = () => {
    return <div />;
};

const VurderingsmomenterError = () => {
    return <div />;
};

export const Vurderingsmomenter = () => {
    return (
        <React.Suspense fallback={<VurderingsmomenterSkeleton />}>
            <ErrorBoundary fallback={<VurderingsmomenterError />}>
                <VurderingsmomenterContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};

export default Vurderingsmomenter;
