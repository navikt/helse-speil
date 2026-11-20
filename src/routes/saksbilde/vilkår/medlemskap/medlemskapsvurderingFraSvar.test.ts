import {
    ApiKildetype,
    ApiMedlemskapsstatus,
    ApiMedlemskapsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { medlemskapsvurderingFraSvar } from '@saksbilde/vilkår/medlemskap/medlemskapsvurderingFraSvar';

describe('medlemskapsvurderingFraSvar', () => {
    it('henter medlemskapsvurderingen', () => {
        expect(medlemskapsvurderingFraSvar({ skjæringstidspunkt: '2024-01-01', medlemskapsvurdering: vurdering })).toBe(
            vurdering,
        );
    });

    it('henter første element i krav fra sp-medlemskap før omdøpingen, med de gamle feltene', () => {
        const gammelVurdering = { ...vurdering, kravkode: 'MEDLEMSKAP', medlemskapOk: true };
        expect(medlemskapsvurderingFraSvar(svarFørOmdøping([gammelVurdering]))).toBe(gammelVurdering);
    });

    it('gir undefined uten svar eller med tom krav-liste', () => {
        expect(medlemskapsvurderingFraSvar(undefined)).toBeUndefined();
        expect(medlemskapsvurderingFraSvar(svarFørOmdøping([]))).toBeUndefined();
    });
});

const vurdering: ApiMedlemskapsvurdering = {
    id: 'en-id',
    status: ApiMedlemskapsstatus.JA,
    vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
    kilde: {
        kildetype: ApiKildetype.AUTOMATISK,
        versjonAvKildekode: '1',
        oppslagsperiode: { fom: '2024-01-01', tom: '2024-01-01' },
        årsaker: [],
    },
};

function svarFørOmdøping(krav: object[]): ApiVilkårsvurderingerForPersonResponse {
    return { skjæringstidspunkt: '2024-01-01', krav } as unknown as ApiVilkårsvurderingerForPersonResponse;
}
