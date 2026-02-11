import { Filtertype } from '@typer/historikk';

const HISTORIKK_TITLES: Record<Filtertype, string> = {
    Dokument: 'DOKUMENTER',
    Historikk: 'HISTORIKK',
    Notat: 'NOTATER',
    Overstyring: 'OVERSTYRINGER',
};

export function getHistorikkTitle(type: Filtertype): string {
    return HISTORIKK_TITLES[type];
}
