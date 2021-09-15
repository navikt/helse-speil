import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { SpesialistInntektskilde } from 'external-types';
import { Person } from 'internal-types';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';
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
jest.mock('../../featureToggles', () => ({
    defaultUtbetalingToggles: {
        overstyreUtbetaltPeriodeEnabled: true,
        overstyrbareTabellerEnabled: true,
    },
    erLocal: () => true,
    erDev: () => false,
}));

const wrapper = (personTilBehandling?: Person): React.FC => ({ children }) => (
    <MemoryRouter initialEntries={['/person/:aktorId/utbetaling']}>
        <Route path="/person/:aktorId">
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
        </Route>
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
        const perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(2);
        expect(perioder[0]).toBeVisible();
        expect(perioder[1]).toBeVisible();
        userEvent.click(perioder[1].getElementsByTagName('button')[0]);

        await waitFor(() => {
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
        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(1);
        expect(perioder[0]).toBeVisible();
        userEvent.click(perioder[0].getElementsByTagName('button')[0]);

        await waitFor(() => {
            expect(screen.getByTestId('saksbilde-fullstendig')).toBeVisible();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });

    test('viser revurderingsknapp hvis alle overlappende perioder er til revurdering', async () => {
        const AG1 = '123456789';
        const AG2 = '987654321';
        const dato = dayjs('2020-01-01');
        const personMedUtbetalingshistorikk = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id1'],
                        inntektskilde: SpesialistInntektskilde.FlereArbeidsgivere,
                    }),
                ],
                [],
                [umappetUtbetalingshistorikk('id1', 'UTBETALING', 'UTBETALT', dayjs('2020-01-01T00:00:00'), dato)],
                AG1
            ),
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-2',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id2'],
                        inntektskilde: SpesialistInntektskilde.FlereArbeidsgivere,
                    }),
                ],
                [],
                [umappetUtbetalingshistorikk('id2', 'UTBETALING', 'UTBETALT', dayjs('2020-01-01T00:00:00'), dato)],
                AG2
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });
        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(2);
        expect(perioder[0]).toBeVisible();
        expect(perioder[1]).toBeVisible();

        userEvent.click(perioder[0].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(AG1)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toHaveTextContent('Revurder');
        });

        userEvent.click(perioder[1].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(AG2)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toHaveTextContent('Revurder');
        });
    });

    test('viser ikke revurderingsknapp for en arbeidsgiver dersom en annen fortsatt er til revurdering', async () => {
        const AG1 = '123456789';
        const AG2 = '987654321';
        const dato = dayjs('2020-01-01');
        const personMedUtbetalingshistorikk = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id1', 'id2'],
                        inntektskilde: SpesialistInntektskilde.FlereArbeidsgivere,
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk('id1', 'UTBETALING', 'UTBETALT', dayjs('2020-01-01T00:00:00'), dato),
                    umappetUtbetalingshistorikk('id2', 'REVURDERING', 'UTBETALT', dayjs('2020-01-02T00:00:00'), dato),
                ],
                AG1
            ),
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-2',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id3', 'id4'],
                        inntektskilde: SpesialistInntektskilde.FlereArbeidsgivere,
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk('id3', 'UTBETALING', 'UTBETALT', dayjs('2020-01-01T00:00:00'), dato),
                    umappetUtbetalingshistorikk(
                        'id4',
                        'REVURDERING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                AG2
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });
        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(2);
        expect(perioder[0]).toBeVisible();
        expect(perioder[1]).toBeVisible();

        userEvent.click(perioder[0].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(AG1)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toBeNull();
        });

        userEvent.click(perioder[1].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(AG2)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toBeNull();
        });
    });

    test('viser overstyringsknapp for alle arbeidsgivere dersom alle overlappende perioder er til revurdering', async () => {
        const AG1 = '123456789';
        const AG2 = '987654321';
        const dato = dayjs('2020-01-01');
        const personMedUtbetalingshistorikk = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id1', 'id2'],
                        inntektskilde: SpesialistInntektskilde.FlereArbeidsgivere,
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk('id1', 'UTBETALING', 'UTBETALT', dayjs('2020-01-01T00:00:00'), dato),
                    umappetUtbetalingshistorikk(
                        'id2',
                        'REVURDERING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                AG1
            ),
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-2',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id3', 'id4'],
                        inntektskilde: SpesialistInntektskilde.FlereArbeidsgivere,
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk('id3', 'UTBETALING', 'UTBETALT', dayjs('2020-01-01T00:00:00'), dato),
                    umappetUtbetalingshistorikk(
                        'id4',
                        'REVURDERING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                AG2
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });
        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(2);
        expect(perioder[0]).toBeVisible();
        expect(perioder[1]).toBeVisible();

        userEvent.click(perioder[0].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(AG1)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toHaveTextContent('Endre');
        });

        userEvent.click(perioder[1].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(AG2)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toHaveTextContent('Endre');
        });
    });

    test('viser overstyringsknapp for en periode til revurdering', async () => {
        const ORGNR = '123456789';
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
                    umappetUtbetalingshistorikk(
                        'id2',
                        'REVURDERING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                ORGNR
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });
        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(1);
        expect(perioder[0]).toBeVisible();

        userEvent.click(perioder[0].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(ORGNR)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toHaveTextContent('Endre');
        });
    });

    test('viser overstyringsknapp for en avsluttet periode', async () => {
        const ORGNR = '123456789';
        const dato = dayjs('2020-01-01');
        const personMedUtbetalingshistorikk = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id1'],
                    }),
                ],
                [],
                [umappetUtbetalingshistorikk('id1', 'UTBETALING', 'UTBETALT', dayjs('2020-01-01T00:00:00'), dato)],
                ORGNR
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });
        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(1);
        expect(perioder[0]).toBeVisible();

        userEvent.click(perioder[0].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(ORGNR)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toHaveTextContent('Revurder');
        });
    });

    test('viser overstyringsknapp for en periode til godkjenning', async () => {
        const ORGNR = '123456789';
        const dato = dayjs('2020-01-01');
        const personMedUtbetalingshistorikk = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato,
                        tom: dato,
                        beregningIder: ['id1'],
                    }),
                ],
                [],
                [umappetUtbetalingshistorikk('id1', 'UTBETALING', 'IKKE_UTBETALT', dayjs('2020-01-01T00:00:00'), dato)],
                ORGNR
            ),
        ]);

        render(<Saksbilde />, { wrapper: wrapper(personMedUtbetalingshistorikk) });
        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(1);
        expect(perioder[0]).toBeVisible();

        userEvent.click(perioder[0].getElementsByTagName('button')[0]);
        await waitFor(() => {
            expect(screen.queryByText(ORGNR)).toBeVisible();
            expect(screen.queryByTestId('utbetaling')).toBeVisible();
            expect(screen.queryByTestId('overstyringsknapp')).toHaveTextContent('Endre');
        });
    });
});
