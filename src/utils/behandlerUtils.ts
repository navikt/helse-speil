import { ApiBehandlerKategori, ApiLegekontor } from '@io/rest/generated/sporhund.schemas';

export const behandlerKategoriLabels: Record<ApiBehandlerKategori, string> = {
    [ApiBehandlerKategori.LEGE]: 'lege',
    [ApiBehandlerKategori.FYSIOTERAPEUT]: 'fysioterapeut',
    [ApiBehandlerKategori.KIROPRAKTOR]: 'kiropraktor',
    [ApiBehandlerKategori.MANUELLTERAPEUT]: 'manuellterapeut',
    [ApiBehandlerKategori.TANNLEGE]: 'tannlege',
    [ApiBehandlerKategori.PSYKOLOG]: 'psykolog',
};

export function formatLegekontorAdresse(legekontor: ApiLegekontor): string | null {
    const poststed = [legekontor.postnummer, legekontor.poststed].filter(Boolean).join(' ');
    const adresse = [legekontor.adresse, poststed].filter(Boolean).join(', ');
    return adresse || null;
}
