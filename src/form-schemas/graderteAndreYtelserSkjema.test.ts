import { lagGraderteAndreYtelserSchema } from '@form-schemas/graderteAndreYtelserSkjema';
import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import {
    Feriedag,
    Navhelgedag,
    Sykedag,
    SykedagNav,
} from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { lagDag } from '@saksbilde/utbetaling/utbetalingstabell/validering.fixtures';

describe('lagGraderteAndreYtelserSchema', () => {
    const gyldig = {
        ytelse: 'Foreldrepenger',
        sykepengerGrad: 30,
        gradAndreYtelser: 40,
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
        expect(validerFordeling({ ytelse: '' })).toEqual(['Annen ytelse er påkrevd']);
    });

    it('viser bare at annen ytelse mangler når verken ytelse eller grader er fylt ut', () => {
        expect(validerFordeling({ ytelse: '', sykepengerGrad: null, gradAndreYtelser: null })).toEqual([
            'Annen ytelse er påkrevd',
        ]);
    });

    it('krever verdi i alle feltene', () => {
        expect(validerFordeling({ sykepengerGrad: null, gradAndreYtelser: null })).toEqual([
            'Grad for sykepenger er påkrevd',
            'Grad for foreldrepenger er påkrevd',
        ]);
    });

    describe('sykdomsgraden', () => {
        it.each([1, 70])('godtar %i når sykdomsgraden før fordeling er 70', (sykepengerGrad) => {
            expect(validerFordeling({ sykepengerGrad, gradAndreYtelser: 100 - sykepengerGrad })).toEqual([]);
        });

        it.each([0, 71])('avviser %i når sykdomsgraden før fordeling er 70', (sykepengerGrad) => {
            expect(validerFordeling({ sykepengerGrad, gradAndreYtelser: 29 })).toContain(
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

        it.each([Feriedag, Navhelgedag])('avviser en klynge med $speilDagtype', (dag) => {
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
                    gradertAnnenYtelse: { sykdomsgradFørFordeling: 100, sykdomsgrad: 60, andreYtelseGrad: 40 },
                }),
                enDagMedGrad(100, '2020-01-02'),
            ];

            expect(validerFordeling({ sykepengerGrad: 50, gradAndreYtelser: 50 }, markerteDager)).toEqual([]);
        });

        it('viser hvorfor dagene ikke kan fordeles før annen ytelse er valgt', () => {
            const markerteDager = [enDagMedGrad(80, '2020-01-01'), enDagMedGrad(60, '2020-01-02')];

            expect(validerFordeling({ ytelse: '' }, markerteDager)).toEqual([
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
            expect(validerFordeling({ sykepengerGrad: 1, gradAndreYtelser }, [enDagMedGrad(1)])).toEqual([]);
        });

        it.each([0, 100])('avviser %i', (gradAndreYtelser) => {
            expect(validerFordeling({ sykepengerGrad: 1, gradAndreYtelser }, [enDagMedGrad(1)])).toContain(
                'Grad for foreldrepenger må være mellom 1 og 99 %',
            );
        });
    });

    describe('arbeidsgraden', () => {
        const økerArbeidsgraden =
            'Arbeidsgraden kan ikke øke. Grad for sykepenger og grad for foreldrepenger må til sammen være minst 70 %.';

        it('godtar at sykdomsgrad og ytelsesgrad til sammen er lik sykdomsgraden før fordeling', () => {
            expect(validerFordeling({ sykepengerGrad: 30, gradAndreYtelser: 40 })).toEqual([]);
        });

        it('avviser at arbeidsgraden øker', () => {
            expect(validerFordeling({ sykepengerGrad: 30, gradAndreYtelser: 39 })).toEqual([økerArbeidsgraden]);
        });

        it('godtar at sykdomsgrad og ytelsesgrad til sammen er 100', () => {
            expect(validerFordeling({ sykepengerGrad: 30, gradAndreYtelser: 70 })).toEqual([]);
        });

        it('avviser at arbeidsgraden blir negativ', () => {
            expect(validerFordeling({ sykepengerGrad: 30, gradAndreYtelser: 71 })).toEqual([
                'Samlet grad kan ikke overstige 100 %',
            ]);
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
