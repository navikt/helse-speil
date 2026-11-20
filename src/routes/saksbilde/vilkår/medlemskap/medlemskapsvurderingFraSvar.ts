import {
    ApiMedlemskapsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';

// Speil prodsettes før sp-medlemskap, som til da svarer med vurderingen som første element i `krav`
// TODO: Fjern `krav` når sp-medlemskap svarer med `medlemskapsvurdering` i prod
type SvarFørOmdøping = { krav?: ApiMedlemskapsvurdering[] };

export function medlemskapsvurderingFraSvar(
    data: ApiVilkårsvurderingerForPersonResponse | undefined,
): ApiMedlemskapsvurdering | undefined {
    const svar = data as (Partial<ApiVilkårsvurderingerForPersonResponse> & SvarFørOmdøping) | undefined;
    return svar?.medlemskapsvurdering ?? svar?.krav?.[0];
}
