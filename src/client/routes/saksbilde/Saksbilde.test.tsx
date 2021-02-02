import React, { ReactNode } from 'react';
import Saksbilde from './Saksbilde';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/extend-expect';
import { personState } from '../../state/person';
import { mappetPerson } from '../../../test/data/person';
import { umappetArbeidsgiver } from '../../../test/data/arbeidsgiver';
import { Person } from 'internal-types';

jest.mock('../../hooks/useRefreshPersonVedUrlEndring', () => ({
    useRefreshPersonVedUrlEndring: () => {},
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

const wrapper = (personTilBehandling?: Person): React.FC => ({ children }) => (
    <MemoryRouter>
        <RecoilRoot
            initializeState={({ set }) => {
                personTilBehandling && set(personState, { person: personTilBehandling });
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
        const personUtenVedtaksperioder = mappetPerson([umappetArbeidsgiver([])]);
        render(<Saksbilde />, { wrapper: wrapper(personUtenVedtaksperioder) });
        await waitFor(() => {
            expect(screen.queryByTestId('tomt-saksbilde')).toBeVisible();

            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('saksbilde')).toBeNull();
        });
    });
    test('rendrer saksbilde med innhold dersom både person og vedtaksperioder finnes', async () => {
        const person = mappetPerson();
        render(<Saksbilde />, { wrapper: wrapper(person) });
        await waitFor(() => {
            expect(screen.queryByTestId('saksbilde')).toBeVisible();

            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });
});
