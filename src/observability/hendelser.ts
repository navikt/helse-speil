import { EventName, Events, TaxonomyEvent } from '@navikt/analytics-types';

import { finnInnblikkPerson } from '@observability/innblikk';

declare global {
    interface Window {
        sporing?: { track: (navn: string, data?: Record<string, unknown>) => Promise<unknown> };
    }
}

type Egenskapsverdi = string | number | boolean | undefined;

export type Skjemanavn = 'skjønnsfastsetting' | 'opptjening arbeid' | 'opptjening likestilt ytelse';

type TaksonomiHendelse = {
    [Navn in EventName]: {
        name: Navn;
        properties: TaxonomyEvent<Navn>['properties'] & { skjemanavn?: Skjemanavn } & Record<string, Egenskapsverdi>;
    };
}[EventName];

export type Personkilde = 'oppgaveliste' | 'behandlet i dag' | 'dialogmeldinger' | 'personsøk' | 'spoogle' | 'direkte';

export type Personutfall =
    | 'vedtak fattet'
    | 'sendt til godkjenning'
    | 'sendt i retur'
    | 'kan ikke behandles'
    | 'lagt på vent'
    | 'forkastet'
    | 'uten handling';

export type Oppgavekilde = 'oppgaveliste' | 'saksbildemeny';

type SpeilHendelse =
    | { name: 'person åpnet'; properties: { kilde: Personkilde } }
    | { name: 'person forlatt'; properties: { utfall: Personutfall } }
    | {
          name: 'vedtak fattet';
          properties: {
              beslutter: boolean;
              revurdering: boolean;
              utbetalingTil: 'arbeidsgiver' | 'person' | 'begge' | 'ingen';
              harIndividuellBegrunnelse: boolean;
          };
      }
    | { name: 'fatt vedtak feilet'; properties: { feilkode: string } }
    | { name: 'sendt til godkjenning'; properties: { harIndividuellBegrunnelse: boolean } }
    | { name: 'sendt i retur'; properties: Record<string, never> }
    | { name: 'kan ikke behandles'; properties: { antallBegrunnelser: number; harKommentar: boolean } }
    | { name: 'forkastet'; properties: { antallÅrsaker: number; harKommentar: boolean } }
    | { name: 'lagt på vent'; properties: Record<string, never> }
    | { name: 'fjernet fra på vent'; properties: { kilde: Oppgavekilde } }
    | { name: 'oppgave tildelt'; properties: { kilde: Oppgavekilde } }
    | { name: 'oppgave avmeldt'; properties: { kilde: Oppgavekilde } }
    | { name: 'opptjening vurdert automatisk på nytt'; properties: { status: string } }
    | { name: 'skjema avbrutt'; properties: { skjemanavn: Skjemanavn } }
    | {
          name: 'opptjening vist';
          properties: { utfall: string; erOverførtFraInfotrygd: boolean; avgjørendeVilkår: string };
      };

export type Hendelse = TaksonomiHendelse | SpeilHendelse;

const utfallForHendelse: Partial<Record<Hendelse['name'], Personutfall>> = {
    'vedtak fattet': 'vedtak fattet',
    'sendt til godkjenning': 'sendt til godkjenning',
    'sendt i retur': 'sendt i retur',
    'kan ikke behandles': 'kan ikke behandles',
    forkastet: 'forkastet',
    'lagt på vent': 'lagt på vent',
};

let kildeForNestePerson: Personkilde | null = null;
let utfallForPerson: Personutfall | null = null;

export function sporHendelse(hendelse: Hendelse, personPseudoId?: string): void {
    utfallForPerson = utfallForHendelse[hendelse.name] ?? utfallForPerson;
    if (typeof window === 'undefined' || !window.sporing) return;

    const person = personPseudoId ? { person: finnInnblikkPerson(personPseudoId) } : {};
    void window.sporing.track(hendelse.name, { ...hendelse.properties, ...person }).catch(() => undefined);
}

export function sporValideringsfeil(skjemanavn: Skjemanavn, feil: object): void {
    sporHendelse({
        name: Events.SKJEMA_VALIDERING_FEILET,
        properties: { skjemanavn, feltMedFeil: Object.keys(feil).sort().join(',') },
    });
}

export function merkKildeForNestePerson(kilde: Personkilde): void {
    kildeForNestePerson = kilde;
}

export function startPersonbesøk(personPseudoId: string): () => void {
    const kilde = kildeForNestePerson ?? 'direkte';
    kildeForNestePerson = null;
    utfallForPerson = null;
    sporHendelse({ name: 'person åpnet', properties: { kilde } }, personPseudoId);

    let avsluttet = false;
    const avslutt = () => {
        if (avsluttet) return;
        avsluttet = true;
        window.removeEventListener('pagehide', avslutt);
        sporHendelse(
            { name: 'person forlatt', properties: { utfall: utfallForPerson ?? 'uten handling' } },
            personPseudoId,
        );
    };
    window.addEventListener('pagehide', avslutt);
    return avslutt;
}
