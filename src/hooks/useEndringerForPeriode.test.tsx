import { useEndringerForPeriode } from '@hooks/useEndringerForPeriode';
import { finnArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsforholdoverstyring, enDagoverstyring, enInntektoverstyring } from '@test-data/overstyring';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';

jest.mock('@state/person');
jest.mock('@state/periode');
jest.unmock('@state/arbeidsgiver');

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
