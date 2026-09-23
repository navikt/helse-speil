import { Mock, vi } from 'vitest';

import { Periodetilstand, Utbetalingstatus } from '@io/graphql';
import {
    useArbeidsforholdKanOverstyres,
    useGhostInntektKanOverstyres,
} from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { renderHook } from '@test-utils';

vi.mock('@state/periode');

const skjæringstidspunkt = '2020-01-01';

describe('useArbeidsforholdKanOverstyres', () => {
    it('lar saksbehandler ekskludere arbeidsforhold som mangler både periode og ghost-periode', () => {
        const { person, arbeidsgiverUtenSykdom } = enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({ ghostPerioder: [] });

        const { result } = renderHook(() =>
            useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, arbeidsgiverUtenSykdom.organisasjonsnummer),
        );

        expect(result.current).toBe(true);
    });

    it('lar saksbehandler ekskludere arbeidsforhold med ghost-periode', () => {
        const { person, arbeidsgiverUtenSykdom } = enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({
            ghostPerioder: [enGhostPeriode({ skjaeringstidspunkt: skjæringstidspunkt })],
        });

        const { result } = renderHook(() =>
            useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, arbeidsgiverUtenSykdom.organisasjonsnummer),
        );

        expect(result.current).toBe(true);
    });

    it('lar ikke saksbehandler ekskludere et arbeidsforhold med sykdom på skjæringstidspunktet', () => {
        const { person, sykmeldtArbeidsgiver } = enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({ ghostPerioder: [] });

        const { result } = renderHook(() =>
            useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, sykmeldtArbeidsgiver.organisasjonsnummer),
        );

        expect(result.current).toBe(false);
    });

    it('lar ikke saksbehandler ekskludere når en periode ligger hos beslutter', () => {
        const { person, arbeidsgiverUtenSykdom } = enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({
            ghostPerioder: [],
            periodeOverrides: {
                totrinnsvurdering: {
                    __typename: 'Totrinnsvurdering',
                    erBeslutteroppgave: true,
                    erRetur: false,
                    saksbehandler: null,
                    beslutter: null,
                },
            },
        });

        const { result } = renderHook(() =>
            useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, arbeidsgiverUtenSykdom.organisasjonsnummer),
        );

        expect(result.current).toBe(false);
    });

    it('lar ikke saksbehandler ekskludere når ingen har beregnet periode på skjæringstidspunktet', () => {
        const { person, arbeidsgiverUtenSykdom } = enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({
            ghostPerioder: [],
            periodeOverrides: { skjaeringstidspunkt: '2019-05-01' },
        });

        const { result } = renderHook(() =>
            useArbeidsforholdKanOverstyres(person, skjæringstidspunkt, arbeidsgiverUtenSykdom.organisasjonsnummer),
        );

        expect(result.current).toBe(false);
    });

    it('lar ikke saksbehandler ekskludere en arbeidsgiver som både har ghost-periode og egen sykdomsperiode', () => {
        const sykmeldtPeriode = enBeregnetPeriode({ skjaeringstidspunkt: skjæringstidspunkt });
        const sykmeldtArbeidsgiver = enArbeidsgiver({
            behandlinger: [enBehandling({ perioder: [sykmeldtPeriode] })],
            ghostPerioder: [],
        });
        const egenPeriode = enBeregnetPeriode({
            skjaeringstidspunkt: skjæringstidspunkt,
            fom: '2020-02-01',
            tom: '2020-02-28',
        });
        const arbeidsgiverMedGhostOgPeriode = enArbeidsgiver({
            behandlinger: [enBehandling({ perioder: [egenPeriode] })],
            ghostPerioder: [
                enGhostPeriode({ skjaeringstidspunkt: skjæringstidspunkt, fom: '2020-01-01', tom: '2020-01-31' }),
            ],
        });
        const person = enPerson({ arbeidsgivere: [sykmeldtArbeidsgiver, arbeidsgiverMedGhostOgPeriode] });
        (useActivePeriod as Mock).mockReturnValue(sykmeldtPeriode);

        const { result } = renderHook(() =>
            useArbeidsforholdKanOverstyres(
                person,
                skjæringstidspunkt,
                arbeidsgiverMedGhostOgPeriode.organisasjonsnummer,
            ),
        );

        expect(result.current).toBe(false);
    });
});

describe('useGhostInntektKanOverstyres', () => {
    it('lar saksbehandler overstyre inntekt for arbeidsforhold som mangler både periode og ghost-periode', () => {
        const { person, arbeidsgiverUtenSykdom } = enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({ ghostPerioder: [] });

        const { result } = renderHook(() =>
            useGhostInntektKanOverstyres(person, skjæringstidspunkt, arbeidsgiverUtenSykdom.organisasjonsnummer),
        );

        expect(result.current).toBe(true);
    });

    it('lar ikke saksbehandler overstyre via ghost-flyten for et arbeidsforhold med sykdom', () => {
        const { person, sykmeldtArbeidsgiver } = enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({ ghostPerioder: [] });

        const { result } = renderHook(() =>
            useGhostInntektKanOverstyres(person, skjæringstidspunkt, sykmeldtArbeidsgiver.organisasjonsnummer),
        );

        expect(result.current).toBe(false);
    });

    it('lar ikke saksbehandler overstyre når en periode ligger hos beslutter', () => {
        const { person, arbeidsgiverUtenSykdom } = enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({
            ghostPerioder: [],
            periodeOverrides: {
                totrinnsvurdering: {
                    __typename: 'Totrinnsvurdering',
                    erBeslutteroppgave: true,
                    erRetur: false,
                    saksbehandler: null,
                    beslutter: null,
                },
            },
        });

        const { result } = renderHook(() =>
            useGhostInntektKanOverstyres(person, skjæringstidspunkt, arbeidsgiverUtenSykdom.organisasjonsnummer),
        );

        expect(result.current).toBe(false);
    });
});

/**
 * Bygger en person med én sykmeldt arbeidsgiver som eier den aktive, utbetalte perioden, og én arbeidsgiver
 * uten sykdom på skjæringstidspunktet.
 */
function enPersonMedSykmeldtOgArbeidsforholdUtenSykdom({
    ghostPerioder,
    periodeOverrides,
}: {
    ghostPerioder: ReturnType<typeof enGhostPeriode>[];
    periodeOverrides?: Partial<ReturnType<typeof enBeregnetPeriode>>;
}) {
    const sykmeldtPeriode = enBeregnetPeriode({
        skjaeringstidspunkt: skjæringstidspunkt,
        periodetilstand: Periodetilstand.Utbetalt,
        utbetaling: enUtbetaling({ status: Utbetalingstatus.Utbetalt }),
        ...periodeOverrides,
    });
    const sykmeldtArbeidsgiver = enArbeidsgiver({
        behandlinger: [enBehandling({ perioder: [sykmeldtPeriode] })],
        ghostPerioder: [],
    });
    const arbeidsgiverUtenSykdom = enArbeidsgiver({ behandlinger: [], ghostPerioder });
    const person = enPerson({ arbeidsgivere: [sykmeldtArbeidsgiver, arbeidsgiverUtenSykdom] });

    (useActivePeriod as Mock).mockReturnValue(sykmeldtPeriode);

    return { person, sykmeldtArbeidsgiver, arbeidsgiverUtenSykdom };
}
