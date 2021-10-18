import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Link } from '@navikt/ds-react';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 3em);

    p {
        font-size: 1.5rem;
        padding: 0.5rem;
    }
`;

export const IkkeLoggetInn = () => (
    <Container>
        <BodyShort as="p">Du må logge inn for å få tilgang til systemet</BodyShort>
        <BodyShort as="p">
            <Link href="/">Gå til innloggingssiden</Link>
        </BodyShort>
    </Container>
);
