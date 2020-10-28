const erPreprod = () => location.hostname === 'speil.nais.preprod.local' || location.hostname === 'localhost';

export const overstyrbareTabellerEnabled = true;
export const annulleringerEnabled = erPreprod();
export const speilTildeling = true;
export const speilV2 = true;
