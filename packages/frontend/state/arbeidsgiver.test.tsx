import { wrapperWithRecoilInitializer } from '@test-wrappers';
// @ts-ignore
import { nanoid } from 'nanoid';
import React from 'react';

import {
    findArbeidsgiverWithGhostPeriode,
    findArbeidsgiverWithPeriode,
    useArbeidsgiver,
    useCurrentArbeidsgiver,
    useEndringerForPeriode,
    usePeriodForSkjæringstidspunkt,
    useUtbetalingForSkjæringstidspunkt,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsforholdoverstyring, enDagoverstyring, enInntektoverstyring } from '@test-data/overstyring';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@state/person');
jest.mock('@state/periode');
jest.unmock('@state/arbeidsgiver');

describe('findArbeidsgiverWithGhostPeriode', () => {
    it('returnerer arbeidsgiver som inneholder gitt ghost-periode', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgiver = enArbeidsgiver({ ghostPerioder: [ghostPeriode] });
        const arbeidsgivere = [enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()];

        expect(findArbeidsgiverWithGhostPeriode(ghostPeriode, arbeidsgivere)).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis ghost-perioden ikke finnes hos en arbeidsgiver', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgivere = [enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()];

        expect(findArbeidsgiverWithGhostPeriode(ghostPeriode, arbeidsgivere)).toBeNull();
    });
});

describe('findArbeidsgiverWithPeriode', () => {
    it('returnerer arbeidsgiver som inneholder gitt periode', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const arbeidsgivere = [enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()];

        expect(findArbeidsgiverWithPeriode(periode, arbeidsgivere)).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis perioden ikke finnes hos en arbeidsgiver', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgivere = [enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()];

        expect(findArbeidsgiverWithPeriode(periode, arbeidsgivere)).toBeNull();
    });
});

describe('useCurrentArbeidsgiver', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returnerer null hvis det ikke finnes en aktiv periode', () => {
        const initializer = () => {};
        const { result } = renderHook(() => useCurrentArbeidsgiver(), {
            wrapper: wrapperWithRecoilInitializer(initializer),
        });

        expect(result.current).toBeNull();
    });

    it('returnerer arbeidsgiveren som er tilknyttet den aktive perioden', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);
        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useCurrentArbeidsgiver());

        expect(result.current).toEqual(arbeidsgiver);
    });
});

describe('useArbeidsgiver', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returnerer arbeidsgiver med gitt organisasjonsnummer', () => {
        const organisasjonsnummer = nanoid();
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer });
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);

        const { result } = renderHook(() => useArbeidsgiver(organisasjonsnummer));

        expect(result.current).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis arbeidsgiver med gitt organisasjonsnummer ikke finnes', () => {
        const organisasjonsnummer = nanoid();
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);

        const { result } = renderHook(() => useArbeidsgiver(organisasjonsnummer));

        expect(result.current).toBeNull();
    });
});

describe('usePeriodForSkjæringstidspunkt', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returnerer første periode som har gitt skjæringstidspunkt i kronologisk rekkefølge for aktiv arbeidsgiver', () => {
        const a = enBeregnetPeriode({ fom: '2020-01-01' });
        const b = enBeregnetPeriode({ fom: '2020-02-01' });
        const c = enBeregnetPeriode({ fom: '2020-03-01' });
        const arbeidsgiver = enArbeidsgiver().medPerioder([b, a, c]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);
        (useActivePeriod as jest.Mock).mockReturnValueOnce(a);

        const { result } = renderHook(() => usePeriodForSkjæringstidspunkt('2020-01-01'));

        expect(result.current).toEqual(a);
    });

    it('returnerer null hvis ingen av den aktive arbeidsgiverens perioder har gitt skjæringstidspunkt', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);
        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => usePeriodForSkjæringstidspunkt('1970-01-01'));

        expect(result.current).toBeNull();
    });
});

describe('useUtbetalingForSkjæringstidspunkt', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returnerer første utbetaling som har gitt skjæringstidspunkt i kronologisk rekkefølge for aktiv arbeidsgiver', () => {
        const skjæringstidspunkt = '2021-02-04';
        const utbetaling = enUtbetaling();
        const periode = enBeregnetPeriode({ skjaeringstidspunkt: skjæringstidspunkt }).medUtbetaling(utbetaling);
        const arbeidsgiver = enArbeidsgiver().medPerioder([enBeregnetPeriode(), periode, enBeregnetPeriode()]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);
        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useUtbetalingForSkjæringstidspunkt(skjæringstidspunkt));

        expect(result.current).toEqual(utbetaling);
    });

    it('returnerer null hvis det ikke finnes en utbetaling for en periode med gitt skjæringstidspunkt', () => {
        (useCurrentPerson as jest.Mock).mockReturnValueOnce(enPerson());
        (useActivePeriod as jest.Mock).mockReturnValueOnce(enBeregnetPeriode());

        const { result } = renderHook(() => useUtbetalingForSkjæringstidspunkt('2021-02-04'));

        expect(result.current).toBeNull();
    });
});

describe('useEndringerForPeriode', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returnerer dagoverstyringer for den aktive perioden', () => {
        const organisasjonsnummer = '123456789';
        const timestamp = '2020-01-01';
        const overstyringer = [enDagoverstyring({ timestamp })];
        const periode = enBeregnetPeriode({ opprettet: timestamp });
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer, overstyringer }).medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);
        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useEndringerForPeriode(organisasjonsnummer));

        expect(result.current.dagendringer).toEqual(overstyringer);
    });

    it('returnerer arbeidsforholdoverstyringer for den aktive perioden', () => {
        const organisasjonsnummer = '123456789';
        const timestamp = '2020-01-01';
        const overstyringer = [enArbeidsforholdoverstyring({ timestamp })];
        const periode = enBeregnetPeriode().medSkjæringstidspunkt(timestamp);
        const arbeidsgiver = enArbeidsgiver()
            .medOrganisasjonsnummer(organisasjonsnummer)
            .medOverstyringer(overstyringer)
            .medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);
        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useEndringerForPeriode(organisasjonsnummer));

        expect(result.current.arbeidsforholdendringer).toEqual(overstyringer);
    });

    it('returnerer inntektsoverstyringer for den aktive perioden', () => {
        const organisasjonsnummer = '123456789';
        const timestamp = '2020-01-01';
        const overstyringer = [enInntektoverstyring({ timestamp })];
        const periode = enBeregnetPeriode({ opprettet: timestamp });
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer })
            .medOrganisasjonsnummer(organisasjonsnummer)
            .medOverstyringer(overstyringer)
            .medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);
        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useEndringerForPeriode(organisasjonsnummer));

        expect(result.current.inntektsendringer).toEqual(overstyringer);
    });

    it('returnerer overstyringer for ghostperioder', () => {
        const organisasjonsnummer = '123456789';
        const timestamp = '2020-01-01';
        const arbeidsforholdoverstyringer = [enArbeidsforholdoverstyring({ timestamp })];
        const inntektoverstyringer = [enInntektoverstyring({ timestamp })];
        const periode = enGhostPeriode({ skjaeringstidspunkt: timestamp });
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer })
            .medOrganisasjonsnummer(organisasjonsnummer)
            .medOverstyringer([...arbeidsforholdoverstyringer, ...inntektoverstyringer])
            .medGhostPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useCurrentPerson as jest.Mock).mockReturnValueOnce(person);
        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useEndringerForPeriode(organisasjonsnummer));

        expect(result.current.inntektsendringer).toEqual(inntektoverstyringer);
        expect(result.current.arbeidsforholdendringer).toEqual(arbeidsforholdoverstyringer);
    });
});
