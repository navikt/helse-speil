import React, { ReactNode } from 'react';
import Saksbilde from './Saksbilde';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/extend-expect';
import { personState } from '../../state/person';
import { mappetPerson } from 'test-data';
import { umappetArbeidsgiver } from '../../../test/data/arbeidsgiver';
import { Person } from 'internal-types';
import { umappetVedtaksperiode } from '../../../test/data/vedtaksperiode';
import userEvent from '@testing-library/user-event';
import { umappetUtbetalingshistorikk } from '../../../test/data/utbetalingshistorikk';
import dayjs from 'dayjs';

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
            expect(screen.queryByTestId('saksbilde-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('saksbilde-revurdering')).toBeNull();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
        });
    });
    test('rendrer tomt saksbilde for personer uten vedtaksperioder', async () => {
        const personUtenVedtaksperioder = mappetPerson([umappetArbeidsgiver([])]);
        render(<Saksbilde />, { wrapper: wrapper(personUtenVedtaksperioder) });
        await waitFor(() => {
            expect(screen.queryByTestId('tomt-saksbilde')).toBeVisible();

            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('saksbilde-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('saksbilde-revurdering')).toBeNull();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
        });
    });
    test('rendrer saksbilde for vedtaksperiode med innhold dersom både person og vedtaksperioder finnes', async () => {
        const person = mappetPerson();
        render(<Saksbilde />, { wrapper: wrapper(person) });
        await waitFor(() => {
            expect(screen.queryByTestId('saksbilde-vedtaksperiode')).toBeVisible();

            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('saksbilde-revurdering')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });
    test('rendrer saksbilde for ufullstendig vedtaksperiode', async () => {
        const personMedUfullstendigVedtaksperiode = mappetPerson([
            umappetArbeidsgiver([umappetVedtaksperiode({ fullstendig: false })]),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUfullstendigVedtaksperiode) });
        userEvent.click(screen.getByTestId('tidslinjeperiode').getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.getByTestId('tidslinjeperiode')).toBeVisible();
            expect(screen.getByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeVisible();

            expect(screen.queryByTestId('saksbilde-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('saksbilde-revurdering')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });

    test('rendrer saksbilde for revurdering', async () => {
        const dato = dayjs('2020-01-01');
        const personMedUtbetalingshistorikk = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id1', 'id2'],
                    }),
                ],
                [],
                [umappetUtbetalingshistorikk('id1', false, dato), umappetUtbetalingshistorikk('id2', true, dato)]
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });

        userEvent.click(screen.getAllByTestId('tidslinjeperiode')[0].getElementsByTagName('button')[0]);

        await waitFor(() => {
            expect(screen.getByTestId('saksbilde-revurdering')).toBeVisible();
            expect(screen.getAllByTestId('tidslinjeperiode')[0]).toBeVisible();

            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('saksbilde-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });
});
