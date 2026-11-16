import {
    ApiKildetype,
    ApiKravkode,
    ApiManuellVilkårsvurderingRequest,
    ApiMedlemskapshistorikkResponse,
    ApiMedlemskapsstatus,
    ApiMedlemskapsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
    ApiVurderingskildeAutomatisk,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { PersonMock, lesTestpersonfiler } from '@spesialist-mock/storage/person';

// Personer med uavklart svar fra medlemskapstjenesten, så man kan teste manuell vurdering. Alle andre får JA.
const UAVKLARTE_MEDLEMSKAP = new Map<string, Uavklart>([
    // punktlig_jakke.json
    [
        '2805594640665',
        {
            status: ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
            årsaker: [{ regelId: 'SP6001', forklaringPaaUavklart: 'Brukeren har oppgitt arbeid utenfor Norge' }],
        },
    ],
    // uten_varsler.json
    [
        '2348185725298',
        {
            status: ApiMedlemskapsstatus.UAVKLART,
            årsaker: [],
        },
    ],
]);

interface Uavklart {
    status: typeof ApiMedlemskapsstatus.UAVKLART | typeof ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL;
    årsaker: ApiVurderingskildeAutomatisk['årsaker'];
}

const vurderingerPerPerson = new Map<string, Map<string, ApiVilkårsvurderingerForPersonResponse>>();

export function hentMedlemskapsvurdering(
    personPseudoId: string,
    medlemskapsvurderingId: string,
): ApiVilkårsvurderingerForPersonResponse | undefined {
    const vurderinger = vurderingerFor(personPseudoId);
    const eksisterende = vurderinger.get(medlemskapsvurderingId);
    if (eksisterende) return eksisterende;

    const skjæringstidspunkt = skjæringstidspunktFor(medlemskapsvurderingId);
    if (!skjæringstidspunkt) return undefined;

    const aktørId = PersonMock.findAktørIdForPersonPseudoId(personPseudoId);
    const uavklart = aktørId !== null ? UAVKLARTE_MEDLEMSKAP.get(aktørId) : undefined;
    const vurdering = automatiskVurdering(medlemskapsvurderingId, skjæringstidspunkt, uavklart);
    vurderinger.set(medlemskapsvurderingId, vurdering);
    return vurdering;
}

// Speiler Medlemskapsvurdering.avSaksbehandler() i sp-medlemskap
export function vurderMedlemskap(personPseudoId: string, request: ApiManuellVilkårsvurderingRequest): string {
    const id = crypto.randomUUID();
    const vurdering: ApiMedlemskapsvurdering = {
        id,
        kravkode: ApiKravkode.MEDLEMSKAP,
        medlemskapOk: request.status !== ApiMedlemskapsstatus.NEI,
        status: request.status,
        vurdertTidspunkt: new Date().toISOString(),
        kilde: {
            kildetype: ApiKildetype.SAKSBEHANDLER,
            ident: 'S123456',
            fritekstbegrunnelse: request.fritekstbegrunnelse,
            journalpostId: request.journalpostId,
        },
    };
    vurderingerFor(personPseudoId).set(id, { skjæringstidspunkt: request.skjæringstidspunkt, krav: [vurdering] });
    return id;
}

// Speiler GetMedlemskapshistorikkBehandler i sp-medlemskap: alle vurderinger på skjæringstidspunktet, nyeste først
export function hentMedlemskapshistorikk(
    personPseudoId: string,
    skjæringstidspunkt: string,
): ApiMedlemskapshistorikkResponse {
    const historikk = [...vurderingerFor(personPseudoId).values()]
        .filter((vurdering) => vurdering.skjæringstidspunkt === skjæringstidspunkt)
        .flatMap((vurdering) => vurdering.krav)
        .map((medlemskapsvurdering) => ({
            vurdertTidspunkt: medlemskapsvurdering.vurdertTidspunkt,
            medlemskapsvurdering,
        }))
        .sort((a, b) => new Date(b.vurdertTidspunkt).getTime() - new Date(a.vurdertTidspunkt).getTime());
    return { skjæringstidspunkt, historikk };
}

function vurderingerFor(personPseudoId: string): Map<string, ApiVilkårsvurderingerForPersonResponse> {
    const eksisterende = vurderingerPerPerson.get(personPseudoId);
    if (eksisterende) return eksisterende;
    const vurderinger = new Map<string, ApiVilkårsvurderingerForPersonResponse>();
    vurderingerPerPerson.set(personPseudoId, vurderinger);
    return vurderinger;
}

function skjæringstidspunktFor(medlemskapsvurderingId: string): string | undefined {
    return lesTestpersonfiler()
        .flatMap((fil) => fil.saksbilde.vilkarsgrunnlagV2)
        .find((grunnlag) => grunnlag.medlemskapsvurderingId === medlemskapsvurderingId)?.skjaeringstidspunkt;
}

function automatiskVurdering(
    id: string,
    skjæringstidspunkt: string,
    uavklart: Uavklart | undefined,
): ApiVilkårsvurderingerForPersonResponse {
    return {
        skjæringstidspunkt,
        krav: [
            {
                id,
                kravkode: ApiKravkode.MEDLEMSKAP,
                medlemskapOk: true,
                status: uavklart?.status ?? ApiMedlemskapsstatus.JA,
                vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
                kilde: {
                    kildetype: ApiKildetype.AUTOMATISK,
                    versjonAvKildekode: 'mock',
                    oppslagsperiode: { fom: skjæringstidspunkt, tom: skjæringstidspunkt },
                    årsaker: uavklart?.årsaker ?? [],
                },
            },
        ],
    };
}
