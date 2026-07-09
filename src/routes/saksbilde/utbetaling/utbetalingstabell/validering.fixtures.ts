import { Kildetype } from '@io/graphql';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import {
    ArbeidIkkeGjenopptattDag,
    Arbeidsdag,
    Egenmeldingsdag,
    Foreldrepengerdag,
    Sykedag,
    SykedagNav,
} from './utbetalingstabelldager';

/*
 * Delte testscenarier for utbetalingstabell-valideringen.
 *
 * Disse er bevisst frikoblet fra dagens funksjonssignaturer (Map + setError-callback) slik at de
 * kan gjenbrukes uendret når valideringen migreres til Zod. Et scenario beskriver kun input
 * (alleDager/overstyrteDager) og forventet utfall (gyldig/ugyldig + feilkode/feilmelding), ikke
 * hvordan valideringen kalles eller hvordan feil rapporteres.
 */

export const lagDag = (overrides: Partial<Utbetalingstabelldag> & { dato: string }): Utbetalingstabelldag =>
    ({
        dag: Sykedag,
        kilde: { __typename: 'Kilde', id: '123', type: Kildetype.Soknad },
        erAGP: false,
        erVentetid: false,
        erAvvist: false,
        erForeldet: false,
        erMaksdato: false,
        ...overrides,
    }) as Utbetalingstabelldag;

export const lagAlleDager = (dager: Utbetalingstabelldag[]): Map<string, Utbetalingstabelldag> =>
    new Map(dager.map((dag) => [dag.dato, dag]));

export type ForventetUtfall = {
    gyldig: boolean;
    feilkode?: string;
    feilmelding?: string;
};

export type ValideringScenario = {
    navn: string;
    alleDager: Utbetalingstabelldag[];
    overstyrteDager: Utbetalingstabelldag[];
    forventet: ForventetUtfall;
};

export type ArbeidsdagScenario = ValideringScenario & { erSelvstendig: boolean };

const arbeidsdagFeilmeldingArbeidsgiver =
    'Du kan ikke overstyre Syk eller Ferie til Arbeidsdag. Arbeidsdag kan legges til i forkant av perioden, i slutten av perioden, eller endres i arbeidsgiverperioden';
const arbeidsdagFeilmeldingSelvstendig =
    'Du kan ikke overstyre fra Syk til Arbeid. Arbeidsdag kan legges til i forkant av perioden, i slutten av perioden, eller endres i ventetiden';

export const arbeidsdagScenarioer: ArbeidsdagScenario[] = [
    {
        navn: 'ingen dager overstyrt til arbeid',
        alleDager: [lagDag({ dato: '2020-01-01' })],
        overstyrteDager: [],
        erSelvstendig: false,
        forventet: { gyldig: true },
    },
    {
        navn: 'fraType Syk, ikke ny dag, ikke i AGP, ikke i slutten av perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' }), lagDag({ dato: '2020-01-03' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Syk' })],
        erSelvstendig: false,
        forventet: {
            gyldig: false,
            feilkode: 'arbeidsdagerKanIkkeOverstyres',
            feilmelding: arbeidsdagFeilmeldingArbeidsgiver,
        },
    },
    {
        navn: 'fraType SykHelg, ikke ny dag, ikke i AGP, ikke i slutten av perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'SykHelg' })],
        erSelvstendig: false,
        forventet: {
            gyldig: false,
            feilkode: 'arbeidsdagerKanIkkeOverstyres',
            feilmelding: arbeidsdagFeilmeldingArbeidsgiver,
        },
    },
    {
        navn: 'fraType Ferie, ikke ny dag, ikke i AGP, ikke i slutten av perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Ferie' })],
        erSelvstendig: false,
        forventet: {
            gyldig: false,
            feilkode: 'arbeidsdagerKanIkkeOverstyres',
            feilmelding: arbeidsdagFeilmeldingArbeidsgiver,
        },
    },
    {
        navn: 'fraType Syk, selvstendig næringsdrivende',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Syk' })],
        erSelvstendig: true,
        forventet: {
            gyldig: false,
            feilkode: 'arbeidsdagerKanIkkeOverstyres',
            feilmelding: arbeidsdagFeilmeldingSelvstendig,
        },
    },
    {
        navn: 'siste dag i perioden (i slutten av perioden), fraType Syk, selvstendig næringsdrivende',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-02', dag: Arbeidsdag, fraType: 'Syk' })],
        erSelvstendig: true,
        forventet: { gyldig: true },
    },
    {
        navn: 'ny dag, fraType Syk',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Syk', erNyDag: true })],
        erSelvstendig: false,
        forventet: { gyldig: true },
    },
    {
        navn: 'i arbeidsgiverperioden, fraType Syk',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Syk', erAGP: true })],
        erSelvstendig: false,
        forventet: { gyldig: true },
    },
    {
        navn: 'i ventetiden, fraType Syk, selvstendig næringsdrivende',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Syk', erVentetid: true })],
        erSelvstendig: true,
        forventet: { gyldig: true },
    },
    {
        navn: 'fraType verken Syk, SykHelg eller Ferie',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Permisjon' })],
        erSelvstendig: false,
        forventet: { gyldig: true },
    },
    {
        navn: 'siste dag i perioden (i slutten av perioden), fraType Syk',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-02', dag: Arbeidsdag, fraType: 'Syk' })],
        erSelvstendig: false,
        forventet: { gyldig: true },
    },
    {
        navn: 'flere sammenhengende dager i slutten av perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' }), lagDag({ dato: '2020-01-03' })],
        overstyrteDager: [
            lagDag({ dato: '2020-01-02', dag: Arbeidsdag, fraType: 'Syk' }),
            lagDag({ dato: '2020-01-03', dag: Arbeidsdag, fraType: 'Syk' }),
        ],
        erSelvstendig: false,
        forventet: { gyldig: true },
    },
    {
        navn: 'dager som ikke henger sammen med slutten av perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' }), lagDag({ dato: '2020-01-03' })],
        overstyrteDager: [
            lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Syk' }),
            lagDag({ dato: '2020-01-03', dag: Arbeidsdag, fraType: 'Syk' }),
        ],
        erSelvstendig: false,
        forventet: {
            gyldig: false,
            feilkode: 'arbeidsdagerKanIkkeOverstyres',
            feilmelding: arbeidsdagFeilmeldingArbeidsgiver,
        },
    },
    {
        navn: 'slutten av perioden finnes ikke i perioden',
        alleDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag }), lagDag({ dato: '2020-01-02', dag: Arbeidsdag })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Syk' })],
        erSelvstendig: false,
        forventet: {
            gyldig: false,
            feilkode: 'arbeidsdagerKanIkkeOverstyres',
            feilmelding: arbeidsdagFeilmeldingArbeidsgiver,
        },
    },
];

