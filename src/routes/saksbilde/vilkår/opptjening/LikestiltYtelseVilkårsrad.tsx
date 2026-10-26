import React, { ReactElement } from 'react';

import { ApiVilkårskode, ApiVilkårsvurdering } from '@io/rest/generated/vilkarsproving.schemas';

import { Detaljrad, Saksbehandlerdetaljer, Vilkårsrad, erSaksbehandlerkilde } from './Vilkårsrad';
import { erOppfylt, punktumvurderinger, utledLikestiltYtelse } from './likestiltYtelse';

interface LikestiltYtelseVilkårsradProps {
    vurderingFor: (vilkårskode: ApiVilkårskode) => ApiVilkårsvurdering | undefined;
    erAvgjørende?: boolean;
    erAktiv?: boolean;
    onVurder?: () => void;
    visDetaljer?: boolean;
}

export function LikestiltYtelseVilkårsrad({
    vurderingFor,
    erAvgjørende,
    erAktiv,
    onVurder,
    visDetaljer = false,
}: LikestiltYtelseVilkårsradProps): ReactElement {
    const { første, andre, tredje } = punktumvurderinger(vurderingFor);
    const { utfall, hjemmel } = utledLikestiltYtelse({ første, andre, tredje });

    return (
        <Vilkårsrad
            navn="Likestilt ytelse"
            utfall={utfall}
            vurdering={første}
            erAvgjørende={erAvgjørende}
            erAktiv={erAktiv}
            onVurder={onVurder}
        >
            {visDetaljer && første && erSaksbehandlerkilde(første.kilde) && (
                <Saksbehandlerdetaljer kilde={første.kilde}>
                    <Detaljrad label="Minst 4 uker sammenlagt">{jaNei(erOppfylt(første))}</Detaljrad>
                    {andre && <Detaljrad label="Foreldrepenger opptjent på AAP">{jaNei(!erOppfylt(andre))}</Detaljrad>}
                    {tredje && <Detaljrad label="Yrkesaktiv 4 uker før uttak">{jaNei(erOppfylt(tredje))}</Detaljrad>}
                    {hjemmel && <Detaljrad label="Hjemmel">{hjemmel}</Detaljrad>}
                </Saksbehandlerdetaljer>
            )}
        </Vilkårsrad>
    );
}

function jaNei(verdi: boolean): string {
    return verdi ? 'Ja' : 'Nei';
}
