import { lagOverstyringSchema } from '@/form-schemas/overstyringSkjema';
import {
    ForventetUtfall,
    andreYtelserScenarioer,
    arbeidIkkeGjenopptattScenarioer,
    arbeidsdagScenarioer,
    egenmeldingScenarioer,
    lagAlleDager,
    sykNavScenarioer,
} from '@saksbilde/utbetaling/utbetalingstabell/validering.fixtures';

/*
 * Kjører de delte scenariene fra validering.fixtures.ts mot lagOverstyringSchema – det samme
 * skjemaet som brukes i OverstyringForm. Dette speiler hvordan valideringen faktisk kalles i
 * produksjonskoden (en kjede av sjekker som kortslutter ved første feil), i stedet for å teste
 * hver regel isolert slik validering.test.ts gjør mot de gamle Map + setError-funksjonene.
 *
 * To scenarioer fra validering.fixtures.ts ('ignorerer overstyringer som ikke er annen ytelse' og
 * 'ignorerer overstyringer som ikke er syk (nav)') er bevisst utelatt her: de inneholder en
 * arbeidsdag-overstyring som er ugyldig i seg selv, og som derfor korrekt fanges opp av
 * arbeidsdag-sjekken tidligere i kjeden – de tester altså isolasjon som ikke gjelder når
 * valideringen kjøres samlet.
 */

const forventResultat = (
    resultat: ReturnType<ReturnType<typeof lagOverstyringSchema>['safeParse']>,
    forventet: ForventetUtfall,
) => {
    expect(resultat.success).toBe(forventet.gyldig);
    if (!forventet.gyldig) {
        const issues = resultat.error?.issues ?? [];
        expect(issues).toHaveLength(1);
        if (forventet.feilkode) {
            expect(issues[0]?.path).toEqual([forventet.feilkode]);
            expect(issues[0]?.message).toBe(forventet.feilmelding);
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
            ).safeParse({});

            forventResultat(resultat, forventet);
        });
    });

    describe('andreYtelserValidering', () => {
        it.each(andreYtelserScenarioer.filter((s) => s.navn !== 'ignorerer overstyringer som ikke er annen ytelse'))(
            '$navn',
            ({ alleDager, overstyrteDager, forventet }) => {
                const resultat = lagOverstyringSchema(
                    lagAlleDager(overstyrteDager),
                    lagAlleDager(alleDager),
                    false,
                ).safeParse({});

                forventResultat(resultat, forventet);
            },
        );
    });

    describe('arbeidIkkeGjenopptattValidering', () => {
        it.each(arbeidIkkeGjenopptattScenarioer)('$navn', ({ alleDager, overstyrteDager, forventet }) => {
            const resultat = lagOverstyringSchema(
                lagAlleDager(overstyrteDager),
                lagAlleDager(alleDager),
                false,
            ).safeParse({});

            forventResultat(resultat, forventet);
        });
    });

    describe('sykNavValidering', () => {
        it.each(sykNavScenarioer.filter((s) => s.navn !== 'ignorerer overstyringer som ikke er syk (nav)'))(
            '$navn',
            ({ alleDager, overstyrteDager, forventet }) => {
                const resultat = lagOverstyringSchema(
                    lagAlleDager(overstyrteDager),
                    lagAlleDager(alleDager),
                    false,
                ).safeParse({});

                forventResultat(resultat, forventet);
            },
        );
    });

    describe('egenmeldingValidering', () => {
        it.each(egenmeldingScenarioer)('$navn', ({ alleDager, overstyrteDager, forventet }) => {
            const resultat = lagOverstyringSchema(
                lagAlleDager(overstyrteDager),
                lagAlleDager(alleDager),
                false,
            ).safeParse({});

            forventResultat(resultat, forventet);
        });
    });
});
