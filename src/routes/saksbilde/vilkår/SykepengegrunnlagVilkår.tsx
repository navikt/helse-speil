import React, { ReactElement } from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { VilkarsgrunnlagInfotrygdV2, VilkarsgrunnlagSpleisV2 } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { EndretParagraf } from './EndretParagraf';
import { VilkårsutfallKort } from './VilkårsutfallKort';
import { utfallFraOppfylt } from './vilkårsutfall';

interface SykepengegrunnlagVilkårProps {
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
    alderVedSkjæringstidspunkt: number;
    vurdertTekst?: string;
}

export function SykepengegrunnlagVilkår({
    vilkårsgrunnlag,
    alderVedSkjæringstidspunkt,
    vurdertTekst,
}: SykepengegrunnlagVilkårProps): ReactElement {
    const spleisgrunnlag = vilkårsgrunnlag.__typename === 'VilkarsgrunnlagSpleisV2' ? vilkårsgrunnlag : undefined;
    const harEndretParagraf = alderVedSkjæringstidspunkt < 70 && alderVedSkjæringstidspunkt >= 67;

    return (
        <VilkårsutfallKort
            tittel="Krav til minste sykepengegrunnlag"
            paragraf={harEndretParagraf ? <EndretParagraf /> : <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>}
            utfall={utfallFraOppfylt(spleisgrunnlag ? spleisgrunnlag.oppfyllerKravOmMinstelonn : true)}
            vurdertTekst={vurdertTekst}
        >
            {spleisgrunnlag && (
                <VStack gap="space-4">
                    <HStack gap="space-56">
                        <span>Sykepengegrunnlaget</span>
                        <span>
                            {spleisgrunnlag.sykepengegrunnlag
                                ? somPenger(spleisgrunnlag.sykepengegrunnlag)
                                : 'Ikke funnet'}
                        </span>
                    </HStack>
                    <span>
                        {alderVedSkjæringstidspunkt >= 67
                            ? `2G er ${somPenger(spleisgrunnlag.grunnbelop * 2)}`
                            : `0,5G er ${somPenger(spleisgrunnlag.grunnbelop / 2)}`}
                    </span>
                </VStack>
            )}
        </VilkårsutfallKort>
    );
}
