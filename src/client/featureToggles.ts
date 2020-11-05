import { extractIdent } from './utils/cookie';

const erLocal = () => location.hostname === 'localhost';
const erPreprod = () => location.hostname === 'speil.nais.preprod.local';
const erSupersaksbehandler = () => extractIdent() === 'G103083';

const erUlrik = () => extractIdent() === 'P141762';
const erDaniel = () => extractIdent() === 'A148751';
const erMorten = () => extractIdent() === 'N115007';
const erAminet = () => extractIdent() === 'C117102';

export const overstyrbareTabellerEnabled = true;
export const annulleringerEnabled = erPreprod() || erLocal() || erSupersaksbehandler();
export const speilTildeling = true;
export const speilV2 = erLocal() || erUlrik() || erDaniel() || erMorten() || erAminet();
