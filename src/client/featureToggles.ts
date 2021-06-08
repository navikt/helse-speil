import { extractIdent, extractGroups } from './utils/cookie';

const groupIdForUtviklere = 'f787f900-6697-440d-a086-d5bb56e26a9c';
const eminem = 'G103083';
const supersaksbehandlere = [eminem, 'D117949', 'A148751', 'N115007', 'C117102'];

const faktiskSupportsaksbehandlere = ['H104215', 'O130292', 'F111930'];

const utvidetTilganger = [
    ...faktiskSupportsaksbehandlere,
    'O146470',
    'T142719',
    'N116980',
    'K105430',
    'M106091',
    'A158665',
    'P107343',
    'V112769',
];

export const erLocal = () => location.hostname === 'localhost';
export const erDev = () => location.hostname === 'speil.dev.intern.nav.no';

const erSupersaksbehandler = () => supersaksbehandlere.includes(extractIdent());
const erFaktiskSupportsaksbehandler = () => faktiskSupportsaksbehandlere.includes(extractIdent()); // ref @support på Slack
const harUtvidetTilgang = () => utvidetTilganger.includes(extractIdent());
const erAnnulleringsbois = () => erKnudix() || erKevin();
const erSpiceGirls = () => erMarthe() || erMarte() || erKevin() || erAnders() || erHegeir();
const erKnudix = () => extractIdent() === 'N143409';
const erDigimort = () => extractIdent() === 'T127350';
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
export const overstyreUtbetaltPeriodeEnabled = erUtvikler() || erSupersaksbehandler() || erLocal() || erDev();
export const annulleringerEnabled =
    erDev() || erLocal() || harUtvidetTilgang() || erSupersaksbehandler() || erAnnulleringsbois();
export const oppdaterPersondataEnabled =
    erDev() ||
    erLocal() ||
    erUtvikler() ||
    erSupersaksbehandler() ||
    erAnnulleringsbois() ||
    erSpiceGirls() ||
    harUtvidetTilgang() ||
    erSolør();
export const amplitudeEnabled = true;
export const utbetalingsoversikt = erUtvikler() || erLocal() || erSupersaksbehandler() || erDigimort();
export const stikkprøve = erSupersaksbehandler() || erLocal() || erDev();
export const flereArbeidsgivere =
    erSpiceGirls() || erLocal() || erDev() || erDigimort() || erSupersaksbehandler() || erFaktiskSupportsaksbehandler();
