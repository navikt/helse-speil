import React, { ReactPropTypes, createRef } from 'react';
import styled from '@emotion/styled';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Clipboard } from './Clipboard';

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
    margin: 1em 0px;
    background-color: #fff0f0;
    color: #ff0000;
    padding: 1rem;
`;

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

type ErrorBoundaryProps = {
    sidenavn?: string;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    errorMessageRef: React.RefObject<HTMLParagraphElement>;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
        this.errorMessageRef = createRef();
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {}

    componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
        if (prevProps !== this.props && prevState !== this.state) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ hasError: false });
        }
    }

    render() {
        return this.state.hasError ? (
            <Container>
                <Agurktekst>
                    Det har dessverre oppstått en feil, og for denne perioden kan ikke {this.props.sidenavn ?? 'siden'}{' '}
                    vises.
                </Agurktekst>
                <div>
                    <Utviklermelding>
                        Feilmelding til utviklere (
                        <Clipboard copySource={this.errorMessageRef}>trykk på ikonet for å kopiere:</Clipboard>
                        ):
                    </Utviklermelding>
                    <Feilmelding className="typo-undertekst" ref={this.errorMessageRef}>
                        {this.state.error?.stack}
                    </Feilmelding>
                </div>
            </Container>
        ) : (
            this.props.children
        );
    }
}
