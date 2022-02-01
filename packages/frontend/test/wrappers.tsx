import React from 'react';
import { RecoilRoot, RecoilRootProps } from 'recoil';
import { MemoryRouter } from 'react-router';

export const RecoilWrapper: React.FC<RecoilRootProps> = ({ children, initializeState }) => {
    return <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>;
};

export const MemoryRouterWrapper: React.FC = ({ children }) => {
    return <MemoryRouter>{children}</MemoryRouter>;
};

export const RecoilAndRouterWrapper: React.FC<RecoilRootProps> = ({ children, initializeState }) => {
    return (
        <MemoryRouterWrapper>
            <RecoilWrapper initializeState={initializeState}>{children}</RecoilWrapper>
        </MemoryRouterWrapper>
    );
};
