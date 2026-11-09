import { lagGraderteAndreYtelserSchema } from '@form-schemas/graderteAndreYtelserSkjema';
import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import {
    Feriedag,
    Feriehelgedag,
    FriskHelgedag,
    Helgedag,
    Navhelgedag,
    Sykedag,
    SykedagNav,
} from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { lagDag } from '@saksbilde/utbetaling/utbetalingstabell/validering.fixtures';

describe('lagGraderteAndreYtelserSchema', () => {
    const gyldig = {
        ytelser: ['FORELDREPENGER'],
        sykepengerGrad: 30,
        andreYtelserGrader: { FORELDREPENGER: 40 },
        begrunnelse: 'Begrunnelse for klyngen',
    };
    function enDagMedGrad(grad: number | null, dato = '2020-01-01') {
        return lagDag({ dato, grad });
    }
    function validerFordeling(verdier: Record<string, unknown>, markerteDager = [enDagMedGrad(70)]) {
        return (
            lagGraderteAndreYtelserSchema(markerteDager)
                .safeParse({ ...gyldig, ...verdier })
                .error?.issues.map((issue) => issue.message) ?? []
        );
    }

    it('godtar gyldige prosenter', () => {
        expect(validerFordeling({})).toEqual([]);
    });

    it('krever at annen ytelse er valgt', () => {
        expect(validerFordeling({ ytelser: [] })).toEqual(['Annen ytelse er påkrevd']);
    });

    it('viser bare at annen ytelse mangler når verken ytelse eller grader er fylt ut', () => {
        expect(
            validerFordeling({ ytelser: [], sykepengerGrad: null, andreYtelserGrader: { FORELDREPENGER: null } }),
        ).toEqual(['Annen ytelse er påkrevd']);
    });

    it.each(['', '   '])('krever begrunnelse for klyngen, ikke «%s»', (begrunnelse) => {
        expect(validerFordeling({ begrunnelse })).toEqual(['Begrunnelse må fylles ut']);
    });

    it('krever verdi i alle feltene', () => {
        expect(validerFordeling({ sykepengerGrad: null, andreYtelserGrader: { FORELDREPENGER: null } })).toEqual([
            'Grad for sykepenger er påkrevd',
            'Grad for foreldrepenger er påkrevd',
        ]);
    });

    describe('sykdomsgraden', () => {
        it.each([1, 70])('godtar %i når sykdomsgraden før fordeling er 70', (sykepengerGrad) => {
            expect(
                validerFordeling({ sykepengerGrad, andreYtelserGrader: { FORELDREPENGER: 100 - sykepengerGrad } }),
            ).toEqual([]);
        });

        it.each([0, 71])('avviser %i når sykdomsgraden før fordeling er 70', (sykepengerGrad) => {
            expect(validerFordeling({ sykepengerGrad, andreYtelserGrader: { FORELDREPENGER: 29 } })).toContain(
                'Grad for sykepenger må være mellom 1 og 70 %',
            );
        });
    });

    describe('klyngen', () => {
        it('godtar sykedager og sykedager NAV med samme sykdomsgrad', () => {
            const markerteDager = [
                lagDag({ dato: '2020-01-01', dag: Sykedag, grad: 70 }),
                lagDag({ dato: '2020-01-02', dag: SykedagNav, grad: 70 }),
            ];

            expect(validerFordeling({}, markerteDager)).toEqual([]);
        });

        it('godtar helgedager med sykdom i klyngen', () => {
            const markerteDager = [
                lagDag({ dato: '2020-01-03', dag: Sykedag, grad: 70 }),
                lagDag({ dato: '2020-01-04', dag: Navhelgedag, grad: 70 }),
                lagDag({ dato: '2020-01-05', dag: Navhelgedag, grad: 70 }),
                lagDag({ dato: '2020-01-06', dag: SykedagNav, grad: 70 }),
            ];

            expect(validerFordeling({}, markerteDager)).toEqual([]);
        });

        it.each([Feriedag, FriskHelgedag, Feriehelgedag, Helgedag])('avviser en klynge med $speilDagtype', (dag) => {
            const markerteDager = [enDagMedGrad(70, '2020-01-01'), lagDag({ dato: '2020-01-02', dag, grad: 70 })];

            expect(validerFordeling({}, markerteDager)).toEqual([
                'Andre ytelser kan bare fordeles på sykedager. Fjern de andre dagene fra utvalget.',
            ]);
        });

        it('sammenligner en dag med fordeling med sykdomsgraden før fordelingen', () => {
            const markerteDager = [
                lagDag({
                    dato: '2020-01-01',
                    grad: 100,
                    gradertAnnenYtelse: {
                        sykdomsgradFørFordeling: 100,
                        sykdomsgrad: 60,
                        andreYtelserGrader: { FORELDREPENGER: 40 },
                        begrunnelse: 'Lagret begrunnelse',
                    },
                }),
                enDagMedGrad(100, '2020-01-02'),
            ];

            expect(
                validerFordeling({ sykepengerGrad: 50, andreYtelserGrader: { FORELDREPENGER: 50 } }, markerteDager),
            ).toEqual([]);
        });

        it('viser hvorfor dagene ikke kan fordeles før annen ytelse er valgt', () => {
            const markerteDager = [enDagMedGrad(80, '2020-01-01'), enDagMedGrad(60, '2020-01-02')];

            expect(validerFordeling({ ytelser: [] }, markerteDager)).toEqual([
                'Annen ytelse er påkrevd',
                'Andre ytelser kan bare fordeles på dager med samme sykdomsgrad. De valgte dagene har 80 % og 60 %.',
            ]);
        });

        it('avviser en klynge med ulik sykdomsgrad', () => {
            const markerteDager = [
                enDagMedGrad(80, '2020-01-01'),
                enDagMedGrad(60, '2020-01-02'),
                enDagMedGrad(80, '2020-01-03'),
            ];

            expect(validerFordeling({}, markerteDager)).toEqual([
                'Andre ytelser kan bare fordeles på dager med samme sykdomsgrad. De valgte dagene har 80 % og 60 %.',
            ]);
        });
    });

    describe('ytelsesgraden', () => {
        it.each([1, 99])('godtar %i', (gradAndreYtelser) => {
            expect(
                validerFordeling({ sykepengerGrad: 1, andreYtelserGrader: { FORELDREPENGER: gradAndreYtelser } }, [
                    enDagMedGrad(1),
                ]),
            ).toEqual([]);
        });

        it.each([0, 100])('avviser %i', (gradAndreYtelser) => {
            expect(
                validerFordeling({ sykepengerGrad: 1, andreYtelserGrader: { FORELDREPENGER: gradAndreYtelser } }, [
                    enDagMedGrad(1),
                ]),
            ).toContain('Grad for foreldrepenger må være mellom 1 og 99 %');
        });
    });

    describe('arbeidsgraden', () => {
        const økerArbeidsgraden =
            'Arbeidsgraden kan ikke øke. Grad for sykepenger og grad for foreldrepenger må til sammen være minst 70 %.';

        it('godtar at sykdomsgrad og ytelsesgrad til sammen er lik sykdomsgraden før fordeling', () => {
            expect(validerFordeling({ sykepengerGrad: 30, andreYtelserGrader: { FORELDREPENGER: 40 } })).toEqual([]);
        });

        it('avviser at arbeidsgraden øker', () => {
            expect(validerFordeling({ sykepengerGrad: 30, andreYtelserGrader: { FORELDREPENGER: 39 } })).toEqual([
                økerArbeidsgraden,
            ]);
        });

        it('godtar at sykdomsgrad og ytelsesgrad til sammen er 100', () => {
            expect(validerFordeling({ sykepengerGrad: 30, andreYtelserGrader: { FORELDREPENGER: 70 } })).toEqual([]);
        });

        it('avviser at arbeidsgraden blir negativ', () => {
            expect(validerFordeling({ sykepengerGrad: 30, andreYtelserGrader: { FORELDREPENGER: 71 } })).toEqual([
                'Samlet grad kan ikke overstige 100 %',
            ]);
        });
    });

    describe('flere ytelser', () => {
        const toYtelser = { ytelser: ['FORELDREPENGER', 'OMSORGSPENGER'] };

        it('godtar flere ytelser når fordelingen går opp', () => {
            expect(
                validerFordeling({
                    ...toYtelser,
                    sykepengerGrad: 30,
                    andreYtelserGrader: { FORELDREPENGER: 20, OMSORGSPENGER: 20 },
                }),
            ).toEqual([]);
        });

        it('krever grad for hver valgte ytelse', () => {
            expect(
                validerFordeling({ ...toYtelser, andreYtelserGrader: { FORELDREPENGER: 40, OMSORGSPENGER: null } }),
            ).toEqual(['Grad for omsorgspenger er påkrevd']);
        });

        it('avviser en grad utenfor 1–99 for hver ytelse', () => {
            expect(
                validerFordeling({ ...toYtelser, andreYtelserGrader: { FORELDREPENGER: 40, OMSORGSPENGER: 0 } }),
            ).toContain('Grad for omsorgspenger må være mellom 1 og 99 %');
        });

        it('regner arbeidsgraden med summen av ytelsene', () => {
            expect(
                validerFordeling({
                    ...toYtelser,
                    sykepengerGrad: 30,
                    andreYtelserGrader: { FORELDREPENGER: 20, OMSORGSPENGER: 19 },
                }),
            ).toEqual([
                'Arbeidsgraden kan ikke øke. Grad for sykepenger, grad for foreldrepenger og grad for omsorgspenger må til sammen være minst 70 %.',
            ]);
        });

        it('avviser at sykdomsgraden og ytelsene til sammen er over 100 %', () => {
            expect(
                validerFordeling({
                    ...toYtelser,
                    sykepengerGrad: 30,
                    andreYtelserGrader: { FORELDREPENGER: 40, OMSORGSPENGER: 31 },
                }),
            ).toEqual(['Samlet grad kan ikke overstige 100 %']);
        });

        it('ser bort fra grader for ytelser som ikke er valgt', () => {
            expect(validerFordeling({ andreYtelserGrader: { FORELDREPENGER: 40, OMSORGSPENGER: null } })).toEqual([]);
        });
    });

    it('avviser dager som er avslått etter oppholdskravet', () => {
        const markerteDager = [
            lagDag({ dato: '2024-07-15', dag: Sykedag, grad: 70, begrunnelser: [ApiBegrunnelse.OPPHOLDSKRAV] }),
        ];

        expect(validerFordeling({}, markerteDager)).toEqual([
            '15.07.2024 er avslått etter oppholdskravet. Gjør om vurderingen av oppholdskravet før du endrer dagen.',
        ]);
    });
});