export const andreYtelserScenarioer: ValideringScenario[] = [
    {
        navn: 'ingen dager overstyrt til annen ytelse',
        alleDager: [lagDag({ dato: '2020-01-01' })],
        overstyrteDager: [],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er i starten av perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' }), lagDag({ dato: '2020-01-03' })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Foreldrepengerdag })],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er i slutten av perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' }), lagDag({ dato: '2020-01-03' })],
        overstyrteDager: [lagDag({ dato: '2020-01-03', dag: Foreldrepengerdag })],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er midt i perioden, verken i starten eller slutten av perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' }), lagDag({ dato: '2020-01-03' })],
        overstyrteDager: [lagDag({ dato: '2020-01-02', dag: Foreldrepengerdag })],
        forventet: {
            gyldig: false,
            feilkode: 'kanIkkeOverstyreTilAnnenYtelse',
            feilmelding:
                'Andre ytelser kan legges til i forkant av perioden, i starten av perioden eller i slutten av perioden',
        },
    },
    {
        navn: 'ny dag, selv om den er midt i perioden',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' }), lagDag({ dato: '2020-01-03' })],
        overstyrteDager: [lagDag({ dato: '2020-01-02', dag: Foreldrepengerdag, erNyDag: true })],
        forventet: { gyldig: true },
    },
    {
        navn: 'ignorerer overstyringer som ikke er annen ytelse',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' }), lagDag({ dato: '2020-01-03' })],
        overstyrteDager: [
            lagDag({ dato: '2020-01-01', dag: Foreldrepengerdag }),
            lagDag({ dato: '2020-01-02', dag: Arbeidsdag, fraType: 'Syk' }),
        ],
        forventet: { gyldig: true },
    },
];

export const arbeidIkkeGjenopptattScenarioer: ValideringScenario[] = [
    {
        navn: 'ingen dager overstyrt til arbeid ikke gjenopptatt',
        alleDager: [],
        overstyrteDager: [],
        forventet: { gyldig: true },
    },
    {
        navn: 'kilde er ikke saksbehandler',
        alleDager: [],
        overstyrteDager: [
            lagDag({
                dato: '2020-01-01',
                dag: ArbeidIkkeGjenopptattDag,
                kilde: { __typename: 'Kilde', id: '123', type: Kildetype.Soknad },
            }),
        ],
        forventet: {
            gyldig: false,
            feilkode: 'kanIkkeOverstyreTilArbeidIkkeGjenopptatt',
            feilmelding:
                'Du kan ikke overstyre til arbeid ikke gjenopptatt. Du kan bare overstyre til arbeid ikke gjenopptatt på dager som allerede er overstyrt av saksbehandler eller så kan arbeid ikke gjenopptatt legges til som en ny dag i starten av perioden.',
        },
    },
    {
        navn: 'kilde er saksbehandler',
        alleDager: [],
        overstyrteDager: [
            lagDag({
                dato: '2020-01-01',
                dag: ArbeidIkkeGjenopptattDag,
                kilde: { __typename: 'Kilde', id: '123', type: Kildetype.Saksbehandler },
            }),
        ],
        forventet: { gyldig: true },
    },
    {
        navn: 'ignorerer dager som ikke er arbeid ikke gjenopptatt',
        alleDager: [],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Sykedag })],
        forventet: { gyldig: true },
    },
];

