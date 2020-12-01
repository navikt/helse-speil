import { extractIdent } from './utils/cookie';

const erLocal = () => location.hostname === 'localhost';
const erPreprod = () => location.hostname === 'speil.nais.preprod.local';
const erSupersaksbehandler = () => erEminem() || erDonika() || erDaniel() || erMorten() || erAminet();
const erSupportsaksbehandler = () => erEliHåkonsen() || erEirinØdegård() || erJanneFleten();

const erEliHåkonsen = () => extractIdent() === 'H104215';
const erEirinØdegård = () => extractIdent() === 'O130292';
const erJanneFleten = () => extractIdent() === 'F111930';

const erEminem = () => extractIdent() === 'G103083';
const erDonika = () => extractIdent() === 'D117949';
const erDaniel = () => extractIdent() === 'A148751';
const erMorten = () => extractIdent() === 'N115007';
const erAminet = () => extractIdent() === 'C117102';

const erKnudix = () => extractIdent() === 'N143409';
const erKevin = () => extractIdent() === 'S151890';

export const overstyrbareTabellerEnabled = true;
export const annulleringerEnabled = erPreprod() || erLocal() || erSupportsaksbehandler() || erSupersaksbehandler();
export const oppdaterPersondataEnabled = erPreprod() || erLocal() || erSupersaksbehandler() || erKnudix() || erKevin();
export const speilTildeling = true;
export const speilV2 = true;
export const amplitudeEnabled = erLocal() || erPreprod();
