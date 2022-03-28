import React from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router';

interface RecoilProps {
    initializeState?: (mutableSnapshot: MutableSnapshot) => void;
}

export const RecoilWrapper: React.FC<RecoilProps> = ({ children, initializeState }) => {
    return <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>;
};

export const MemoryRouterWrapper: React.FC = ({ children }) => {
    return <MemoryRouter>{children}</MemoryRouter>;
};

export const RecoilAndRouterWrapper: React.FC<RecoilProps> = ({ children, initializeState }) => {
    return (
        <MemoryRouterWrapper>
            <RecoilWrapper initializeState={initializeState}>{children}</RecoilWrapper>
        </MemoryRouterWrapper>
    );
};
