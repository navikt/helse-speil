import {
    ApiKildetype,
    ApiManuellVilkårsvurderingRequest,
    ApiMedlemskapshistorikkResponse,
    ApiMedlemskapsstatus,
    ApiMedlemskapsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
    ApiVurderingskildeAutomatisk,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { Handlingsvisning, Visningsfelt } from '@io/rest/handlingsvisning';
import { PersonMock, lesTestpersonfiler } from '@spesialist-mock/storage/person';

const AUTOMATISKE_MEDLEMSKAPSSVAR = new Map<string, AutomatiskSvar>([
    [
        '2564094783926',
        {
            status: ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
            årsaker: [{ regelId: 'SP6001', forklaringPaaUavklart: 'Brukeren har oppgitt arbeid utenfor Norge' }],
        },
    ],
    [
        '2805594640665',
        {
            status: ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
            årsaker: [{ regelId: 'SP6001', forklaringPaaUavklart: 'Brukeren har oppgitt arbeid utenfor Norge' }],
        },
    ],
    [
        '2348185725298',
        {
            status: ApiMedlemskapsstatus.UAVKLART,
            årsaker: [],
        },
    ],
    [
        '2805594640777',
        {
            status: ApiMedlemskapsstatus.NEI,
            årsaker: [],
        },
    ],
]);

interface AutomatiskSvar {
    status: Exclude<ApiMedlemskapsstatus, typeof ApiMedlemskapsstatus.JA>;
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
    const svar = aktørId !== null ? AUTOMATISKE_MEDLEMSKAPSSVAR.get(aktørId) : undefined;
    const vurdering = automatiskVurdering(medlemskapsvurderingId, skjæringstidspunkt, svar);
    vurderinger.set(medlemskapsvurderingId, vurdering);
    return vurdering;
}

// Speiler PostManuellVilkårsvurderingBehandler i sp-medlemskap: gir undefined hvis saksbehandler så på en
// vurdering som ikke lenger er gjeldende for skjæringstidspunktet
export function vurderMedlemskap(
    personPseudoId: string,
    request: ApiManuellVilkårsvurderingRequest,
): string | undefined {
    const gjeldende = hentMedlemskapshistorikk(personPseudoId, request.skjæringstidspunkt).historikk[0];
    if (gjeldende?.medlemskapsvurdering.id !== request.gjeldendeMedlemskapsvurderingId) return undefined;

    const id = crypto.randomUUID();
    const vurdering: ApiMedlemskapsvurdering = {
        id,
        status: request.status,
        vurdertTidspunkt: new Date().toISOString(),
        kilde: {
            kildetype: ApiKildetype.SAKSBEHANDLER,
            ident: 'S123456',
            fritekstbegrunnelse: request.fritekstbegrunnelse,
            journalpostId: request.journalpostId,
        },
    };
    vurderingerFor(personPseudoId).set(id, {
        skjæringstidspunkt: request.skjæringstidspunkt,
        medlemskapsvurdering: vurdering,
    });
    return id;
}

// Speiler GetSaksbehandlerhandlingVisningBehandler i sp-medlemskap: bare manuelle vurderinger har detaljer
export function hentVisning(personPseudoId: string, medlemskapsvurderingId: string): Handlingsvisning | undefined {
    const vurdering = vurderingerFor(personPseudoId).get(medlemskapsvurderingId)?.medlemskapsvurdering;
    if (!vurdering || vurdering.kilde.kildetype !== ApiKildetype.SAKSBEHANDLER) return undefined;
    const kilde = vurdering.kilde as ApiVurderingskildeSaksbehandler;
    const felter: Visningsfelt[] = [{ type: 'TEKST', tittel: 'Medlemskap', tekst: visningsnavn[vurdering.status] }];
    if (kilde.journalpostId.length > 0) {
        felter.push({ type: 'LISTE', tittel: 'Journalposter', elementer: kilde.journalpostId });
    }
    felter.push({ type: 'TEKST', tittel: 'Begrunnelse', tekst: kilde.fritekstbegrunnelse });
    return { felter };
}

const visningsnavn: Record<ApiMedlemskapsstatus, string> = {
    [ApiMedlemskapsstatus.JA]: 'Oppfylt',
    [ApiMedlemskapsstatus.NEI]: 'Ikke oppfylt',
    [ApiMedlemskapsstatus.UAVKLART]: 'Uavklart',
    [ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL]: 'Uavklart med brukerspørsmål',
};

// Speiler GetMedlemskapshistorikkBehandler i sp-medlemskap: alle vurderinger på skjæringstidspunktet, nyeste først
export function hentMedlemskapshistorikk(
    personPseudoId: string,
    skjæringstidspunkt: string,
): ApiMedlemskapshistorikkResponse {
    const historikk = [...vurderingerFor(personPseudoId).values()]
        .filter((vurdering) => vurdering.skjæringstidspunkt === skjæringstidspunkt)
        .map((vurdering) => vurdering.medlemskapsvurdering)
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
    svar: AutomatiskSvar | undefined,
): ApiVilkårsvurderingerForPersonResponse {
    return {
        skjæringstidspunkt,
        medlemskapsvurdering: {
            id,
            status: svar?.status ?? ApiMedlemskapsstatus.JA,
            vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
            kilde: {
                kildetype: ApiKildetype.AUTOMATISK,
                versjonAvKildekode: 'mock',
                oppslagsperiode: { fom: skjæringstidspunkt, tom: skjæringstidspunkt },
                årsaker: svar?.årsaker ?? [],
            },
        },
    };
}
