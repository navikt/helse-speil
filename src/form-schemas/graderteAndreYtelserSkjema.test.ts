import { lagGraderteAndreYtelserSchema } from '@form-schemas/graderteAndreYtelserSkjema';
import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import { Sykedag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
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

        it('bruker den laveste sykdomsgraden før fordeling av de markerte dagene', () => {
            const markerteDager = [enDagMedGrad(80, '2020-01-01'), enDagMedGrad(60, '2020-01-02')];

            expect(validerFordeling({ sykepengerGrad: 61, gradAndreYtelser: 39 }, markerteDager)).toEqual([
                'Grad for sykepenger må være mellom 1 og 60 %',
            ]);
        });
    });

    describe('dager uten sykdomsgrad', () => {
        it.each([null, 0])('avviser en dag med grad %s, for eksempel en feriedag', (grad) => {
            const markerteDager = [enDagMedGrad(70, '2020-01-01'), enDagMedGrad(grad, '2020-01-02')];

            expect(validerFordeling({}, markerteDager)).toEqual([
                'Andre ytelser kan bare fordeles på dager med sykdomsgrad',
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

        it('bruker den høyeste sykdomsgraden før fordeling av de markerte dagene', () => {
            const markerteDager = [enDagMedGrad(70, '2020-01-01'), enDagMedGrad(40, '2020-01-02')];

            expect(validerFordeling({ sykepengerGrad: 30, gradAndreYtelser: 39 }, markerteDager)).toEqual([
                økerArbeidsgraden,
            ]);
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
