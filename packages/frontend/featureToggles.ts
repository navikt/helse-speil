import { extractIdent, extractGroups } from './utils/cookie';

const groupIdForUtviklere = 'f787f900-6697-440d-a086-d5bb56e26a9c';
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
];
const faktiskSupportsaksbehandlere = ['H104215', 'O130292', 'F111930'];
const tilgangFlereArbeidsgivere = [
    'M139452',
    'S109031',
    'B136871',
    'J104651',
    'D123751',
    'R117524',
    'D163344',
    'F131882',
    'I104299',
    'F131883',
    'J153777',
    'S135852',
    'S127865',
    'A158665',
    'B138607',
    'L148406',
    'L105506',
    'M106091',
    'P107343',
    'S112395',
    'F140836',
    'L157337',
    'S109031',
    'F160529',
    'B137568',
    'T144880',
    'S160466',
    'W110120',
    'K105052',
    'K105430',
    'R159363',
    'O145552',
    'F162395',
    'S124729',
    'B160663',
    'O123659',
    'B152345',
    'K104953',
    // Klageinstansen start
    'T109423',
    'B138509',
    'H154142',
    'W109995',
    'J104571',
    'S163082',
    'W110000',
    'O139947',
    'A100182',
    'O159042',
    'S159041',
    'I104325',
    'B161538',
    'J161200',
    'H150552',
    'B100841',
    'R107698',
    'V161315',
    'W161593',
    'A161175',
    'S157894',
    'M159445',
    'E137084',
    'L158907',
    'V162913',
    'J162983',
    'L158906',
    'O163049',
    'G137092',
    'H153677',
    'T158780',
    'B134670',
    'M106066',
    'T109423',
    'L142009',
    // Klageinstansen end
];

const tilgangStikkprøver = ['F140836', 'H104215'];

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
    'R117524',
    'S109031',
    'W110120',
    'D163344',
    'A110417',
    'J153777',
    'D123751',
    'J104651',
    'L157337',
    'S109031',
    'F160529',
    'B137568',
    'T144880',
    'M113770',
    'A100343',
    'L127690',
    'K105052',
    'R159363',
    'O145552',
    'F162395',
    'S124729',
    'B160663',
    'O123659',
    'B152345',
    'K104953',
    'B138607',
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
    'R117524',
    'S109031',
    'J104651',
    'D123751',
    'W110120',
    'D163344',
    'A110417',
    'J153777',
    'L157337',
    'S109031',
    'F160529',
    'B137568',
    'T144880',
    'M113770',
    'A100343',
    'L127690',
    'K105052',
    'B138607',
];

export const erLocal = () => location.hostname === 'localhost';
export const erDev = () => location.hostname === 'speil.dev.intern.nav.no';

const skalViseGhostPølser = () => erLocal() || erUtvikler();
const harTilgangTilAlt = () => [...supersaksbehandlere, ...fagkoordinatorer].includes(extractIdent());
const erFaktiskSupportsaksbehandler = () => faktiskSupportsaksbehandlere.includes(extractIdent()); // ref @support på Slack
const harUtvidetTilgang = () => utvidetTilganger.includes(extractIdent());
const harTilgangFlereArbeidsgivere = () => tilgangFlereArbeidsgivere.includes(extractIdent());
const harTilgangStikkprøver = () => tilgangStikkprøver.includes(extractIdent());
const erAnnulleringsbois = () => erKnudix() || erKevin();
const erSpiceGirls = () => erMarte() || erKevin() || erAnders() || erHegeir();
const erFabulous = () => erKevin() || erHegeir() || erSimen() || erHåkon();
const erKnudix = () => extractIdent() === 'N143409';
const erDigimort = () => extractIdent() === 'T127350';
const erVegard = () => extractIdent() === 'S144991';
const erKevin = () => extractIdent() === 'S151890';
const erHåkon = () => extractIdent() === 'H131243';
const erSimen = () => extractIdent() === 'U160607';
const erMarte = () => extractIdent() === 'T141884';
const erAnders = () => extractIdent() === 'O142910';
const erHegeir = () => extractIdent() === 'H161007';
const erUtvikler = () => extractGroups().includes(groupIdForUtviklere);
const erSolør = () => erJakob() || erJonas() || erSindre() || erPeter();
const erJonas = () => extractIdent() === 'H159657';
const erPeter = () => extractIdent() === 'S159940';
const erSindre = () => extractIdent() === 'B159939';
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
export const amplitudeEnabled = true;
export const utbetalingsoversikt = erUtvikler() || erLocal() || harTilgangTilAlt() || erDigimort();
export const stikkprøve = harTilgangStikkprøver() || harTilgangTilAlt() || erLocal() || erDev();
export const flereArbeidsgivere =
    erSpiceGirls() ||
    erFabulous() ||
    erUtvikler() ||
    erLocal() ||
    erDev() ||
    erDigimort() ||
    erVegard() ||
    harTilgangTilAlt() ||
    erFaktiskSupportsaksbehandler() ||
    harTilgangFlereArbeidsgivere();
export const kanFrigiAndresOppgaver = harTilgangTilAlt() || erLocal() || erDev();

export interface UtbetalingToggles {
    overstyreUtbetaltPeriodeEnabled: boolean;
}

export const defaultUtbetalingToggles: UtbetalingToggles = {
    overstyreUtbetaltPeriodeEnabled: overstyreUtbetaltPeriodeEnabled,
};

export const overstyrInntektEnabled = overstyreUtbetaltPeriodeEnabled;
