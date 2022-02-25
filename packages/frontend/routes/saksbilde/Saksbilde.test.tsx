import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';

import { authState } from '@state/authentication';
import { personState } from '@state/person';
import { ISO_DATOFORMAT } from '@utils/date';

import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { umappetUfullstendigVedtaksperiode } from '../../test/data/ufullstendigVedtaksperiode';
import { umappetUtbetalingshistorikk } from '../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../test/data/vedtaksperiode';
import Saksbilde from './Saksbilde';
import { mappetPerson } from '../../test/data';
import { umappetGhostPeriode } from '../../test/data/ghostPeriode';
import {
    testBeregningId,
    testBeregningId2,
    testVilkårsgrunnlagHistorikkId,
    umappetPerson,
} from '../../test/data/person';
import { umappedeVilkår } from '../../test/data/vilkår';
import { dateStringSykdomstidslinje } from '../../test/data/sykdomstidslinje';

jest.mock('@hooks/useRefreshPersonVedUrlEndring', () => ({
    useRefreshPersonVedUrlEndring: () => {},
}));

jest.mock('@hooks/useSetVedtaksperiodeReferanserForNotater', () => ({
    useSetVedtaksperiodeReferanserForNotater: () => {},
}));

jest.mock('../saksbilde/historikk/icons/IconDokumenter.svg', () => 'null');
jest.mock('../saksbilde/historikk/icons/IconHistorikk.svg', () => 'null');

jest.mock('@utils/featureToggles', () => ({
    defaultUtbetalingToggles: {
        overstyreUtbetaltPeriodeEnabled: true,
    },
    defaultOverstyrToggles: {
        overstyrArbeidsforholdUtenSykefraværEnabled: true,
    },
    erDev: () => true,
    erLocal: () => true,
}));

jest.mock('@state/personGraphQL', () => ({
    usePersonGraphQL: () => null,
}));

const wrapper =
    (initializer?: (mutableSnapshot: MutableSnapshot) => void): React.FC =>
    ({ children }) =>
        (
            <MemoryRouter initialEntries={['/person/:aktorId/utbetaling']}>
                <Route path="/person/:aktorId">
                    <RecoilRoot initializeState={initializer}>{children}</RecoilRoot>
                </Route>
            </MemoryRouter>
        );

const wrapperUtenPerson = () =>
    wrapper(({ set }) => {
        set(authState, {
            email: 'nav.navesen@nav.no',
            name: 'Nav Navesen',
            oid: 'oid',
            ident: 'NN12345',
            isLoggedIn: true,
        });
    });

const wrapperMedPerson = (arbeidsgivere?: ExternalArbeidsgiver[]) =>
    wrapper(({ set }) => {
        const umappetArbeidsgivere = arbeidsgivere ?? [umappetArbeidsgiver()];
        const umappetVilkårsgrunnlagHistorikk = umappetPerson().vilkårsgrunnlagHistorikk;
        set(personState, {
            person: {
                ...mappetPerson(umappetArbeidsgivere),
                vilkårsgrunnlagHistorikk: umappetVilkårsgrunnlagHistorikk,
                arbeidsgivereV2: umappetArbeidsgivere,
                arbeidsforhold: [],
            },
        });
        set(authState, {
            email: 'nav.navesen@nav.no',
            name: 'Nav Navesen',
            oid: 'oid',
            ident: 'NN12345',
            isLoggedIn: true,
        });
    });

