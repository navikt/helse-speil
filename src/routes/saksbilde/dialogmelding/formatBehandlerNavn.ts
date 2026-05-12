import { ApiBehandlerKategori, ApiBehandlerNavn } from '@io/rest/generated/sporhund.schemas';

export const behandlerKategoriLabels: Record<ApiBehandlerKategori, string> = {
    [ApiBehandlerKategori.LEGE]: 'Lege',
    [ApiBehandlerKategori.FYSIOTERAPEUT]: 'Fysioterapeut',
    [ApiBehandlerKategori.KIROPRAKTOR]: 'Kiropraktor',
    [ApiBehandlerKategori.MANUELLTERAPEUT]: 'Manuellterapeut',
    [ApiBehandlerKategori.TANNLEGE]: 'Tannlege',
    [ApiBehandlerKategori.PSYKOLOG]: 'Psykolog',
};

export function formatBehandlerNavn(navn: ApiBehandlerNavn): string {
    return [navn.fornavn, navn.mellomnavn, navn.etternavn].filter(Boolean).join(' ');
}
