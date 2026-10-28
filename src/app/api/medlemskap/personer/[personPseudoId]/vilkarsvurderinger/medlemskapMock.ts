import { v4 } from 'uuid';

import {
    ApiKildetype,
    ApiKravkode,
    ApiManuellVilkårsvurderingRequest,
    ApiMedlemskapsstatus,
    ApiMedlemskapsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { PersonMock, lesTestpersonfiler } from '@spesialist-mock/storage/person';

// punktlig_jakke.json har et uavklart svar fra medlemskapstjenesten, så man kan teste manuell vurdering
const PERSONER_MED_UAVKLART_MEDLEMSKAP = new Set(['2805594640665']);

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
    const uavklart = aktørId !== null && PERSONER_MED_UAVKLART_MEDLEMSKAP.has(aktørId);
    const vurdering = automatiskVurdering(medlemskapsvurderingId, skjæringstidspunkt, uavklart);
    vurderinger.set(medlemskapsvurderingId, vurdering);
    return vurdering;
}

// Speiler Medlemskapsvurdering.avSaksbehandler() i sp-medlemskap
export function vurderMedlemskap(personPseudoId: string, request: ApiManuellVilkårsvurderingRequest): string {
    const id = v4();
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
    uavklart: boolean,
): ApiVilkårsvurderingerForPersonResponse {
    return {
        skjæringstidspunkt,
        krav: [
            {
                id,
                kravkode: ApiKravkode.MEDLEMSKAP,
                medlemskapOk: true,
                status: uavklart ? ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL : ApiMedlemskapsstatus.JA,
                vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
                kilde: {
                    kildetype: ApiKildetype.AUTOMATISK,
                    versjonAvKildekode: 'mock',
                    oppslagsperiode: { fom: skjæringstidspunkt, tom: skjæringstidspunkt },
                    årsaker: uavklart
                        ? [{ regelId: 'SP6001', forklaringPaaUavklart: 'Brukeren har oppgitt arbeid utenfor Norge' }]
                        : [],
                },
            },
        ],
    };
}
