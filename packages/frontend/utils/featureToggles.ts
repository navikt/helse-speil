import { extractGroups, extractIdent } from '@utils/cookie';

const groupIdForTbd = 'f787f900-6697-440d-a086-d5bb56e26a9c';
const groupIdForBesluttere = '59f26eef-0a4f-4038-bf46-3a5b2f252155';
const groupIdSpesialsaker = '39c09f12-4a2f-44da-ab6a-ac43d680294c';

const eminem = 'G103083';
const supersaksbehandlere = [eminem, 'N115007', 'C117102', 'K164523'];

const fagkoordinatorer = ['M136300', 'S108267', 'K123956', 'G157538'];

const enhetsledere = ['B138607', 'S145454'];

const coaches = [
    'J153777',
    'F131883',
    'K104953',
    'V149621',
    'S160466',
    'O123659',
    'B164848',
    'K162139',
    'F160464',
    'M136300',
];

const kunLesetilgang: string[] = [];

export const erLocal = () => location.hostname === 'localhost';
export const erDev = () => location.hostname === 'speil.intern.dev.nav.no';
export const erProd = () => location.hostname === 'speil.intern.nav.no';

export const erUtvikling = () => erLocal() || erDev();

export const erCoachEllerSuper = () => erCoach() || erSupersaksbehandler();

const harKunLesetilgang = () => kunLesetilgang.includes(extractIdent());
const erSupersaksbehandler = () => supersaksbehandlere.includes(extractIdent());
const harTilgangTilAlt = () => [...supersaksbehandlere, ...fagkoordinatorer, ...enhetsledere].includes(extractIdent());
const erCoach = () => coaches.includes(extractIdent());
const kanFrigiSaker = () => ['K162139'].includes(extractIdent());

export const erPåTeamBømlo = () => extractGroups().includes(groupIdForTbd);

export const overstyreUtbetaltPeriodeEnabled = !harKunLesetilgang();
export const annulleringerEnabled = !harKunLesetilgang();
export const kanFrigiAndresOppgaver = kanFrigiSaker() || harTilgangTilAlt() || erLocal() || erDev();

export const graphqlplayground = erLocal() || erDev() || erPåTeamBømlo();

export const skalBehandleEnOgEnPeriode = false;

export interface UtbetalingToggles {
    overstyreUtbetaltPeriodeEnabled: boolean;
}

export const defaultUtbetalingToggles: UtbetalingToggles = {
    overstyreUtbetaltPeriodeEnabled,
};

export const overstyrInntektEnabled = overstyreUtbetaltPeriodeEnabled;

export const harBeslutterrolle: boolean = extractGroups().includes(groupIdForBesluttere);
export const harSpesialsaktilgang: boolean = extractGroups().includes(groupIdSpesialsaker) || erUtvikling();

export const toggleMeny: boolean = erLocal() || erDev();

export const kanSkriveAvslag: boolean = erLocal() || erDev();
