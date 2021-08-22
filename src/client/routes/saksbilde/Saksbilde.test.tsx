import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { Person } from 'internal-types';
import React from 'react';
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
jest.mock('../../hooks/useSetVedtaksperiodeReferanserForNotater', () => ({
    useSetVedtaksperiodeReferanserForNotater: () => {},
}));

jest.mock('../saksbilde/historikk/icons/IconDokumenter.svg', () => 'null');
jest.mock('../saksbilde/historikk/icons/IconHistorikk.svg', () => 'null');

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
            expect(screen.queryByTestId('saksbilde-fullstendig')).toBeNull();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
        });
    });
    test('rendrer tomt saksbilde for personer uten vedtaksperioder', async () => {
        const personUtenVedtaksperioder = mappetPerson([umappetArbeidsgiver([], [], [])]);
        render(<Saksbilde />, { wrapper: wrapper(personUtenVedtaksperioder) });
        await waitFor(() => {
            expect(screen.queryByTestId('tomt-saksbilde')).toBeVisible();

            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('saksbilde-fullstendig')).toBeNull();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
        });
    });
    test('rendrer saksbilde for ufullstendig vedtaksperiode', async () => {
        //
        const personMedUfullstendigVedtaksperiode = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetUfullstendigVedtaksperiode({ fom: dayjs('2020-02-01'), tom: dayjs('2020-02-28') }),
                    umappetVedtaksperiode(),
                ],
                [],
                [umappetUtbetalingshistorikk()]
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUfullstendigVedtaksperiode) });
        await waitFor(() => {
            const perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
            expect(perioder).toHaveLength(2);
            expect(perioder[0]).toBeVisible();
            expect(perioder[1]).toBeVisible();
            userEvent.click(perioder[1].getElementsByTagName('button')[0]);

            expect(screen.getByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeVisible();
            expect(screen.queryByTestId('saksbilde-fullstendig')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });

    test('rendrer saksbilde med innhold dersom både person og vedtaksperioder finnes', async () => {
        //
        const person = mappetPerson();
        render(<Saksbilde />, { wrapper: wrapper(person) });
        await waitFor(() => {
            expect(screen.queryByTestId('saksbilde-fullstendig')).toBeVisible();

            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });

    test('rendrer saksbilde for revurdering', async () => {
        //
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
                [
                    umappetUtbetalingshistorikk('id1', 'UTBETALING', 'UTBETALT', dayjs('2020-01-01T00:00:00'), dato),
                    umappetUtbetalingshistorikk('id2', 'REVURDERING', 'UTBETALT', dayjs('2020-01-02T00:00:00'), dato),
                ]
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });
        await waitFor(() => {
            let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
            expect(perioder).toHaveLength(1);
            expect(perioder[0]).toBeVisible();
            userEvent.click(perioder[0].getElementsByTagName('button')[0]);

            expect(screen.getByTestId('saksbilde-fullstendig')).toBeVisible();

            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });
});
