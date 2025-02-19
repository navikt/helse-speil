import React from 'react';

import { fetchPersonMock, opptegnelseMock } from '@apollo-mocks';
import { MockedProvider } from '@apollo/client/testing';
import { useNyheter } from '@external/sanity';
import { useKeyboardActions } from '@hooks/useKeyboardShortcuts';
import { Maybe } from '@io/graphql';
import { RecoilWrapper } from '@test-wrappers';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeilError } from '@utils/error';

import { Header } from './Header';

jest.mock('@hooks/useKeyboardShortcuts');
jest.mock('@external/sanity');

let cachedVarsel: Maybe<SpeilError> = null;

jest.mock('@state/varsler', () => ({
    __esModule: true,
    Scopes: { GLOBAL: '/' },
    useAddVarsel: () => (varsel: SpeilError) => {
        cachedVarsel = varsel;
    },
    useRemoveVarsel: () => () => {
        cachedVarsel = null;
    },
    useRapporterGraphQLErrors: () => () => {},
}));

describe('Header', () => {
    beforeEach(() => {
        (useKeyboardActions as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        (useNyheter as jest.Mock).mockReturnValue({ nyheter: [] });
    });
    afterEach(() => {
        jest.clearAllMocks();
        cachedVarsel = null;
    });

    it('legger til varsel ved ugyldig søk', async () => {
        render(
            <MockedProvider mocks={[fetchPersonMock, opptegnelseMock]} addTypename={false}>
                <RecoilWrapper>
                    <Header />
                </RecoilWrapper>
            </MockedProvider>,
        );
        await userEvent.type(screen.getByRole('searchbox'), 'test');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).not.toBeNull();
    });

    it('legger ikke til varsel ved gyldig søk', async () => {
        render(
            <MockedProvider mocks={[fetchPersonMock, opptegnelseMock]} addTypename={false}>
                <RecoilWrapper>
                    <Header />
                </RecoilWrapper>
            </MockedProvider>,
        );
        await userEvent.type(screen.getByRole('searchbox'), '12345678910');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).toBeNull();
    });
});
