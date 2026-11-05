import { lagDagEndringSchema, lagDagEndringSelvstendigSchema } from '@form-schemas/dagEndringSkjema';
import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import {
    Arbeidsdag,
    AvslattMeldingTilNavdag,
    Egenmeldingsdag,
    MeldingTilNavdag,
    Sykedag,
} from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { lagDag } from '@saksbilde/utbetaling/utbetalingstabell/validering.fixtures';

describe('lagDagEndringSchema', () => {
    describe('gradvalidering', () => {
        it('godtar en gyldig grad for en dagtype som kan graderes', () => {
            const resultat = lagDagEndringSchema(50, []).safeParse({ dagtype: 'Syk', grad: 80 });

            expect(resultat.success).toBe(true);
        });

        it('krever grad når dagtypen kan graderes', () => {
            const resultat = lagDagEndringSchema(50, []).safeParse({ dagtype: 'Syk', grad: null });

            expect(resultat.success).toBe(false);
            const gradIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'grad');
            expect(gradIssue?.message).toBe('Velg grad');
        });

        it('rapporterer feil når grad er lavere enn minimumsgrad', () => {
            const resultat = lagDagEndringSchema(50, []).safeParse({ dagtype: 'Syk', grad: 20 });

            expect(resultat.success).toBe(false);
            const gradIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'grad');
            expect(gradIssue?.message).toBe('Grad må være minst 50');
        });

        it('rapporterer feil når grad er høyere enn 100', () => {
            const resultat = lagDagEndringSchema(50, []).safeParse({ dagtype: 'Syk', grad: 120 });

            expect(resultat.success).toBe(false);
            const gradIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'grad');
            expect(gradIssue?.message).toBe('Grad må være 100 eller lavere');
        });

        it('rapporterer feil når grad ikke er et tall', () => {
            // Zod avviser NaN på z.number()-nivå før superRefine kjører, så meldingen
            // her kommer fra selve skjemadefinisjonen, ikke fra lagGradValidering sin
            // egen (i praksis uoppnåelige) NaN-sjekk.
            const resultat = lagDagEndringSchema(50, []).safeParse({ dagtype: 'Syk', grad: NaN });

            expect(resultat.success).toBe(false);
        });

        it('ignorerer gradvalidering for dagtyper som ikke kan graderes', () => {
            const resultat = lagDagEndringSchema(50, []).safeParse({ dagtype: 'Arbeid', grad: null });

            expect(resultat.success).toBe(true);
        });
    });

    describe('gradert annen ytelse', () => {
        const gyldig = {
            dagtype: 'Foreldrepenger',
            grad: null,
            sykepengerGrad: 30,
            gradAndreYtelser: 40,
            gradererAnnenYtelse: true,
        };
        const enDagMedGrad = (grad: number | null, dato = '2020-01-01') => lagDag({ dato, grad });
        const validerFordeling = (verdier: Record<string, unknown>, markerteDager = [enDagMedGrad(70)]) =>
            lagDagEndringSchema(50, markerteDager)
                .safeParse({ ...gyldig, ...verdier })
                .error?.issues.map((issue) => issue.message) ?? [];

        it('godtar gyldige prosenter', () => {
            expect(validerFordeling({})).toEqual([]);
        });

        it('krever at annen ytelse er valgt', () => {
            expect(validerFordeling({ dagtype: '' })).toEqual(['Annen ytelse er påkrevd']);
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
    });

    describe('egenmelding kan ikke overstyres til Syk eller SykNav', () => {
        it('rapporterer feil når en egenmeldingsdag endres til Syk', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: Egenmeldingsdag })];

            const resultat = lagDagEndringSchema(50, markerteDager).safeParse({ dagtype: 'Syk', grad: 100 });

            expect(resultat.success).toBe(false);
            const dagtypeIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'dagtype');
            expect(dagtypeIssue?.message).toBe('Du kan ikke overstyre Egenmelding til Syk');
        });

        it('rapporterer feil med riktig visningstekst når en egenmeldingsdag endres til SykNav', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: Egenmeldingsdag })];

            const resultat = lagDagEndringSchema(50, markerteDager).safeParse({ dagtype: 'SykNav', grad: 100 });

            expect(resultat.success).toBe(false);
            const dagtypeIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'dagtype');
            expect(dagtypeIssue?.message).toBe('Du kan ikke overstyre Egenmelding til Syk (Nav)');
        });

        it('godtar Syk når ingen av de markerte dagene er egenmelding', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: Sykedag })];

            const resultat = lagDagEndringSchema(50, markerteDager).safeParse({ dagtype: 'Syk', grad: 100 });

            expect(resultat.success).toBe(true);
        });
    });
});

