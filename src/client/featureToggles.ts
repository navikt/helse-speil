import { extractIdent } from './utils/cookie';

const erPreprod = () => location.hostname === 'speil.nais.preprod.local' || location.hostname === 'localhost';
const erDonika = () => extractIdent() === 'D117949';

export const overstyrbareTabellerEnabled = true;
export const spesialistTildelingEnabled = true;
export const annulleringerEnabled = erPreprod();
export const pagineringEnabled = erPreprod() || erDonika();
