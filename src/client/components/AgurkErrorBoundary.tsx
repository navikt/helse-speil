import React, { PropsWithChildren, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';
import { Clipboard } from './clipboard';
import { ErrorBoundary } from './ErrorBoundary';

const Container = styled.div`
    margin: 2rem;
    > *:not(:last-child) {
        margin-bottom: 2.5rem;
    }
`;
const Agurktekst = styled(Normaltekst)`
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
    color: #3e3832;
    :hover .Clipboard__children {
        border-bottom: none;
    }
`;
const Feilmelding = styled.p`
    display: block;
    white-space: pre;
    margin: 1em 0;
    background-color: #fff0f0;
    color: #ff0000;
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
            <Agurktekst>
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

export const AgurkErrorBoundary: React.FC<PropsWithChildren<any>> = ({ children }) => {
    const [errormelding, setErrormelding] = useState<string | undefined>();
    if (!children) return null;
    return (
        <ErrorBoundary
            fallback={<ErrorInnhold errormelding={errormelding} />}
            onError={(error: Error) => setErrormelding(error.stack)}
        >
            {children}
        </ErrorBoundary>
    );
};
