import { lagOverstyringSchema, overstyringFeilkoder } from '@/form-schemas/overstyringSkjema';
import { Arbeidsdag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import {
    ForventetUtfall,
    andreYtelserScenarioer,
    arbeidIkkeGjenopptattScenarioer,
    arbeidsdagScenarioer,
    egenmeldingScenarioer,
    lagAlleDager,
    lagDag,
    sykNavScenarioer,
} from '@saksbilde/utbetaling/utbetalingstabell/validering.fixtures';

/*
 * Kjører de delte scenariene fra validering.fixtures.ts mot lagOverstyringSchema – det samme
 * skjemaet som brukes i OverstyringForm. I motsetning til den gamle && -kjeden i OverstyringForm
 * kjøres alle sjekkene uavhengig av hverandre, slik at alle regelbrudd rapporteres som issues
 * samtidig. Testene her verifiserer derfor kun om *den aktuelle regelen* rapporterer en issue,
 * uavhengig av om andre regler (som ikke testes av scenarioet) også skulle slå ut.
 */

const forventRegelResultat = (
    resultat: ReturnType<ReturnType<typeof lagOverstyringSchema>['safeParse']>,
    forventet: ForventetUtfall,
    regelkode: string,
) => {
    const issues = resultat.error?.issues ?? [];
    const egenIssue = issues.find((issue) => issue.path[0] === regelkode);

    if (forventet.gyldig) {
        expect(egenIssue).toBeUndefined();
    } else {
        expect(egenIssue).toBeDefined();
        if (forventet.feilkode) {
            expect(egenIssue?.path).toEqual([forventet.feilkode]);
        }
        if (forventet.feilmelding) {
            expect(egenIssue?.message).toBe(forventet.feilmelding);
        }
    }
};

describe('lagOverstyringSchema', () => {
    describe('arbeidsdagvalidering', () => {
        it.each(arbeidsdagScenarioer)('$navn', ({ alleDager, overstyrteDager, erSelvstendig, forventet }) => {
            const resultat = lagOverstyringSchema(
                lagAlleDager(overstyrteDager),
                lagAlleDager(alleDager),
                erSelvstendig,
            ).safeParse({ begrunnelse: 'en begrunnelse' });

            forventRegelResultat(resultat, forventet, overstyringFeilkoder.arbeidsdag);
        });
    });

    describe('andreYtelserValidering', () => {
        it.each(andreYtelserScenarioer)('$navn', ({ alleDager, overstyrteDager, forventet }) => {
            const resultat = lagOverstyringSchema(
                lagAlleDager(overstyrteDager),
                lagAlleDager(alleDager),
                false,
            ).safeParse({ begrunnelse: 'en begrunnelse' });

            forventRegelResultat(resultat, forventet, overstyringFeilkoder.andreYtelser);
        });
    });

    describe('arbeidIkkeGjenopptattValidering', () => {
        it.each(arbeidIkkeGjenopptattScenarioer)('$navn', ({ alleDager, overstyrteDager, forventet }) => {
            const resultat = lagOverstyringSchema(
                lagAlleDager(overstyrteDager),
                lagAlleDager(alleDager),
                false,
            ).safeParse({ begrunnelse: 'en begrunnelse' });

            forventRegelResultat(resultat, forventet, overstyringFeilkoder.arbeidIkkeGjenopptatt);
        });
    });

    describe('sykNavValidering', () => {
        it.each(sykNavScenarioer)('$navn', ({ alleDager, overstyrteDager, forventet }) => {
            const resultat = lagOverstyringSchema(
                lagAlleDager(overstyrteDager),
                lagAlleDager(alleDager),
                false,
            ).safeParse({ begrunnelse: 'en begrunnelse' });

            forventRegelResultat(resultat, forventet, overstyringFeilkoder.sykNav);
        });
    });

    describe('egenmeldingValidering', () => {
        it.each(egenmeldingScenarioer)('$navn', ({ alleDager, overstyrteDager, forventet }) => {
            const resultat = lagOverstyringSchema(
                lagAlleDager(overstyrteDager),
                lagAlleDager(alleDager),
                false,
            ).safeParse({ begrunnelse: 'en begrunnelse' });

            forventRegelResultat(resultat, forventet, overstyringFeilkoder.egenmelding);
        });
    });

    it('rapporterer brudd på flere regler samtidig i stedet for å stoppe ved det første', () => {
        const overstyrteDager = [lagDag({ dato: '2020-01-02', dag: Arbeidsdag, fraType: 'Syk' })];
        const alleDager = [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02', dag: Arbeidsdag })];

        const resultat = lagOverstyringSchema(lagAlleDager(overstyrteDager), lagAlleDager(alleDager), false).safeParse({
            begrunnelse: '',
        });

        expect(resultat.success).toBe(false);
        const feilkoder = resultat.error?.issues.map((issue) => issue.path[0]);
        expect(feilkoder).toEqual(expect.arrayContaining(['begrunnelse', overstyringFeilkoder.arbeidsdag]));
    });
});
