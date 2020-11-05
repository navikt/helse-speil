import { extractIdent } from './utils/cookie';

const erLocal = () => location.hostname === 'localhost';
const erPreprod = () => location.hostname === 'speil.nais.preprod.local';
const erSupersaksbehandler = () => extractIdent() === 'G103083';

export const overstyrbareTabellerEnabled = true;
export const annulleringerEnabled = erPreprod() || erLocal() || erSupersaksbehandler();
export const speilTildeling = true;
export const speilV2 = erLocal();
