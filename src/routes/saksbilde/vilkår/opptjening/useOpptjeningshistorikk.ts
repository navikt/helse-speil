import {
    ApiKildetype,
    ApiOpptjeningshistorikkInnslag,
    ApiVilkårsvurdering,
    ApiVurderingskilde,
} from '@io/rest/generated/vilkarsproving.schemas';
import { useGetOpptjeningshistorikkBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { Vilkårsutfall, utfallFraOppfylt } from '@saksbilde/vilkår/vilkårsutfall';

import { opptjeningsvilkår, utledOpptjening, vurderingForVisning } from './opptjeningsutfall';

export interface Opptjeningsendring {
    id: string;
    tidspunkt: string;
    vilkår: string;
    utfall: Vilkårsutfall;
    begrunnelse?: string;
    kilde: string;
    // Opptjeningsvurderinger fra Infotrygd har ingen vilkårsvurderinger å vise
    detaljer?: Endringsdetaljer;
}

export interface Endringsdetaljer {
    vurderinger: ApiVilkårsvurdering[];
}

export function useOpptjeningshistorikk(
    personPseudoId: string,
    skjæringstidspunkt: string,
    enabled: boolean,
): Opptjeningsendring[] {
    const { data } = useGetOpptjeningshistorikkBehandler(
        personPseudoId,
        { skjæringstidspunkt },
        { query: { enabled } },
    );
    const historikk = data?.historikk ?? [];

    return harFlereOpptjeningsvurderinger(historikk) ? tilEndringer(historikk) : [];
}

function harFlereOpptjeningsvurderinger(historikk: ApiOpptjeningshistorikkInnslag[]): boolean {
    return new Set(historikk.map((innslag) => innslag.opptjeningsvurdering.id)).size >= 2;
}

function tilEndringer(historikk: ApiOpptjeningshistorikkInnslag[]): Opptjeningsendring[] {
    const infotrygdendringer = new Map<string, Opptjeningsendring>();
    // En vilkårsvurdering videreføres med samme id i nye opptjeningsvurderinger, og skal bare vises én gang
    const vurderinger = new Map<string, ApiVilkårsvurdering>();

    historikk.forEach(({ vurdertTidspunkt, opptjeningsvurdering }) => {
        if ('vurderinger' in opptjeningsvurdering) {
            opptjeningsvurdering.vurderinger.forEach((vurdering) => vurderinger.set(vurdering.id, vurdering));
        } else {
            infotrygdendringer.set(opptjeningsvurdering.id, {
                id: opptjeningsvurdering.id,
                tidspunkt: vurdertTidspunkt,
                vilkår: 'Opptjeningstid',
                utfall: utfallFraOppfylt(opptjeningsvurdering.opptjeningOk),
                kilde: 'Infotrygd',
            });
        }
    });

    const endringer = [...infotrygdendringer.values(), ...vurderingsendringer([...vurderinger.values()])];

    return endringer.sort((a, b) => new Date(b.tidspunkt).getTime() - new Date(a.tidspunkt).getTime());
}

// Første ledd og punktumene i andre ledd lagres med samme tidspunkt når de vurderes i samme skjema
function vurderingsendringer(vurderinger: ApiVilkårsvurdering[]): Opptjeningsendring[] {
    const perTidspunkt = new Map<string, ApiVilkårsvurdering[]>();
    vurderinger.forEach((vurdering) =>
        perTidspunkt.set(vurdering.vurdertTidspunkt, [
            ...(perTidspunkt.get(vurdering.vurdertTidspunkt) ?? []),
            vurdering,
        ]),
    );
    return [...perTidspunkt.values()].map(vurderingerTilEndring);
}

function vurderingerTilEndring(vurderinger: ApiVilkårsvurdering[]): Opptjeningsendring {
    const vilkår = opptjeningsvilkår((vilkårskode) =>
        vurderinger.find((vurdering) => vurdering.vilkårskode === vilkårskode),
    );
    const representant = vurderingForVisning(vilkår) ?? vurderinger[0]!;
    return {
        id: representant.id,
        tidspunkt: representant.vurdertTidspunkt,
        vilkår: 'Opptjeningstid',
        utfall: utledOpptjening(vilkår).utfall,
        begrunnelse: begrunnelseFra(representant.kilde),
        kilde: kildetekst(representant.kilde),
        detaljer: { vurderinger },
    };
}

function begrunnelseFra(kilde: ApiVurderingskilde): string | undefined {
    return 'fritekstbegrunnelse' in kilde ? kilde.fritekstbegrunnelse : undefined;
}

function kildetekst(kilde: ApiVurderingskilde): string {
    switch (kilde.kildetype) {
        case ApiKildetype.SAKSBEHANDLER:
            return 'ident' in kilde ? kilde.ident : 'Saksbehandler';
        case ApiKildetype.AUTOMATISK:
        case ApiKildetype.OVERFOERT_FRA_SPLEIS:
            return 'Automatisk';
    }
}
