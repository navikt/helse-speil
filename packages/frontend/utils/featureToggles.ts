import { extractGroups, extractIdent } from '@utils/cookie';

const groupIdForTbd = 'f787f900-6697-440d-a086-d5bb56e26a9c';
const groupIdForBesluttere = '59f26eef-0a4f-4038-bf46-3a5b2f252155';
const eminem = 'G103083';
const supersaksbehandlere = [eminem, 'D117949', 'A148751', 'N115007', 'C117102', 'S145454', 'E148846'];
const fagkoordinatorer = [
    'J150708',
    'S108267',
    'S109074',
    'K104950',
    'O107213',
    'K105348',
    'T143450',
    'B137568',
    'H126784',
    'A151722',
    'M136300',
    'F131883',
    'K104953',
    'A147735',
    'A160730',
];
const enhetsledere = ['B138607'];
const faktiskSupportsaksbehandlere = ['H104215', 'O130292', 'F111930'];

const tilgangStikkprøver = [
    'F140836',
    'H104215',
    'S109031',
    'O123659',
    'S160466',
    'K104953',
    'J153777',
    'V149621',
    'D163344',
];

const kunLesetilgang: string[] = [];

export const erLocal = () => location.hostname === 'localhost';
export const erDev = () => location.hostname === 'speil.dev.intern.nav.no';

const harKunLesetilgang = () => kunLesetilgang.includes(extractIdent());
const harTilgangTilAlt = () => [...supersaksbehandlere, ...fagkoordinatorer, ...enhetsledere].includes(extractIdent());
const erFaktiskSupportsaksbehandler = () => faktiskSupportsaksbehandlere.includes(extractIdent()); // ref @support på Slack
const harTilgangStikkprøver = () => tilgangStikkprøver.includes(extractIdent());
const harTilgangTilUtbetalingTilSykmeldt = () => ['J153777'].includes(extractIdent());

const erPåTeamBømlo = () => extractGroups().includes(groupIdForTbd);

export const overstyreUtbetaltPeriodeEnabled = !harKunLesetilgang();
export const annulleringerEnabled = !harKunLesetilgang();
export const utbetalingsoversikt = !harKunLesetilgang();

export const overstyrPermisjonsdagerEnabled = erLocal() || erDev();
export const stikkprøve = harTilgangStikkprøver() || harTilgangTilAlt() || erLocal() || erDev();
export const flereArbeidsgivere = true;

export const utbetalingTilSykmeldt =
    erLocal() ||
    erDev() ||
    erPåTeamBømlo() ||
    harTilgangTilAlt() ||
    erFaktiskSupportsaksbehandler() ||
    harTilgangTilUtbetalingTilSykmeldt();

export const kanFrigiAndresOppgaver = harTilgangTilAlt() || erLocal() || erDev();

export const graphqlplayground = erLocal() || erDev() || erPåTeamBømlo();

export interface UtbetalingToggles {
    overstyreUtbetaltPeriodeEnabled: boolean;
}

export const defaultUtbetalingToggles: UtbetalingToggles = {
    overstyreUtbetaltPeriodeEnabled: overstyreUtbetaltPeriodeEnabled,
};

export const overstyrInntektEnabled = overstyreUtbetaltPeriodeEnabled;

export const harBeslutterrolle: boolean = extractGroups().includes(groupIdForBesluttere);

export const toggleMeny: boolean = erLocal() || erDev();

const saksbehandlereMedNyPølsevisning = ['N115007', 'A160730', 'O123659', 'S160466', 'R154509'];

export const pølsebonansaEnabled = erDev() || erLocal() || saksbehandlereMedNyPølsevisning.includes(extractIdent());

export const erBehandletIdagEnabled = erDev() || erLocal();
