import { nanoid } from 'nanoid';

import {
    findArbeidsgiverWithGhostPeriode,
    finnArbeidsgiver,
    finnArbeidsgiverForPeriode,
    useCurrentArbeidsgiver,
    useEndringerForPeriode,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsforholdoverstyring, enDagoverstyring, enInntektoverstyring } from '@test-data/overstyring';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';

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

describe('finnArbeidsgiverForPeriode', () => {
    it('returnerer arbeidsgiver som inneholder gitt periode', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const arbeidsgivere = [enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()];

        expect(finnArbeidsgiverForPeriode(arbeidsgivere, periode)).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis perioden ikke finnes hos en arbeidsgiver', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgivere = [enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()];

        expect(finnArbeidsgiverForPeriode(arbeidsgivere, periode)).toBeNull();
    });
});

describe('useCurrentArbeidsgiver', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returnerer null hvis det ikke finnes en aktiv periode', () => {
        const { result } = renderHook(() => useCurrentArbeidsgiver(enPerson()));

        expect(result.current).toBeNull();
    });

    it('returnerer arbeidsgiveren som er tilknyttet den aktive perioden', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useCurrentArbeidsgiver(person));

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

        const { result } = renderHook(() => finnArbeidsgiver(person, organisasjonsnummer));

        expect(result.current).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis arbeidsgiver med gitt organisasjonsnummer ikke finnes', () => {
        const organisasjonsnummer = nanoid();
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()]);

        const { result } = renderHook(() => finnArbeidsgiver(person, organisasjonsnummer));

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

        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const endringer = finnArbeidsgiver(person, organisasjonsnummer)?.overstyringer;

        const { result } = renderHook(() => useEndringerForPeriode(endringer, person));

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

        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const endringer = finnArbeidsgiver(person, organisasjonsnummer)?.overstyringer;

        const { result } = renderHook(() => useEndringerForPeriode(endringer, person));

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

        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const endringer = finnArbeidsgiver(person, organisasjonsnummer)?.overstyringer;

        const { result } = renderHook(() => useEndringerForPeriode(endringer, person));

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

        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const endringer = finnArbeidsgiver(person, organisasjonsnummer)?.overstyringer;

        const { result } = renderHook(() => useEndringerForPeriode(endringer, person));

        expect(result.current.inntektsendringer).toEqual(inntektoverstyringer);
        expect(result.current.arbeidsforholdendringer).toEqual(arbeidsforholdoverstyringer);
    });
});
