import React, { ReactNode } from 'react';
import Saksbilde from './Saksbilde';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/extend-expect';
import { personTilBehandlingState } from '../../state/person';
import { personinfoFraSparkel, umappetPerson } from '../../../test/data/person';

jest.mock('../../hooks/useRefreshPerson', () => ({
    useRefreshPerson: () => {},
}));

jest.mock('@navikt/helse-frontend-logg', () => ({
    LoggHeader: () => null,
    LoggListe: () => null,
    LoggProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
    Hendelsetype: {
        Historikk: 0,
        Meldinger: 1,
        Dokumenter: 2,
    },
}));

jest.mock('../../components/tidslinje', () => ({
    LasterTidslinje: () => null,
    Tidslinje: () => null,
}));

declare global {
    namespace NodeJS {
        // noinspection JSUnusedGlobalSymbols
        interface Global {
            fetch: jest.MockedFunction<any>;
        }
    }
}

afterEach(() => {
    global.fetch = undefined;
});

const mockPersonResponse = (response: object | undefined) => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(response),
        });
    });
};

const wrapper = (personTilBehandling?: string): React.FC => ({ children }) => (
    <MemoryRouter>
        <RecoilRoot
            initializeState={({ set }) => {
                personTilBehandling && set(personTilBehandlingState, personTilBehandling);
            }}
        >
            {children}
        </RecoilRoot>
    </MemoryRouter>
);

describe('Saksbilde', () => {
    test('rendrer loading screen dersom det ikke finnes person', async () => {
        render(<Saksbilde />, { wrapper: wrapper() });
        await waitFor(() => {
            expect(screen.queryByTestId('laster-saksbilde')).toBeVisible();

            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
            expect(screen.queryByTestId('saksbilde')).toBeNull();
        });
    });
    test('rendrer tomt saksbilde for personer uten vedtaksperioder', async () => {
        mockPersonResponse({
            person: {
                ...umappetPerson([]),
                personinfo: personinfoFraSparkel({}),
            },
        });
        render(<Saksbilde />, { wrapper: wrapper('987654321') });
        await waitFor(() => {
            expect(screen.queryByTestId('tomt-saksbilde')).toBeVisible();

            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('saksbilde')).toBeNull();
        });
    });
    test('rendrer saksbilde med innhold dersom både person og vedtaksperioder finnes', async () => {
        mockPersonResponse({
            person: {
                ...umappetPerson(),
                personinfo: personinfoFraSparkel({}),
            },
        });
        render(<Saksbilde />, { wrapper: wrapper('987654321') });
        await waitFor(() => {
            expect(screen.queryByTestId('saksbilde')).toBeVisible();

            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });
});
