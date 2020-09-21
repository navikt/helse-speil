import { extractIdent } from './utils/cookie';

const erPreprod = () => location.hostname === 'speil.nais.preprod.local' || location.hostname === 'localhost';

export const overstyrbareTabellerEnabled = erPreprod() || extractIdent() === 'C117102';
export const spesialistTildelingEnabled = true;
