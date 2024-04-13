import { RecoilAndRouterWrapper } from '@test-wrappers';
import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { FetchPersonDocument } from '@io/graphql';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeilError } from '@utils/error';

import { useKeyboardActions } from '../../routes/saksbilde/useKeyboardShortcuts';
import { Header } from './Header';

jest.mock('@state/person');
jest.mock('../../routes/saksbilde/useKeyboardShortcuts');

let cachedVarsel: SpeilError | null = null;

jest.mock('@utils/featureToggles', () => ({
    erLocal: () => false,
    erDev: () => false,
    erCoachEllerSuper: () => false,
}));

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
                <RecoilAndRouterWrapper>
                    <Header />
                </RecoilAndRouterWrapper>
            </MockedProvider>,
        );
        await userEvent.type(screen.getByRole('searchbox'), 'test');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).not.toBeNull();
    });

    it('legger ikke til varsel ved gyldig søk', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <RecoilAndRouterWrapper>
                    <Header />
                </RecoilAndRouterWrapper>
            </MockedProvider>,
        );
        await userEvent.type(screen.getByRole('searchbox'), '12345678910');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).toBeNull();
    });
});
