import React, { PropsWithChildren, ReactElement } from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';

import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { BrukerContext } from '@auth/brukerContext';

interface RecoilProps {
    initializeState?: (mutableSnapshot: MutableSnapshot) => void;
}

export type ApolloProps = RecoilProps & {
    mocks?: MockedResponse[];
};

export const ApolloWrapper = ({ children, initializeState, mocks }: PropsWithChildren<ApolloProps>): ReactElement => {
    return (
        <MockedProvider mocks={mocks}>
            <RecoilWrapper initializeState={initializeState}>{children}</RecoilWrapper>
        </MockedProvider>
    );
};

export const RecoilWrapper = ({ children, initializeState }: PropsWithChildren<RecoilProps>): ReactElement => {
    return (
        <BrukerContext.Provider
            value={{
                oid: 'test-oid',
                epost: 'test-username',
                navn: 'Test User',
                ident: 'Otest123',
                grupper: ['test-group'],
            }}
        >
            <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
        </BrukerContext.Provider>
    );
};

export const wrapperWithRecoilInitializer =
    (initializer: (mutableSnapshot: MutableSnapshot) => void) =>
    // eslint-disable-next-line react/display-name
    ({ children }: PropsWithChildren): ReactElement => {
        return <RecoilWrapper initializeState={initializer}>{children}</RecoilWrapper>;
    };

export const TestCellWrapper = ({ children }: PropsWithChildren): ReactElement => (
    <table>
        <tbody>
            <tr>{children}</tr>
        </tbody>
    </table>
);

export const TestRowWrapper = ({ children }: PropsWithChildren): ReactElement => (
    <table>
        <tbody>{children}</tbody>
    </table>
);
