import { ZodError } from 'zod/v4';

import { lagAndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';

const validerAndreYtelserSkjema = (
    ytelse: unknown = 'Foreldrepenger',
    perioder: unknown = [{ fom: '01.01.2020', tom: '03.01.2020', grad: 60 }],
    notat: unknown = 'Dette er et notat',
    alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [],
) => {
    const sykefraværstilfelleperioder = [
        {
            fom: '2020-01-01',
            tom: '2020-02-19',
        },
    ];

    return lagAndreYtelserSchema(sykefraværstilfelleperioder, alleGraderteAndreYtelser).safeParse({
        ytelse: ytelse,
        perioder: perioder,
        notat: notat,
    });
};

const hentFeilmelding = (result: { success: boolean; error?: ZodError }) => result.error?.issues[0]?.message;

describe('andre ytelser skjemavalidering', () => {
    it('skal validere gyldig skjema', () => {
        expect(validerAndreYtelserSkjema().success).toBe(true);
    });

    it('skal kreve gyldig ytelse', () => {
        expect(hentFeilmelding(validerAndreYtelserSkjema('Dagpenger'))).toBe('Gyldig ytelse er påkrevd');
    });

    it('fom skal være gyldig dato', () => {
        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema('Foreldrepenger', [{ fom: '32.01.2020', tom: '03.01.2020', grad: 100 }]),
            ),
        ).toBe('Fra og med-datoen er ikke en gyldig norsk dato');
    });

    it('tom skal være gyldig dato', () => {
        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema('Foreldrepenger', [{ fom: '01.01.2020', tom: '99.01.2020', grad: 100 }]),
            ),
        ).toBe('Til og med-datoen er ikke en gyldig norsk dato');
    });

    it('fom skal være før tom', () => {
        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema('Foreldrepenger', [{ fom: '03.01.2020', tom: '01.01.2020', grad: 60 }]),
            ),
        ).toBe('Fra og med-dato må være før eller lik til og med-dato');
    });

    it('periode skal være innenfor et sykefraværstilfelle', () => {
        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema('Foreldrepenger', [{ fom: '01.01.2020', tom: '20.02.2020', grad: 60 }]),
            ),
        ).toBe('Oppgitt periode må være innenfor et sykefraværstilfelle');
    });

    it('grad kan være max 99, hvis 100 burde dagen overstyres', () => {
        expect(
            validerAndreYtelserSkjema('Foreldrepenger', [{ fom: '01.01.2020', tom: '03.01.2020', grad: 99 }]).success,
        ).toBe(true);
    });

    it('grad kan ikke være 100, da bør dagen overstyres', () => {
        expect(
            validerAndreYtelserSkjema('Foreldrepenger', [{ fom: '01.01.2020', tom: '03.01.2020', grad: 100 }]).success,
        ).toBe(false);
    });

    it('grad må være minst 1', () => {
        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema('Foreldrepenger', [{ fom: '01.01.2020', tom: '03.01.2020', grad: 0 }]),
            ),
        ).toBe('Grad må være minst 1');
    });

    it('notat må fylles ut', () => {
        expect(hentFeilmelding(validerAndreYtelserSkjema('Foreldrepenger', undefined, ''))).toBe(
            'Notat til beslutter er påkrevd',
        );
    });

    it('samlet gradering kan ikke overstige 100 % når andre lagrede ytelser overlapper i tid', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelseType: 'PLEIEPENGER',
                fjernet: false,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-05', grad: 50 }],
            },
        ];

        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema(
                    'Foreldrepenger',
                    [{ fom: '03.01.2020', tom: '10.01.2020', grad: 60 }],
                    'Dette er et notat',
                    alleGraderteAndreYtelser,
                ),
            ),
        ).toBe('Samlet gradering for perioden kan ikke overstige 100 %');
    });

    it('fjernede ytelser regnes ikke med i valideringen', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelseType: 'PLEIEPENGER',
                fjernet: true,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-05', grad: 50 }],
            },
        ];

        expect(
            validerAndreYtelserSkjema(
                'Foreldrepenger',
                [{ fom: '03.01.2020', tom: '10.01.2020', grad: 60 }],
                'Dette er et notat',
                alleGraderteAndreYtelser,
            ).success,
        ).toBe(true);
    });
});
