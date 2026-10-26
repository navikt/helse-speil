import { vilkårskodeLabels } from '@form-schemas/opptjeningSkjema';
import {
    ApiKildetype,
    ApiOpptjeningshistorikkInnslag,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVurderingskilde,
} from '@io/rest/generated/vilkarsproving.schemas';
import { useGetOpptjeningshistorikkBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { Vilkårsutfall, utfallFraApi, utfallFraOppfylt } from '@saksbilde/vilkår/vilkårsutfall';

import { erLikestiltYtelse, punktumvurderinger, utledLikestiltYtelse } from './likestiltYtelse';

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

export type Endringsdetaljer =
    | { type: 'vilkår'; vurdering: ApiVilkårsvurdering }
    | { type: 'likestiltYtelse'; vurderinger: ApiVilkårsvurdering[] };

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

    const unikeVurderinger = [...vurderinger.values()];
    const endringer = [
        ...infotrygdendringer.values(),
        ...unikeVurderinger
            .filter((vurdering) => !erLikestiltYtelse(vurdering.vilkårskode))
            .map(vilkårsvurderingTilEndring),
        ...likestiltYtelseEndringer(unikeVurderinger.filter((vurdering) => erLikestiltYtelse(vurdering.vilkårskode))),
    ];

    return endringer.sort((a, b) => new Date(b.tidspunkt).getTime() - new Date(a.tidspunkt).getTime());
}

// Punktumene i § 8-2 andre ledd vurderes samlet og lagres med samme tidspunkt
function likestiltYtelseEndringer(likestilte: ApiVilkårsvurdering[]): Opptjeningsendring[] {
    return likestilte
        .filter((vurdering) => vurdering.vilkårskode === ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER)
        .map((første) =>
            likestiltYtelseTilEndring(
                første,
                likestilte.filter((vurdering) => vurdering.vurdertTidspunkt === første.vurdertTidspunkt),
            ),
        );
}

function vilkårsvurderingTilEndring(vurdering: ApiVilkårsvurdering): Opptjeningsendring {
    return {
        id: vurdering.id,
        tidspunkt: vurdering.vurdertTidspunkt,
        vilkår: `Opptjeningstid – ${medLitenForbokstav(vilkårskodeLabels[vurdering.vilkårskode])}`,
        utfall: utfallFraApi(vurdering.utfall),
        begrunnelse: begrunnelseFra(vurdering.kilde),
        kilde: kildetekst(vurdering.kilde),
        detaljer: { type: 'vilkår', vurdering },
    };
}

function likestiltYtelseTilEndring(
    første: ApiVilkårsvurdering,
    vurderinger: ApiVilkårsvurdering[],
): Opptjeningsendring {
    const { utfall } = utledLikestiltYtelse(
        punktumvurderinger((vilkårskode) => vurderinger.find((vurdering) => vurdering.vilkårskode === vilkårskode)),
    );
    return {
        id: første.id,
        tidspunkt: første.vurdertTidspunkt,
        vilkår: 'Opptjeningstid – likestilt ytelse',
        utfall,
        begrunnelse: begrunnelseFra(første.kilde),
        kilde: kildetekst(første.kilde),
        detaljer: { type: 'likestiltYtelse', vurderinger },
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
            return 'Automatisk';
        case ApiKildetype.OVERFOERT_FRA_SPLEIS:
            return 'Spleis';
    }
}

// Beholder forkortelser som AAP
function medLitenForbokstav(tekst: string): string {
    return tekst.charAt(0).toLowerCase() + tekst.slice(1);
}
