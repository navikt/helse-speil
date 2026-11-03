import {
    ApiKildetype,
    ApiMedlemskapshistorikkInnslag,
    ApiMedlemskapsvurdering,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { useGetMedlemskapshistorikkBehandler } from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';

export interface Medlemskapsendring {
    id: string;
    tidspunkt: string;
    vilkår: string;
    begrunnelse?: string;
    kilde: string;
    kildeErSaksbehandler: boolean;
    vurdering: ApiMedlemskapsvurdering;
    // Vurderinger overført fra Spleis og Infotrygd har ingen detaljer å vise
    harDetaljer: boolean;
}

export function useMedlemskapshistorikk(
    personPseudoId: string,
    skjæringstidspunkt: string,
    enabled: boolean,
): Medlemskapsendring[] {
    const { data } = useGetMedlemskapshistorikkBehandler(
        personPseudoId,
        { skjæringstidspunkt },
        { query: { enabled } },
    );
    const historikk = data?.historikk ?? [];

    return historikk.length >= 2 ? tilEndringer(historikk) : [];
}

function tilEndringer(historikk: ApiMedlemskapshistorikkInnslag[]): Medlemskapsendring[] {
    return historikk
        .map(({ vurdertTidspunkt, medlemskapsvurdering }) => tilEndring(vurdertTidspunkt, medlemskapsvurdering))
        .sort((a, b) => new Date(b.tidspunkt).getTime() - new Date(a.tidspunkt).getTime());
}

function tilEndring(tidspunkt: string, vurdering: ApiMedlemskapsvurdering): Medlemskapsendring {
    const { kilde } = vurdering;
    const kildeErSaksbehandler = kilde.kildetype === ApiKildetype.SAKSBEHANDLER;
    return {
        id: vurdering.id,
        tidspunkt,
        vilkår: 'Lovvalg og medlemskap',
        begrunnelse: kildeErSaksbehandler ? (kilde as ApiVurderingskildeSaksbehandler).fritekstbegrunnelse : undefined,
        kilde: kildetekst(vurdering),
        kildeErSaksbehandler,
        vurdering,
        harDetaljer: kilde.kildetype === ApiKildetype.AUTOMATISK || kildeErSaksbehandler,
    };
}

function kildetekst({ kilde }: ApiMedlemskapsvurdering): string {
    switch (kilde.kildetype) {
        case ApiKildetype.SAKSBEHANDLER:
            return (kilde as ApiVurderingskildeSaksbehandler).ident;
        case ApiKildetype.AUTOMATISK:
        case ApiKildetype.OVERFOERT_FRA_SPLEIS:
            return 'Automatisk';
        case ApiKildetype.OVERFOERT_FRA_INFOTRYGD:
            return 'Infotrygd';
    }
}
