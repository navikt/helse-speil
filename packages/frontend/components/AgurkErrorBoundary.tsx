import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from './ErrorBoundary';
import { Clipboard } from './clipboard';

const Container = styled.div`
    margin: 2rem;

    > *:not(:last-child) {
        margin-bottom: 2.5rem;
    }
`;
const Agurktekst = styled(BodyShort)`
    display: flex;
    align-items: center;

    &:before {
        content: '🥒';
        font-size: 30px;
        margin-right: 0.5rem;
    }
`;
const Utviklermelding = styled.span`
    display: flex;
    align-items: center;
    color: var(--a-text-default);

    :hover .Clipboard__children {
        border-bottom: none;
    }
`;
const Feilmelding = styled.p`
    display: block;
    white-space: pre;
    margin: 1em 0;
    background-color: var(--a-surface-danger-subtle);
    color: var(--a-text-danger);
    padding: 1rem;
`;

interface ErrorInnholdProps {
    errormelding?: string;
    sidenavn?: string;
}

const ErrorInnhold: React.FC<ErrorInnholdProps> = ({ sidenavn, errormelding }) => {
    const ref = useRef<HTMLParagraphElement>(null);
    return (
        <Container>
            <Agurktekst as="p">
                Det har dessverre oppstått en feil, og for denne perioden kan ikke {sidenavn ?? 'siden'} vises.
            </Agurktekst>
            <div>
                <Utviklermelding>
                    Feilmelding til utviklere (<Clipboard copySource={ref}>trykk på ikonet for å kopiere:</Clipboard>
                    ):
                </Utviklermelding>
                <Feilmelding className="typo-undertekst" ref={ref}>
                    {errormelding}
                </Feilmelding>
            </div>
        </Container>
    );
};

interface AgurkErrorBoundaryProps extends ChildrenProps {
    sidenavn?: string;
}

export const AgurkErrorBoundary: React.FC<AgurkErrorBoundaryProps> = ({ children, sidenavn }) => {
    const [errormelding, setErrormelding] = useState<string | undefined>();
    if (!children) return null;
    return (
        <ErrorBoundary
            fallback={<ErrorInnhold errormelding={errormelding} sidenavn={sidenavn} />}
            onError={(error: Error) => setErrormelding(error.stack)}
        >
            {children}
        </ErrorBoundary>
    );
};