export const sykNavScenarioer: ValideringScenario[] = [
    {
        navn: 'ingen dager overstyrt til syk (nav)',
        alleDager: [],
        overstyrteDager: [],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er i arbeidsgiverperioden',
        alleDager: [],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: SykedagNav, erAGP: true })],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er en ny dag',
        alleDager: [],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: SykedagNav, erNyDag: true })],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er verken i AGP eller en ny dag',
        alleDager: [],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: SykedagNav })],
        forventet: {
            gyldig: false,
            feilkode: 'kanIkkeOverstyreTilSykNav',
            feilmelding: 'Syk (Nav) kan kun overstyres i arbeidsgiverperioden eller legges til som en ny dag.',
        },
    },
    {
        navn: 'ignorerer overstyringer som ikke er syk (nav)',
        alleDager: [],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Arbeidsdag, fraType: 'Syk' })],
        forventet: { gyldig: true },
    },
];

export const egenmeldingScenarioer: ValideringScenario[] = [
    {
        navn: 'ingen dager overstyrt til egenmelding',
        alleDager: [lagDag({ dato: '2020-01-01' })],
        overstyrteDager: [],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er før arbeidsgiverperioden starter',
        alleDager: [
            lagDag({ dato: '2019-12-31' }),
            lagDag({ dato: '2020-01-01', erAGP: true }),
            lagDag({ dato: '2020-01-02', erAGP: true }),
        ],
        overstyrteDager: [lagDag({ dato: '2019-12-31', dag: Egenmeldingsdag })],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er i arbeidsgiverperioden',
        alleDager: [lagDag({ dato: '2020-01-01', erAGP: true }), lagDag({ dato: '2020-01-02', erAGP: true })],
        overstyrteDager: [lagDag({ dato: '2020-01-01', dag: Egenmeldingsdag, erAGP: true })],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er en ny dag',
        alleDager: [lagDag({ dato: '2020-01-01', erAGP: true }), lagDag({ dato: '2020-01-02', erAGP: true })],
        overstyrteDager: [lagDag({ dato: '2020-01-03', dag: Egenmeldingsdag, erNyDag: true })],
        forventet: { gyldig: true },
    },
    {
        navn: 'dagen er etter arbeidsgiverperioden, verken i AGP eller ny dag',
        alleDager: [
            lagDag({ dato: '2020-01-01', erAGP: true }),
            lagDag({ dato: '2020-01-02', erAGP: true }),
            lagDag({ dato: '2020-01-03' }),
        ],
        overstyrteDager: [lagDag({ dato: '2020-01-03', dag: Egenmeldingsdag })],
        forventet: {
            gyldig: false,
            feilkode: 'kanIkkeOverstyreTilEgenmelding',
            feilmelding:
                'Egenmelding kan kun overstyres i eller før arbeidsgiverperioden eller legges til som en ny dag.',
        },
    },
    {
        navn: 'ingen arbeidsgiverperiode finnes i det hele tatt',
        alleDager: [lagDag({ dato: '2020-01-01' }), lagDag({ dato: '2020-01-02' })],
        overstyrteDager: [lagDag({ dato: '2020-01-02', dag: Egenmeldingsdag })],
        forventet: {
            gyldig: false,
            feilkode: 'kanIkkeOverstyreTilEgenmelding',
            feilmelding:
                'Egenmelding kan kun overstyres i eller før arbeidsgiverperioden eller legges til som en ny dag.',
        },
    },
    {
        navn: 'arbeidsgiverperiode finnes, men ikke med syk dagtype',
        alleDager: [
            lagDag({ dato: '2020-01-01', dag: Foreldrepengerdag, erAGP: true }),
            lagDag({ dato: '2020-01-02' }),
        ],
        overstyrteDager: [lagDag({ dato: '2020-01-02', dag: Egenmeldingsdag })],
        forventet: {
            gyldig: false,
            feilkode: 'kanIkkeOverstyreTilEgenmelding',
            feilmelding:
                'Egenmelding kan kun overstyres i eller før arbeidsgiverperioden eller legges til som en ny dag.',
        },
    },
];
