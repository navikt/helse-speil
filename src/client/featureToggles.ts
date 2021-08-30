import { extractIdent, extractGroups } from './utils/cookie';

const groupIdForUtviklere = 'f787f900-6697-440d-a086-d5bb56e26a9c';
const eminem = 'G103083';
const supersaksbehandlere = [eminem, 'D117949', 'A148751', 'N115007', 'C117102', 'S145454'];
const fagkoordinatorer = ['J150708', 'S108267', 'S109074'];
const faktiskSupportsaksbehandlere = ['H104215', 'O130292', 'F111930'];

const utvidetTilganger = [
    ...faktiskSupportsaksbehandlere,
    'O146470',
    'T142719',
    'N116980',
    'K105430',
    'M106091',
    'A158665',
    'M139452',
    'P107343',
    'S160466',
    'V112769',
    'F131883',
    'F160529',
    'I104299',
];

const kanRevurdere = [
    'F111930',
    'S160466',
    'O146470',
    'N116980',
    'M106091',
    'A158665',
    'P107343',
    'M139452',
    'K105430',
    'F131883',
    'V112769',
    'F160529',
    'I104299',
];

export const erLocal = () => location.hostname === 'localhost';
export const erDev = () => location.hostname === 'speil.dev.intern.nav.no';

const harTilgangTilAlt = () => [...supersaksbehandlere, ...fagkoordinatorer].includes(extractIdent());
const erFaktiskSupportsaksbehandler = () => faktiskSupportsaksbehandlere.includes(extractIdent()); // ref @support på Slack
const harUtvidetTilgang = () => utvidetTilganger.includes(extractIdent());
const erAnnulleringsbois = () => erKnudix() || erKevin();
const erSpiceGirls = () => erMarthe() || erMarte() || erKevin() || erAnders() || erHegeir();
const erKnudix = () => extractIdent() === 'N143409';
const erDigimort = () => extractIdent() === 'T127350';
const erVegard = () => extractIdent() === 'S144991';
const erKevin = () => extractIdent() === 'S151890';
const erMarthe = () => extractIdent() === 'S151399';
const erMarte = () => extractIdent() === 'T141884';
const erAnders = () => extractIdent() === 'O142910';
const erHegeir = () => extractIdent() === 'H161007';
const erUtvikler = () => extractGroups().includes(groupIdForUtviklere);
const erSolør = () => erJakob() || erJonas() || erSindre() || erErlend() || erPeter();
const erJonas = () => extractIdent() === 'H159657';
const erPeter = () => extractIdent() === 'S159940';
const erSindre = () => extractIdent() === 'B159939';
const erErlend = () => extractIdent() === 'v159649';
const erJakob = () => extractIdent() === 'E156407';

export const overstyrPermisjonsdagerEnabled = erLocal() || erDev();
export const overstyrbareTabellerEnabled = true;
export const overstyreUtbetaltPeriodeEnabled =
    erUtvikler() ||
    harTilgangTilAlt() ||
    erFaktiskSupportsaksbehandler() ||
    kanRevurdere.includes(extractIdent()) ||
    erLocal() ||
    erDev();
export const annulleringerEnabled =
    erDev() || erLocal() || harUtvidetTilgang() || harTilgangTilAlt() || erAnnulleringsbois();
export const oppdaterPersondataEnabled =
    erDev() ||
    erLocal() ||
    erUtvikler() ||
    harTilgangTilAlt() ||
    erAnnulleringsbois() ||
    erSpiceGirls() ||
    harUtvidetTilgang() ||
    erSolør();
export const amplitudeEnabled = true;
export const utbetalingsoversikt = erUtvikler() || erLocal() || harTilgangTilAlt() || erDigimort();
export const stikkprøve = harTilgangTilAlt() || erLocal() || erDev();
export const flereArbeidsgivere =
    erSpiceGirls() ||
    erLocal() ||
    erDev() ||
    erDigimort() ||
    erVegard() ||
    harTilgangTilAlt() ||
    erFaktiskSupportsaksbehandler();
export const kanFrigiAndresOppgaver = harTilgangTilAlt() || erLocal() || erDev();

export interface UtbetalingToggles {
    overstyreUtbetaltPeriodeEnabled: boolean;
    overstyrbareTabellerEnabled: boolean;
}

export const defaultUtbetalingToggles: UtbetalingToggles = {
    overstyreUtbetaltPeriodeEnabled: overstyreUtbetaltPeriodeEnabled,
    overstyrbareTabellerEnabled: overstyrbareTabellerEnabled,
};

export const overstyrInntektEnabled = false;
