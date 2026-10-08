import { vilkårskodeLabels } from '@form-schemas/manuellVurderingAvVilkårSkjema';
import {
    ApiKildetype,
    ApiOpptjeningshistorikkInnslag,
    ApiVilkårsvurdering,
    ApiVurderingskilde,
} from '@io/rest/generated/vilkarsproving.schemas';
import { useGetOpptjeningshistorikkBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { Vilkårsutfall, utfallFraApi, utfallFraOppfylt } from '@saksbilde/vilkår/vilkårsutfall';

export interface Opptjeningsendring {
    id: string;
    tidspunkt: string;
    vilkår: string;
    utfall: Vilkårsutfall;
    begrunnelse?: string;
    kilde: string;
}

export function useOpptjeningshistorikk(personPseudoId: string, skjæringstidspunkt: string): Opptjeningsendring[] {
    const { data } = useGetOpptjeningshistorikkBehandler(personPseudoId, { skjæringstidspunkt });
    const historikk = data?.historikk ?? [];

    return harFlereOpptjeningsvurderinger(historikk) ? tilEndringer(historikk) : [];
}

function harFlereOpptjeningsvurderinger(historikk: ApiOpptjeningshistorikkInnslag[]): boolean {
    return new Set(historikk.map((innslag) => innslag.opptjeningsvurdering.id)).size >= 2;
}

function tilEndringer(historikk: ApiOpptjeningshistorikkInnslag[]): Opptjeningsendring[] {
    const endringer = new Map<string, Opptjeningsendring>();

    historikk.forEach(({ vurdertTidspunkt, opptjeningsvurdering }) => {
        if ('vurderinger' in opptjeningsvurdering) {
            // En vilkårsvurdering videreføres med samme id i nye opptjeningsvurderinger, og skal bare vises én gang
            opptjeningsvurdering.vurderinger.forEach((vurdering) =>
                endringer.set(vurdering.id, vilkårsvurderingTilEndring(vurdering)),
            );
        } else {
            endringer.set(opptjeningsvurdering.id, {
                id: opptjeningsvurdering.id,
                tidspunkt: vurdertTidspunkt,
                vilkår: 'Opptjeningstid',
                utfall: utfallFraOppfylt(opptjeningsvurdering.opptjeningOk),
                kilde: 'Infotrygd',
            });
        }
    });

    return [...endringer.values()].sort((a, b) => new Date(b.tidspunkt).getTime() - new Date(a.tidspunkt).getTime());
}

function vilkårsvurderingTilEndring(vurdering: ApiVilkårsvurdering): Opptjeningsendring {
    return {
        id: vurdering.id,
        tidspunkt: vurdering.vurdertTidspunkt,
        vilkår: `Opptjeningstid – ${vilkårskodeLabels[vurdering.vilkårskode].toLowerCase()}`,
        utfall: utfallFraApi(vurdering.utfall),
        begrunnelse: 'fritekstbegrunnelse' in vurdering.kilde ? vurdering.kilde.fritekstbegrunnelse : undefined,
        kilde: kildetekst(vurdering.kilde),
    };
}

function kildetekst(kilde: ApiVurderingskilde): string {
    switch (kilde.kildetype) {
        case ApiKildetype.SAKSBEHANDLER:
            return 'ident' in kilde ? kilde.ident : 'Saksbehandler';
        case ApiKildetype.AUTOMATISK:
            return 'Automatisk';
        case ApiKildetype.OVERFOERT_FRA_SPLEIS:
            return 'Spleis';
    }
}
