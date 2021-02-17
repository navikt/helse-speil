import { extractIdent } from './utils/cookie';
import { Kjønn } from 'internal-types';

export const erLocal = () => location.hostname === 'localhost';
export const erPreprod = () => location.hostname === 'speil.nais.preprod.local';
const erSupersaksbehandler = () => erEminem() || erDonika() || erDaniel() || erMorten() || erAminet();
const erSupportsaksbehandler = () =>
    erEliHåkonsen() ||
    erEirinØdegård() ||
    erJanneFleten() ||
    erMartheOterhals() ||
    erAnnHelenThorsen() ||
    erOttarNerland() ||
    erAnjaHøiås() ||
    erGeirArildMannes();

const erEliHåkonsen = () => extractIdent() === 'H104215';
const erEirinØdegård = () => extractIdent() === 'O130292';
const erJanneFleten = () => extractIdent() === 'F111930';
const erMartheOterhals = () => extractIdent() === 'O146470';
const erAnnHelenThorsen = () => extractIdent() === 'T142719';
const erOttarNerland = () => extractIdent() === 'N116980';
const erAnjaHøiås = () => extractIdent() === 'K105430';
const erGeirArildMannes = () => extractIdent() === 'M106091';

const erEminem = () => extractIdent() === 'G103083';
const erDonika = () => extractIdent() === 'D117949';
const erDaniel = () => extractIdent() === 'A148751';
const erMorten = () => extractIdent() === 'N115007';
const erAminet = () => extractIdent() === 'C117102';

const erAnnulleringsbois = () => erKnudix() || erKevin();
const erSpiceGirls = () => erMarthe() || erMarte() || erKevin() || erAnders();
const erKnudix = () => extractIdent() === 'N143409';
const erDigimort = () => extractIdent() === 'T127350';
const erDavid = () => extractIdent() === 'S150563';
const erKevin = () => extractIdent() === 'S151890';
const erMarthe = () => extractIdent() === 'S151399';
const erMarte = () => extractIdent() === 'T141884';
const erAnders = () => extractIdent() === 'O142910';
const erUtvikler = () => erKnudix() || erDavid() || erSpiceGirls();

const erJonas = () => extractIdent() === 'H159657';
const erPeter = () => extractIdent() === 'S159940';

export const overstyrbareTabellerEnabled = true;
export const overstyreUtbetaltPeriodeEnabled = erSupersaksbehandler() || erLocal() || erPreprod();
export const annulleringerEnabled =
    erPreprod() || erLocal() || erSupportsaksbehandler() || erSupersaksbehandler() || erAnnulleringsbois();
export const oppdaterPersondataEnabled =
    erPreprod() ||
    erLocal() ||
    erSupersaksbehandler() ||
    erAnnulleringsbois() ||
    erSpiceGirls() ||
    erSupportsaksbehandler();
export const speilTildeling = true;
export const speilV2 = true;
export const amplitudeEnabled = true;
export const utbetalingsoversikt = erUtvikler() || erLocal() || erSupersaksbehandler() || erDigimort();
export const stikkprøve = erSupersaksbehandler() || erLocal() || erPreprod();
export const flereArbeidsgivere = erSpiceGirls() || erLocal() || erPreprod() || erDigimort() || erMorten();
