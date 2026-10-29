import { ApiAnnullering, ApiRisikovurdering } from '@io/rest/generated/spesialist.schemas';
import { finnNyestePeriodeForVedtaksperiodeId } from '@spesialist-mock/periodeoppslag';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { lesTestpersonfiler } from '@spesialist-mock/storage/person';

// Vedtaksperiode-id-ene er unike på tvers av testpersonene, så filene kan slås sammen
const risikovurderinger: Record<string, ApiRisikovurdering> = Object.assign(
    {},
    ...lesTestpersonfiler().map((fil) => fil.risikovurderinger),
);
const annulleringer: Record<string, ApiAnnullering> = Object.assign(
    {},
    ...lesTestpersonfiler().map((fil) => fil.annulleringer),
);

export const finnRisikovurdering = (vedtaksperiodeId: string): ApiRisikovurdering | null =>
    risikovurderinger[vedtaksperiodeId] ?? null;

export const finnAnnullering = (vedtaksperiodeId: string): ApiAnnullering | null => {
    const behandlingId = finnNyestePeriodeForVedtaksperiodeId(vedtaksperiodeId)?.periode.behandlingId;
    return (behandlingId && BehandlingMock.getAnnullering(behandlingId)) || annulleringer[vedtaksperiodeId] || null;
};
