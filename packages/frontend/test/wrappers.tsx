import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';

import { MockedProvider, MockedResponse } from '@apollo/client/testing';

interface RecoilProps {
    children?: React.ReactNode;
    initializeState?: (mutableSnapshot: MutableSnapshot) => void;
}

export type ApolloProps = RecoilProps & {
    mocks?: MockedResponse[];
};

export const ApolloWrapper: React.FC<ApolloProps> = ({ children, initializeState, mocks }) => {
    return (
        <MockedProvider mocks={mocks}>
            <RecoilAndRouterWrapper children={children} initializeState={initializeState} />
        </MockedProvider>
    );
};

export const RecoilWrapper: React.FC<RecoilProps> = ({ children, initializeState }) => {
    return <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>;
};

export const MemoryRouterWrapper: React.FC<ChildrenProps> = ({ children }) => {
    return <MemoryRouter>{children}</MemoryRouter>;
};

export const RecoilAndRouterWrapper: React.FC<RecoilProps> = ({ children, initializeState }) => {
    return (
        <MemoryRouterWrapper>
            <RecoilWrapper initializeState={initializeState}>{children}</RecoilWrapper>
        </MemoryRouterWrapper>
    );
};

// Denne brukes bare i test, så her har det ikke noe å si
// eslint-disable-next-line react-refresh/only-export-components
export const wrapperWithRecoilInitializer =
    (initializer: (mutableSnapshot: MutableSnapshot) => void): React.FC<ChildrenProps> =>
    ({ children }) => {
        return <RecoilWrapper initializeState={initializer}>{children}</RecoilWrapper>;
    };
