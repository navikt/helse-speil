import { vi } from 'vitest';

import {
    finnArbeidsgiverForGhostPeriode,
    finnArbeidsgiverMedOrganisasjonsnummer,
    finnSistePeriodeForSkjæringstidspunkt,
    harSykefraværMedSkjæringstidspunkt,
} from '@state/inntektsforhold/arbeidsgiver';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';
import { generateId } from '@utils/generateId';

vi.mock('@state/person');
vi.mock('@state/periode');
vi.unmock('@state/inntektsforhold/arbeidsgiver');

describe('findArbeidsgiverWithGhostPeriode', () => {
    it('returnerer arbeidsgiver som inneholder gitt ghost-periode', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgiver = enArbeidsgiver({ ghostPerioder: [ghostPeriode] });
        const arbeidsgivere = [enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()];
        const person = enPerson().medArbeidsgivere(arbeidsgivere);

        expect(finnArbeidsgiverForGhostPeriode(person, ghostPeriode)).toEqual(arbeidsgiver);
    });

    it('returnerer undefined hvis ghost-perioden ikke finnes hos en arbeidsgiver', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgivere = [enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()];
        const person = enPerson().medArbeidsgivere(arbeidsgivere);

        expect(finnArbeidsgiverForGhostPeriode(person, ghostPeriode)).toBeUndefined();
    });
});

describe('useArbeidsgiver', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returnerer arbeidsgiver med gitt organisasjonsnummer', () => {
        const organisasjonsnummer = generateId();
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer });
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()]);

        const { result } = renderHook(() => finnArbeidsgiverMedOrganisasjonsnummer(person, organisasjonsnummer));

        expect(result.current).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis arbeidsgiver med gitt organisasjonsnummer ikke finnes', () => {
        const organisasjonsnummer = generateId();
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()]);

        const { result } = renderHook(() => finnArbeidsgiverMedOrganisasjonsnummer(person, organisasjonsnummer));

        expect(result.current).toBeNull();
    });
});

describe('harSykdomPåSkjæringstidspunkt', () => {
    it('returnerer true når arbeidsgiveren har en periode på skjæringstidspunktet', () => {
        const periode = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [periode] })] });

        expect(harSykefraværMedSkjæringstidspunkt(arbeidsgiver, '2020-01-01')).toBe(true);
    });

    it('returnerer false når arbeidsgiverens periode hører til et annet skjæringstidspunkt', () => {
        const periode = enBeregnetPeriode({ skjaeringstidspunkt: '2019-05-01' });
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [periode] })] });

        expect(harSykefraværMedSkjæringstidspunkt(arbeidsgiver, '2020-01-01')).toBe(false);
    });

    it('returnerer false når arbeidsgiveren ikke har perioder i det hele tatt', () => {
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [], ghostPerioder: [] });

        expect(harSykefraværMedSkjæringstidspunkt(arbeidsgiver, '2020-01-01')).toBe(false);
    });

    it('returnerer false for arbeidsgiver som er null', () => {
        expect(harSykefraværMedSkjæringstidspunkt(null, '2020-01-01')).toBe(false);
    });

    it('ser bort fra perioder som kun finnes i tidligere behandlinger', () => {
        const periodeISisteBehandling = enBeregnetPeriode({ skjaeringstidspunkt: '2019-05-01' });
        const periodeITidligereBehandling = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
        const arbeidsgiver = enArbeidsgiver({
            behandlinger: [
                enBehandling({ perioder: [periodeISisteBehandling] }),
                enBehandling({ perioder: [periodeITidligereBehandling] }),
            ],
        });

        expect(harSykefraværMedSkjæringstidspunkt(arbeidsgiver, '2020-01-01')).toBe(false);
    });
});

describe('finnSistePeriodeForSkjæringstidspunkt', () => {
    it('returnerer den nyeste perioden på skjæringstidspunktet', () => {
        const nyestePeriode = enBeregnetPeriode({
            skjaeringstidspunkt: '2020-01-01',
            fom: '2020-02-01',
            tom: '2020-02-28',
        });
        const eldstePeriode = enBeregnetPeriode({
            skjaeringstidspunkt: '2020-01-01',
            fom: '2020-01-01',
            tom: '2020-01-31',
        });
        const arbeidsgiver = enArbeidsgiver({
            behandlinger: [enBehandling({ perioder: [nyestePeriode, eldstePeriode] })],
        });

        expect(finnSistePeriodeForSkjæringstidspunkt(arbeidsgiver, '2020-01-01')).toEqual(nyestePeriode);
    });

    it('ser bort fra perioder med et annet skjæringstidspunkt', () => {
        const periodeMedAnnetSkjæringstidspunkt = enBeregnetPeriode({ skjaeringstidspunkt: '2020-06-01' });
        const periode = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
        const arbeidsgiver = enArbeidsgiver({
            behandlinger: [enBehandling({ perioder: [periodeMedAnnetSkjæringstidspunkt, periode] })],
        });

        expect(finnSistePeriodeForSkjæringstidspunkt(arbeidsgiver, '2020-01-01')).toEqual(periode);
    });

    it('returnerer null når arbeidsgiveren ikke har perioder på skjæringstidspunktet', () => {
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [], ghostPerioder: [] });

        expect(finnSistePeriodeForSkjæringstidspunkt(arbeidsgiver, '2020-01-01')).toBeNull();
    });
});
