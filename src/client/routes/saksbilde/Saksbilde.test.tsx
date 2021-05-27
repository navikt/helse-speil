import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { Person } from 'internal-types';
import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { RecoilRoot } from 'recoil';
import { mappetPerson } from 'test-data';

import { authState } from '../../state/authentication';
import { personState } from '../../state/person';

import { umappetArbeidsgiver } from '../../../test/data/arbeidsgiver';
import { umappetUfullstendigVedtaksperiode } from '../../../test/data/ufullstendigVedtaksperiode';
import { umappetUtbetalingshistorikk } from '../../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../../test/data/vedtaksperiode';
import Saksbilde from './Saksbilde';

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
                set(authState, {
                    email: 'nav.navesen@nav.no',
                    name: 'Nav Navesen',
                    oid: 'oid',
                    ident: 'NN12345',
                    isLoggedIn: true,
                });
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
            umappetArbeidsgiver([umappetUfullstendigVedtaksperiode()]),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUfullstendigVedtaksperiode) });
        await waitFor(() => {
            const perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
            expect(perioder).toHaveLength(1);
            expect(perioder[0]).toBeVisible();
            userEvent.click(perioder[0].getElementsByTagName('button')[0]);

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
                [umappetUtbetalingshistorikk('id2', true, dato), umappetUtbetalingshistorikk('id1', false, dato)]
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });
        await waitFor(() => {
            let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
            expect(perioder).toHaveLength(2);
            expect(perioder[0]).toBeVisible();
            userEvent.click(perioder[0].getElementsByTagName('button')[0]);

            expect(screen.getByTestId('saksbilde-revurdering')).toBeVisible();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('saksbilde-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });
});