describe('Saksbilde', () => {
    test('rendrer loading screen dersom det ikke finnes person', async () => {
        render(<Saksbilde />, { wrapper: wrapperUtenPerson() });

        await waitFor(() => {
            expect(screen.getByTestId('laster-saksbilde')).toBeVisible();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
            expect(screen.queryByTestId('saksbilde-content-med-sykefravær')).toBeNull();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
        });
    });

    test('rendrer tomt saksbilde for personer uten vedtaksperioder', async () => {
        render(<Saksbilde />, { wrapper: wrapperMedPerson([umappetArbeidsgiver([], [], [])]) });

        await waitFor(() => {
            expect(screen.getByTestId('tomt-saksbilde')).toBeVisible();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('saksbilde-content-med-sykefravær')).toBeNull();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
        });
    });

    test('rendrer saksbilde for ufullstendig vedtaksperiode', async () => {
        const arbeidsgiverMedUfullstendigPeriode = [
            umappetArbeidsgiver(
                [
                    umappetUfullstendigVedtaksperiode({ fom: dayjs('2018-02-01'), tom: dayjs('2018-02-28') }),
                    umappetVedtaksperiode(),
                ],
                [],
                [umappetUtbetalingshistorikk()]
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgiverMedUfullstendigPeriode) });
        const perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(2);
        expect(perioder[0]).toBeVisible();
        expect(perioder[1]).toBeVisible();
        userEvent.click(perioder[0].getElementsByTagName('button')[0]);

        await waitFor(() => {
            expect(screen.getByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeVisible();
            expect(screen.queryByTestId('saksbilde-content-med-sykefravær')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });

    test('rendrer saksbilde med innhold dersom både person og vedtaksperioder finnes', async () => {
        render(<Saksbilde />, { wrapper: wrapperMedPerson() });

        await waitFor(() => {
            expect(screen.getByTestId('saksbilde-content-med-sykefravær')).toBeVisible();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });

    test('rendrer saksbilde for perioder uten sykefravær', async () => {
        const ORGNR = '987654321';
        const dato = dayjs('2018-01-01');
        const vilkårsgrunnlaghistorikkid = '33612787-ca6c-45ba-bbd0-29ae6474d9c2';

        const arbeidsgiverMedPeriodeUtenSykefravær = [
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id1'],
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id1',
                        vilkårsgrunnlaghistorikkid,
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                ],
                [
                    umappetGhostPeriode(
                        dato.format(ISO_DATOFORMAT),
                        dato.format(ISO_DATOFORMAT),
                        dato.format(ISO_DATOFORMAT),
                        vilkårsgrunnlaghistorikkid,
                        false
                    ),
                ],
                ORGNR
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgiverMedPeriodeUtenSykefravær) });

        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(2);
        expect(perioder[0]).toBeVisible();
        userEvent.click(perioder[1].getElementsByTagName('button')[0]);

        await waitFor(() => {
            expect(screen.getByTestId('saksbilde-content-uten-sykefravær')).toBeVisible();
            expect(screen.queryByTestId('saksbilde-content-med-sykefravær')).toBeNull();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });

    test('viser muligheten for å overstyre ghost arbeidsforhold ved førstegangsbehandling', async () => {
        render(<Saksbilde />, {
            wrapper: wrapperMedPerson([
                umappetArbeidsgiver(
                    [umappetVedtaksperiode({ tilstand: 'Oppgaver' })],
                    [],
                    [
                        umappetUtbetalingshistorikk(
                            testBeregningId,
                            testVilkårsgrunnlagHistorikkId,
                            'UTBETALING',
                            'IKKE_UTBETALT'
                        ),
                    ],
                    [],
                    '123456789'
                ),

                umappetArbeidsgiver(
                    [],
                    [],
                    [],
                    [
                        umappetGhostPeriode(
                            '2018-01-01',
                            '2018-01-01',
                            '2018-01-01',
                            '33612787-ca6c-45ba-bbd0-29ae6474d9c2',
                            false
                        ),
                    ]
                ),
            ]),
        });
        const perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(2);
        expect(perioder[0]).toBeVisible();
        expect(perioder[1]).toBeVisible();
        userEvent.click(perioder[1].getElementsByTagName('button')[0]);

        await waitFor(() => {
            expect(screen.queryByText('Ikke bruk inntekten i beregning')).toBeVisible();
        });
    });

    test('viser ikke muligheten for å overstyre ghost arbeidsforhold ved forlengelse', async () => {
        render(<Saksbilde />, {
            wrapper: wrapperMedPerson([
                umappetArbeidsgiver(
                    [
                        umappetVedtaksperiode({
                            tilstand: 'Oppgaver',
                            fom: '2018-01-01',
                            tom: '2018-01-31',
                            beregningIder: [testBeregningId],
                        }),
                        umappetVedtaksperiode({
                            tilstand: 'Utbetalt',
                            fom: '2018-02-01',
                            tom: '2018-02-28',
                            beregningIder: [testBeregningId2],
                            vilkår: umappedeVilkår(
                                dateStringSykdomstidslinje('2018-02-01', '2018-02-28'),
                                '2018-01-01'
                            ),
                        }),
                    ],
                    [],
                    [
                        umappetUtbetalingshistorikk(
                            testBeregningId2,
                            testVilkårsgrunnlagHistorikkId,
                            'UTBETALING',
                            'IKKE_UTBETALT'
                        ),
                        umappetUtbetalingshistorikk(
                            testBeregningId,
                            testVilkårsgrunnlagHistorikkId,
                            'UTBETALING',
                            'UTBETALT'
                        ),
                    ],
                    [],
                    '123456789'
                ),

                umappetArbeidsgiver(
                    [],
                    [],
                    [],
                    [
                        umappetGhostPeriode(
                            '2018-01-01',
                            '2018-02-28',
                            '2018-01-01',
                            '33612787-ca6c-45ba-bbd0-29ae6474d9c2',
                            false
                        ),
                    ]
                ),
            ]),
        });
        const perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(2);
        expect(perioder[0]).toBeVisible();
        expect(perioder[1]).toBeVisible();
        userEvent.click(perioder[1].getElementsByTagName('button')[0]);

        await waitFor(() => {
            expect(screen.queryByText('Ikke bruk inntekten i beregning')).toBeNull();
        });
    });

    test('rendrer saksbilde for revurdering', async () => {
        const dato = dayjs('2020-01-01');
        const arbeidsgiverMedUtbetalingshistorikk = [
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id1', 'id2'],
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id1',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                    umappetUtbetalingshistorikk(
                        'id2',
                        'vid1',
                        'REVURDERING',
                        'UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ]
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgiverMedUtbetalingshistorikk) });
        let perioder = screen.getAllByTestId('tidslinjeperiode', { exact: false });
        expect(perioder).toHaveLength(1);
        expect(perioder[0]).toBeVisible();
        userEvent.click(perioder[0].getElementsByTagName('button')[0]);

        await waitFor(() => {
            expect(screen.getByTestId('saksbilde-content-med-sykefravær')).toBeVisible();
            expect(screen.queryByTestId('saksbilde-ufullstendig-vedtaksperiode')).toBeNull();
            expect(screen.queryByTestId('laster-saksbilde')).toBeNull();
            expect(screen.queryByTestId('tomt-saksbilde')).toBeNull();
        });
    });

    test('viser revurderingsknapp hvis alle overlappende perioder er til revurdering', async () => {
        const AG1 = '123456789';
        const AG2 = '987654321';
        const dato = dayjs('2020-01-01');
        const arbeidsgivereMedUtbetalingshistorikk = [
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id1'],
                        inntektskilde: 'FLERE_ARBEIDSGIVERE',
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id1',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                ],
                [],
                AG1
            ),
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-2',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id2'],
                        inntektskilde: 'FLERE_ARBEIDSGIVERE',
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id2',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                ],
                [],
                AG2
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgivereMedUtbetalingshistorikk) });
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
        const arbeidsgivereMedUtbetalingshistorikk = [
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id1', 'id2'],
                        inntektskilde: 'FLERE_ARBEIDSGIVERE',
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id1',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                    umappetUtbetalingshistorikk(
                        'id2',
                        'vid1',
                        'REVURDERING',
                        'UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                [],
                AG1
            ),
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-2',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id3', 'id4'],
                        inntektskilde: 'FLERE_ARBEIDSGIVERE',
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id3',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                    umappetUtbetalingshistorikk(
                        'id4',
                        'vid4',
                        'REVURDERING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                [],
                AG2
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgivereMedUtbetalingshistorikk) });
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
        const arbeidsgivereMedUtbetalingshistorikk = [
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id1', 'id2'],
                        inntektskilde: 'FLERE_ARBEIDSGIVERE',
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id1',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                    umappetUtbetalingshistorikk(
                        'id2',
                        'vid2',
                        'REVURDERING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                [],
                AG1
            ),
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-2',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id3', 'id4'],
                        inntektskilde: 'FLERE_ARBEIDSGIVERE',
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id3',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                    umappetUtbetalingshistorikk(
                        'id4',
                        'vid2',
                        'REVURDERING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                [],
                AG2
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgivereMedUtbetalingshistorikk) });
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

    test('viser overstyringsknapp for en periode til revurdering', async () => {
        const ORGNR = '123456789';
        const dato = dayjs('2020-01-01');
        const arbeidsgiverMedUtbetalingshistorikk = [
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id1', 'id2'],
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id1',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                    umappetUtbetalingshistorikk(
                        'id2',
                        'vid2',
                        'REVURDERING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-02T00:00:00'),
                        dato
                    ),
                ],
                [],
                ORGNR
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgiverMedUtbetalingshistorikk) });
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

    test('viser overstyringsknapp for en avsluttet periode', async () => {
        const ORGNR = '123456789';
        const dato = dayjs('2020-01-01');
        const arbeidsgiverMedUtbetalingshistorikk = [
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id1'],
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id1',
                        'vid1',
                        'UTBETALING',
                        'UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                ],
                [],
                ORGNR
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgiverMedUtbetalingshistorikk) });
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
        const arbeidsgiverMedUtbetalingshistorikk = [
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'uuid-1',
                        fom: dato.format(ISO_DATOFORMAT),
                        tom: dato.format(ISO_DATOFORMAT),
                        beregningIder: ['id1'],
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk(
                        'id1',
                        'vid1',
                        'UTBETALING',
                        'IKKE_UTBETALT',
                        dayjs('2020-01-01T00:00:00'),
                        dato
                    ),
                ],
                [],
                ORGNR
            ),
        ];

        render(<Saksbilde />, { wrapper: wrapperMedPerson(arbeidsgiverMedUtbetalingshistorikk) });
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
