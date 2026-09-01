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

const hentFeilmeldinger = (result: { success: boolean; error?: ZodError }) =>
    result.error?.issues.map((issue) => issue.message) ?? [];

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

    it('samlet gradering kan ikke overstige 99 % når andre lagrede ytelser overlapper i tid', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelserType: 'PLEIEPENGER',
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
        ).toBe(
            'Samlet gradering på tvers av alle ytelser kan ikke overstige 99 %. Grensen overskrides 03.01.2020–05.01.2020.',
        );
    });

    it('samlet gradering på nøyaktig 100 % avvises, med dagen det gjelder', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelserType: 'OMSORGSPENGER',
                fjernet: false,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-01', grad: 50 }],
            },
        ];

        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema(
                    'Foreldrepenger',
                    [{ fom: '01.01.2020', tom: '01.01.2020', grad: 50 }],
                    'Dette er et notat',
                    alleGraderteAndreYtelser,
                ),
            ),
        ).toBe('Samlet gradering på tvers av alle ytelser kan ikke overstige 99 %. Grensen overskrides 01.01.2020.');
    });

    it('lister opp flere adskilte datoer over grensen', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelserType: 'OMSORGSPENGER',
                fjernet: false,
                perioder: [
                    { fom: '2020-01-01', tom: '2020-01-02', grad: 60 },
                    { fom: '2020-01-05', tom: '2020-01-05', grad: 60 },
                ],
            },
        ];

        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema(
                    'Foreldrepenger',
                    [{ fom: '01.01.2020', tom: '10.01.2020', grad: 50 }],
                    'Dette er et notat',
                    alleGraderteAndreYtelser,
                ),
            ),
        ).toBe(
            'Samlet gradering på tvers av alle ytelser kan ikke overstige 99 %. Grensen overskrides 01.01.2020–02.01.2020, 05.01.2020.',
        );
    });

    it('samlet gradering på 99 % er tillatt', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelserType: 'OMSORGSPENGER',
                fjernet: false,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-01', grad: 50 }],
            },
        ];

        expect(
            validerAndreYtelserSkjema(
                'Foreldrepenger',
                [{ fom: '01.01.2020', tom: '01.01.2020', grad: 49 }],
                'Dette er et notat',
                alleGraderteAndreYtelser,
            ).success,
        ).toBe(true);
    });

    it('fjernede ytelser regnes ikke med i graderingsvalideringen', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelserType: 'PLEIEPENGER',
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

    it('perioder i samme skjema kan ikke overlappe', () => {
        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema('Foreldrepenger', [
                    { fom: '01.01.2020', tom: '10.01.2020', grad: 30 },
                    { fom: '10.01.2020', tom: '15.01.2020', grad: 30 },
                ]),
            ),
        ).toBe('Perioden overlapper med en annen periode i skjemaet');
    });

    it('perioder i samme skjema kan ligge etter hverandre uten å overlappe', () => {
        expect(
            validerAndreYtelserSkjema('Foreldrepenger', [
                { fom: '01.01.2020', tom: '10.01.2020', grad: 30 },
                { fom: '11.01.2020', tom: '15.01.2020', grad: 30 },
            ]).success,
        ).toBe(true);
    });

    it('perioden kan ikke overlappe med en lagret periode for samme ytelse', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelserType: 'FORELDREPENGER',
                fjernet: false,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-05', grad: 20 }],
            },
        ];

        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema(
                    'Foreldrepenger',
                    [{ fom: '03.01.2020', tom: '10.01.2020', grad: 20 }],
                    'Dette er et notat',
                    alleGraderteAndreYtelser,
                ),
            ),
        ).toBe('Perioden overlapper med en lagret periode for samme ytelse');
    });

    it('perioden kan overlappe med en lagret periode for en annen ytelse', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelserType: 'PLEIEPENGER',
                fjernet: false,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-05', grad: 20 }],
            },
        ];

        expect(
            validerAndreYtelserSkjema(
                'Foreldrepenger',
                [{ fom: '03.01.2020', tom: '10.01.2020', grad: 20 }],
                'Dette er et notat',
                alleGraderteAndreYtelser,
            ).success,
        ).toBe(true);
    });

    it('perioden kan ikke overlappe med en fjernet periode for samme ytelse', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'annen-ytelse',
                andreYtelserType: 'FORELDREPENGER',
                fjernet: true,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-05', grad: 20 }],
            },
        ];

        expect(
            hentFeilmelding(
                validerAndreYtelserSkjema(
                    'Foreldrepenger',
                    [{ fom: '03.01.2020', tom: '10.01.2020', grad: 20 }],
                    'Dette er et notat',
                    alleGraderteAndreYtelser,
                ),
            ),
        ).toBe('Perioden overlapper med en lagret periode for samme ytelse');
    });

    it('ytelsen som gjenopprettes sjekkes ikke mot sin egen fjernede periode', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'gjeldende-ytelse',
                andreYtelserType: 'FORELDREPENGER',
                fjernet: true,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-05', grad: 20 }],
            },
        ];

        expect(
            lagAndreYtelserSchema(
                [{ fom: '2020-01-01', tom: '2020-02-19' }],
                alleGraderteAndreYtelser,
                'gjeldende-ytelse',
            ).safeParse({
                ytelse: 'Foreldrepenger',
                perioder: [{ fom: '01.01.2020', tom: '05.01.2020', grad: 20 }],
                notat: 'Dette er et notat',
            }).success,
        ).toBe(true);
    });

    it('ytelsen som endres sjekkes ikke mot seg selv', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'gjeldende-ytelse',
                andreYtelserType: 'FORELDREPENGER',
                fjernet: false,
                perioder: [{ fom: '2020-01-01', tom: '2020-01-05', grad: 20 }],
            },
        ];

        expect(
            lagAndreYtelserSchema(
                [{ fom: '2020-01-01', tom: '2020-02-19' }],
                alleGraderteAndreYtelser,
                'gjeldende-ytelse',
            ).safeParse({
                ytelse: 'Foreldrepenger',
                perioder: [{ fom: '03.01.2020', tom: '10.01.2020', grad: 20 }],
                notat: 'Dette er et notat',
            }).success,
        ).toBe(true);
    });

    it('overlappende perioder gir overlappfeil, ikke graderingsfeil', () => {
        const alleGraderteAndreYtelser: ApiGraderteAndreYtelser[] = [
            {
                andreYtelserId: 'fjernet-ytelse',
                andreYtelserType: 'FORELDREPENGER',
                fjernet: true,
                perioder: [{ fom: '2022-08-16', tom: '2022-08-19', grad: 50 }],
            },
        ];

        const feilmeldinger = hentFeilmeldinger(
            lagAndreYtelserSchema([{ fom: '2022-08-01', tom: '2022-09-30' }], alleGraderteAndreYtelser).safeParse({
                ytelse: 'Foreldrepenger',
                perioder: [
                    { fom: '01.08.2022', tom: '31.08.2022', grad: 50 },
                    { fom: '10.08.2022', tom: '15.08.2022', grad: 20 },
                ],
                notat: 'Dette er et notat',
            }),
        );

        expect(feilmeldinger).toEqual([
            'Perioden overlapper med en annen periode i skjemaet',
            'Perioden overlapper med en annen periode i skjemaet',
        ]);
        expect(feilmeldinger.some((melding) => melding.startsWith('Samlet gradering'))).toBe(false);
    });
});