describe('lagDagEndringSelvstendigSchema', () => {
    describe('gradvalidering', () => {
        it('godtar en gyldig grad for en dagtype som kan graderes', () => {
            const resultat = lagDagEndringSelvstendigSchema(50, []).safeParse({ dagtype: 'Syk', grad: 80 });

            expect(resultat.success).toBe(true);
        });

        it('rapporterer feil når grad er lavere enn minimumsgrad', () => {
            const resultat = lagDagEndringSelvstendigSchema(50, []).safeParse({ dagtype: 'Syk', grad: 20 });

            expect(resultat.success).toBe(false);
            const gradIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'grad');
            expect(gradIssue?.message).toBe('Grad må være minst 50');
        });

        it('ignorerer gradvalidering for MeldingTilNav, som ikke kan graderes', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: MeldingTilNavdag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'MeldingTilNav',
                grad: null,
            });

            expect(resultat.success).toBe(true);
        });
    });

    describe('isolasjon mellom MeldingTilNav/AvslattMeldingTilNav og andre dagtyper', () => {
        const meldingIsolasjon = 'Melding til Nav og Avslått melding til Nav kan kun endres til hverandre';

        it('godtar endring fra MeldingTilNav til AvslattMeldingTilNav', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: MeldingTilNavdag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'AvslattMeldingTilNav',
                grad: null,
            });

            expect(resultat.success).toBe(true);
        });

        it('godtar endring fra AvslattMeldingTilNav til MeldingTilNav', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: AvslattMeldingTilNavdag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'MeldingTilNav',
                grad: null,
            });

            expect(resultat.success).toBe(true);
        });

        it('rapporterer feil når en MeldingTilNav-dag endres til Syk', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: MeldingTilNavdag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'Syk',
                grad: 100,
            });

            expect(resultat.success).toBe(false);
            const dagtypeIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'dagtype');
            expect(dagtypeIssue?.message).toBe(meldingIsolasjon);
        });

        it('rapporterer feil når en AvslattMeldingTilNav-dag endres til Arbeid', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: AvslattMeldingTilNavdag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'Arbeid',
                grad: null,
            });

            expect(resultat.success).toBe(false);
            const dagtypeIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'dagtype');
            expect(dagtypeIssue?.message).toBe(meldingIsolasjon);
        });

        it('rapporterer feil når en Syk-dag endres til MeldingTilNav', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: Sykedag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'MeldingTilNav',
                grad: null,
            });

            expect(resultat.success).toBe(false);
            const dagtypeIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'dagtype');
            expect(dagtypeIssue?.message).toBe(meldingIsolasjon);
        });

        it('rapporterer feil når en Arbeid-dag endres til AvslattMeldingTilNav', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: Arbeidsdag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'AvslattMeldingTilNav',
                grad: null,
            });

            expect(resultat.success).toBe(false);
            const dagtypeIssue = resultat.error?.issues.find((issue) => issue.path[0] === 'dagtype');
            expect(dagtypeIssue?.message).toBe(meldingIsolasjon);
        });

        it('godtar endring til Syk når ingen av de markerte dagene er MeldingTilNav-type', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: Arbeidsdag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'Syk',
                grad: 100,
            });

            expect(resultat.success).toBe(true);
        });

        it('godtar Syk-til-Syk («no-op») uten å utløse isolasjonsregelen', () => {
            const markerteDager = [lagDag({ dato: '2020-01-01', dag: Sykedag })];

            const resultat = lagDagEndringSelvstendigSchema(50, markerteDager).safeParse({
                dagtype: 'Syk',
                grad: 100,
            });

            expect(resultat.success).toBe(true);
        });
    });
});

describe.each([
    ['arbeidstaker', lagDagEndringSchema],
    ['selvstendig', lagDagEndringSelvstendigSchema],
])('dager avslått etter oppholdskravet (%s)', (_, lagSchema) => {
    it('kan ikke overstyres', () => {
        const markerteDager = [
            lagDag({ dato: '2024-07-16', dag: Sykedag, begrunnelser: [ApiBegrunnelse.OPPHOLDSKRAV] }),
            lagDag({ dato: '2024-07-17', dag: Sykedag }),
            lagDag({ dato: '2024-07-15', dag: Sykedag, begrunnelser: [ApiBegrunnelse.OPPHOLDSKRAV] }),
        ];

        const resultat = lagSchema(50, markerteDager).safeParse({ dagtype: 'Syk', grad: 100 });

        expect(resultat.success).toBe(false);
        expect(resultat.error?.issues.map((issue) => issue.message)).toContain(
            '15.07.2024, 16.07.2024 er avslått etter oppholdskravet. Gjør om vurderingen av oppholdskravet før du endrer dagene.',
        );
    });

    it('godtar dager uten avslag etter oppholdskravet', () => {
        const markerteDager = [
            lagDag({ dato: '2024-07-15', dag: Sykedag, begrunnelser: [ApiBegrunnelse.SYKEPENGEDAGER_OPPBRUKT] }),
        ];

        const resultat = lagSchema(50, markerteDager).safeParse({ dagtype: 'Syk', grad: 100 });

        expect(resultat.success).toBe(true);
    });
});
