import { RecoilWrapper } from '@test-wrappers';
import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { FetchPersonDocument } from '@io/graphql';
import { useKeyboardActions } from '@saksbilde/useKeyboardShortcuts';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeilError } from '@utils/error';

import { Header } from './Header';

jest.mock('@state/person');
jest.mock('@saksbilde/useKeyboardShortcuts');

let cachedVarsel: SpeilError | null = null;

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

const mocks = [
    {
        request: {
            query: FetchPersonDocument,
            variables: {
                aktorId: '12345678910',
            },
        },
        result: () => {
            return {
                data: {
                    person: {},
                },
            };
        },
    },
];

describe('Header', () => {
    beforeEach(() => {
        (useKeyboardActions as jest.Mock).mockReturnValue(() => Promise.resolve(null));
    });
    afterEach(() => {
        jest.clearAllMocks();
        cachedVarsel = null;
    });

    it('legger til varsel ved ugyldig søk', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
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
            <MockedProvider mocks={mocks} addTypename={false}>
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
