import {
    finnDagerISluttenAvPerioden,
    finnDagerIStartenAvPerioden,
    getStartOgSluttAvPerioden,
    lagOverstyringSchema,
    overstyringFeilkoder,
} from '@/form-schemas/overstyringSkjema';
import { Arbeidsdag, Egenmeldingsdag, Sykedag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
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

describe('finnDagerISluttenAvPerioden', () => {
    it('returnerer tom liste når sluttenAvPerioden ikke finnes blant dagene', () => {
        const dager = [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })];

        expect(finnDagerISluttenAvPerioden(dager, '2020-01-05')).toEqual([]);
    });

    it('returnerer sammenhengende dager bakover til og med slutten av perioden, i motsatt kronologisk rekkefølge', () => {
        const d1 = lagDag({ dato: '2020-01-01' });
        const d2 = lagDag({ dato: '2020-01-02' });
        const d3 = lagDag({ dato: '2020-01-03' });
        const d4 = lagDag({ dato: '2020-01-04' });

        expect(finnDagerISluttenAvPerioden([d1, d2, d3, d4], '2020-01-04')).toEqual([d4, d3, d2, d1]);
    });

    it('stopper ved brudd i den sammenhengende rekken av dager', () => {
        const d1 = lagDag({ dato: '2020-01-01' });
        const d3 = lagDag({ dato: '2020-01-03' });
        const d4 = lagDag({ dato: '2020-01-04' });

        // d2 (01-02) mangler, så d1 hører ikke med i den sammenhengende rekken som ender på d4
        expect(finnDagerISluttenAvPerioden([d1, d3, d4], '2020-01-04')).toEqual([d4, d3]);
    });
});

describe('finnDagerIStartenAvPerioden', () => {
    it('returnerer tom liste når startenAvPerioden ikke finnes blant dagene', () => {
        const dager = [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })];

        expect(finnDagerIStartenAvPerioden(dager, '2020-01-05')).toEqual([]);
    });

    it('returnerer sammenhengende dager fremover fra og med starten av perioden', () => {
        const d1 = lagDag({ dato: '2020-01-01' });
        const d2 = lagDag({ dato: '2020-01-02' });
        const d3 = lagDag({ dato: '2020-01-03' });
        const d4 = lagDag({ dato: '2020-01-04' });

        expect(finnDagerIStartenAvPerioden([d1, d2, d3, d4], '2020-01-01')).toEqual([d1, d2, d3, d4]);
    });

    it('stopper ved brudd i den sammenhengende rekken av dager', () => {
        const d1 = lagDag({ dato: '2020-01-01' });
        const d2 = lagDag({ dato: '2020-01-02' });
        const d4 = lagDag({ dato: '2020-01-04' });

        // d3 (01-03) mangler, så d4 hører ikke med i den sammenhengende rekken som starter på d1
        expect(finnDagerIStartenAvPerioden([d1, d2, d4], '2020-01-01')).toEqual([d1, d2]);
    });
});

describe('getStartOgSluttAvPerioden', () => {
    it('returnerer tomme strenger når verken førsteOverstyrteDagtype eller sisteOverstyrteDagtype er oppgitt', () => {
        const alleDager = lagAlleDager([lagDag({ dato: '2020-01-01' })]);

        expect(getStartOgSluttAvPerioden(alleDager)).toEqual({ startenAvPerioden: '', sluttenAvPerioden: '' });
    });

    it('finner startenAvPerioden som første dag av en annen type enn førsteOverstyrteDagtype', () => {
        const alleDager = lagAlleDager([
            lagDag({ dato: '2020-01-01', dag: Sykedag }),
            lagDag({ dato: '2020-01-02', dag: Egenmeldingsdag }),
            lagDag({ dato: '2020-01-03', dag: Egenmeldingsdag }),
        ]);

        const { startenAvPerioden } = getStartOgSluttAvPerioden(alleDager, 'Egenmelding');

        expect(startenAvPerioden).toBe('2020-01-01');
    });

    it('finner sluttenAvPerioden som siste dag av en annen type enn sisteOverstyrteDagtype', () => {
        const alleDager = lagAlleDager([
            lagDag({ dato: '2020-01-01', dag: Egenmeldingsdag }),
            lagDag({ dato: '2020-01-02', dag: Egenmeldingsdag }),
            lagDag({ dato: '2020-01-03', dag: Sykedag }),
        ]);

        const { sluttenAvPerioden } = getStartOgSluttAvPerioden(alleDager, undefined, 'Egenmelding');

        expect(sluttenAvPerioden).toBe('2020-01-03');
    });
});
