import { extractIdent } from './utils/cookie';

const erPreprod = () => location.hostname === 'speil.nais.preprod.local' || location.hostname === 'localhost';
const erKnutellerJonas = () => extractIdent() === 'N143409' || extractIdent() === 'H159657';

export const overstyrbareTabellerEnabled = true;
export const annulleringerEnabled = erPreprod();
export const pagineringEnabled = true;
export const speilTildeling = erKnutellerJonas();
