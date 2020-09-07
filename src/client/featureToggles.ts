const erPreprod = () => location.hostname === 'speil.nais.preprod.local' || location.hostname === 'localhost';

export const overstyrbareTabellerEnabled = erPreprod();
export const spesialistTildelingEnabled = erPreprod();
