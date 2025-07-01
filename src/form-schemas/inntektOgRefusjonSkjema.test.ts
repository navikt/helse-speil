import { ZodError } from 'zod/v4';

import { lagInntektOgRefusjonSchema, sorter } from '@/form-schemas/inntektOgRefusjonSkjema';

const sykefraværstilfelle = { fom: '01.01.2020', tom: '31.01.2020' };

const validereInntektOgRefusjonSkjema = (
    månedsbeløp: unknown = 10000,
    refusjonsperioder: unknown = [{ ...sykefraværstilfelle, beløp: 10000 }],
    begrunnelse: unknown = 'Annen kilde til endring',
    notat: unknown = 'Dette er et notat',
) => {
    return lagInntektOgRefusjonSchema(sykefraværstilfelle, ['Annen kilde til endring']).safeParse({
        månedsbeløp: månedsbeløp,
        refusjonsperioder: refusjonsperioder,
        begrunnelse: begrunnelse,
        notat: notat,
    });
};

const hentFeilmelding = (result: { success: boolean; error?: ZodError }) => result.error?.issues[0]?.message;
const defaultRefusjonsperioder = [
    {
        ...sykefraværstilfelle,
        beløp: 1000,
    },
];

describe('InntektOgRefusjonSkjema', () => {
    it('skal validere gyldig skjema', () => {
        expect(validereInntektOgRefusjonSkjema().error).toBe(undefined);
    });
    it('skal feile ved ugyldig månedsbeløp', () => {
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema('tekst'))).toBe('Månedsbeløp må være et tall');
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(-1))).toBe('Månedsbeløp må være større enn 0');
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(''))).toBe('Månedsbeløp er påkrevd');
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(null))).toBe('Månedsbeløp er påkrevd');
    });
    it('skal feile ved ugyldige refusjonsbeløp', () => {
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(10000, [{ ...sykefraværstilfelle, beløp: -1 }]))).toBe(
            'Månedlig refusjonsbeløp må være større eller lik 0',
        );
        expect(
            hentFeilmelding(validereInntektOgRefusjonSkjema(10000, [{ ...sykefraværstilfelle, beløp: 'tekst' }])),
        ).toBe('Månedlig refusjonsbeløp må være et tall');
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(10000, [{ ...sykefraværstilfelle, beløp: '' }]))).toBe(
            'Månedsbeløp refusjonsbeløp er påkrevd',
        );
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(10000, [{ ...sykefraværstilfelle, beløp: null }]))).toBe(
            'Månedsbeløp refusjonsbeløp er påkrevd',
        );
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, [{ fom: '31.01.2020', tom: '01.01.2020', beløp: 10000 }]),
            ),
        ).toBe('Fra og med dato må være før til og med dato');
    });
    it('skal feile om det ikke finnes refusjonsperioder', () => {
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(10000, []))).toBe(
            'Det må oppgis minst én refusjonsperiode',
        );
    });
    it('skal feile om refusjonsperioder ikke dekker sykefraværstilfellet', () => {
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, [
                    { fom: sykefraværstilfelle.fom, tom: '02.01.2020', beløp: 10000 },
                    { fom: '04.01.2020', tom: '10.01.2020', beløp: 10000 },
                    { fom: '11.01.2020', tom: sykefraværstilfelle.tom, beløp: 10000 },
                ]),
            ),
        ).toBe('Oppgitte refusjonsperioder må dekke hele sykefraværstilfellet');
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, [
                    { fom: sykefraværstilfelle.fom, tom: '30.01.2020', beløp: 10000 },
                ]),
            ),
        ).toBe('Oppgitte refusjonsperioder må dekke hele sykefraværstilfellet');
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, [
                    { fom: '02.01.2020', tom: sykefraværstilfelle.tom, beløp: 10000 },
                ]),
            ),
        ).toBe('Oppgitte refusjonsperioder må dekke hele sykefraværstilfellet');
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, [{ fom: '02.01.2020', tom: '30.01.2020', beløp: 10000 }]),
            ),
        ).toBe('Oppgitte refusjonsperioder må dekke hele sykefraværstilfellet');
    });
    it('skal feile om refusjonsperioder overlapper', () => {
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, [
                    { fom: sykefraværstilfelle.fom, tom: '02.01.2020', beløp: 10000 },
                    { fom: '02.01.2020', tom: sykefraværstilfelle.tom, beløp: 10000 },
                ]),
            ),
        ).toBe('Oppgitte refusjonsperioder må ikke overlappe');
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, [
                    { fom: sykefraværstilfelle.fom, tom: '10.01.2020', beløp: 10000 },
                    { fom: '04.01.2020', tom: sykefraværstilfelle.tom, beløp: 10000 },
                ]),
            ),
        ).toBe('Oppgitte refusjonsperioder må ikke overlappe');
    });
    it('skal feile ved ugyldig begrunnelse', () => {
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(10000, defaultRefusjonsperioder, 'feil'))).toBe(
            'Ugyldig begrunnelse',
        );
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(10000, defaultRefusjonsperioder, null))).toBe(
            'Begrunnelse er påkrevd',
        );
        expect(hentFeilmelding(validereInntektOgRefusjonSkjema(10000, defaultRefusjonsperioder, ''))).toBe(
            'Begrunnelse er påkrevd',
        );
    });
    it('skal feile ved ugyldig notat', () => {
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, defaultRefusjonsperioder, 'Annen kilde til endring', ''),
            ),
        ).toBe('Notat er påkrevd');
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, defaultRefusjonsperioder, 'Annen kilde til endring', null),
            ),
        ).toBe('Notat må være en tekst');
        expect(
            hentFeilmelding(
                validereInntektOgRefusjonSkjema(10000, defaultRefusjonsperioder, 'Annen kilde til endring', 123),
            ),
        ).toBe('Notat må være en tekst');
    });
    describe('Hjelpefunksjoner', () => {
        it('skal sortere datoer synkende', () => {
            const usorterteDatoer = ['2020-01-02', '2020-01-10', '2020-01-01', '2020-01-04', '2020-01-03'];
            const sorterteDatoer = usorterteDatoer.sort(sorter);
            expect(sorterteDatoer.toString()).toBe('2020-01-01,2020-01-02,2020-01-03,2020-01-04,2020-01-10');
        });
    });
});
