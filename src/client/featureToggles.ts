const erLocal = () => location.hostname === 'localhost';
const erPreprod = () => location.hostname === 'speil.nais.preprod.local';

export const overstyrbareTabellerEnabled = true;
export const annulleringerEnabled = erPreprod() || erLocal();
export const speilTildeling = true;
export const speilV2 = erLocal();
