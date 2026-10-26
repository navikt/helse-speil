import React, { ReactElement } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { vilkårskodeLabels } from '@form-schemas/opptjeningSkjema';
import {
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVurderingsgrunnlag,
    ApiVurderingsgrunnlagArbeidsforhold,
    ApiVurderingskilde,
} from '@io/rest/generated/vilkarsproving.schemas';
import { utfallFraApi } from '@saksbilde/vilkår/vilkårsutfall';
import { somNorskDato } from '@utils/date';

import { ArbeidsforholdIGrunnlaget } from './ArbeidsforholdIGrunnlaget';
import { Saksbehandlerdetaljer, Vilkårsrad, erSaksbehandlerkilde } from './Vilkårsrad';

interface OpptjeningVilkårsradProps {
    vilkårskode: ApiVilkårskode;
    vurdering?: ApiVilkårsvurdering;
    erAvgjørende?: boolean;
    erAktiv?: boolean;
    onVurder?: () => void;
    visDetaljer?: boolean;
}

export function OpptjeningVilkårsrad({
    vilkårskode,
    vurdering,
    erAvgjørende,
    erAktiv,
    onVurder,
    visDetaljer = false,
}: OpptjeningVilkårsradProps): ReactElement {
    const utfall = utfallFraApi(vurdering?.utfall);
    const erAutomatiskOppfylt = utfall === 'Oppfylt' && !!vurdering && !erSaksbehandlerkilde(vurdering.kilde);
    const saksbehandlerkilde =
        visDetaljer && vurdering && erSaksbehandlerkilde(vurdering.kilde) ? vurdering.kilde : undefined;
    const arbeidsforholdgrunnlag = vurdering && arbeidsforholdgrunnlagFra(vurdering.kilde);

    return (
        <Vilkårsrad
            navn={vilkårskodeLabels[vilkårskode]}
            utfall={utfall}
            vurdering={vurdering}
            erAvgjørende={erAvgjørende}
            erAktiv={erAktiv}
            onVurder={erAutomatiskOppfylt ? undefined : onVurder}
        >
            {(saksbehandlerkilde || arbeidsforholdgrunnlag) && (
                <VStack gap="space-12">
                    {saksbehandlerkilde && <Saksbehandlerdetaljer kilde={saksbehandlerkilde} />}
                    {arbeidsforholdgrunnlag && <Arbeidsforholddetaljer grunnlag={arbeidsforholdgrunnlag} />}
                </VStack>
            )}
        </Vilkårsrad>
    );
}

function Arbeidsforholddetaljer({ grunnlag }: { grunnlag: ApiVurderingsgrunnlagArbeidsforhold }): ReactElement {
    return (
        <VStack gap="space-4">
            {grunnlag.opptjeningsperiode && (
                <HStack gap="space-24">
                    <BodyShort>Opptjening fra</BodyShort>
                    <BodyShort>
                        {`${somNorskDato(grunnlag.opptjeningsperiode.fom) ?? 'ukjent'} (${grunnlag.opptjeningsdager} dager)`}
                    </BodyShort>
                </HStack>
            )}
            <ArbeidsforholdIGrunnlaget arbeidsforhold={grunnlag.arbeidsforhold} />
        </VStack>
    );
}

function arbeidsforholdgrunnlagFra(kilde: ApiVurderingskilde): ApiVurderingsgrunnlagArbeidsforhold | undefined {
    const grunnlag: ApiVurderingsgrunnlag | undefined = 'grunnlag' in kilde ? kilde.grunnlag : undefined;
    return grunnlag && erArbeidsforholdgrunnlag(grunnlag) ? grunnlag : undefined;
}

function erArbeidsforholdgrunnlag(grunnlag: ApiVurderingsgrunnlag): grunnlag is ApiVurderingsgrunnlagArbeidsforhold {
    return 'arbeidsforhold' in grunnlag;
}
