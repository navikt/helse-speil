import { lagDagEndringSchema, lagDagEndringSelvstendigSchema } from '@/form-schemas/dagEndringSkjema';
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
