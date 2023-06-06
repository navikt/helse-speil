import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';

interface RecoilProps {
    children?: React.ReactNode;
    initializeState?: (mutableSnapshot: MutableSnapshot) => void;
}

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

export const wrapperWithRecoilInitializer =
    (initializer: (mutableSnapshot: MutableSnapshot) => void): React.FC<ChildrenProps> =>
    ({ children }) => {
        return <RecoilWrapper initializeState={initializer}>{children}</RecoilWrapper>;
    };
