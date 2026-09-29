import React, { ReactElement } from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { Vurdering } from '@io/graphql';
import { getFormattedDatetimeString } from '@utils/date';
import { somPenger } from '@utils/locale';

import { EndretParagrafContainer } from './EndretParagrafContainer';
import { VilkårsutfallKort, utfallForOppfylt } from './VilkårsutfallKort';

interface SykepengegrunnlagVilkårProps {
    oppfylt: boolean | null;
    sykepengegrunnlag?: number;
    grunnbeløp?: number;
    alderVedSkjæringstidspunkt: number;
    vurdertIInfotrygd: boolean;
    vurdering?: Vurdering | null;
}

export const SykepengegrunnlagVilkår = ({
    oppfylt,
    sykepengegrunnlag,
    grunnbeløp,
    alderVedSkjæringstidspunkt,
    vurdertIInfotrygd,
    vurdering,
}: SykepengegrunnlagVilkårProps): ReactElement => {
    const harEndretParagraf = alderVedSkjæringstidspunkt < 70 && alderVedSkjæringstidspunkt >= 67;
    const utfall = utfallForOppfylt(oppfylt);

    const vurdertTagTekst = vurdertIInfotrygd
        ? 'Vurdert i Infotrygd'
        : vurdering?.automatisk
          ? `Vurdert automatisk ${getFormattedDatetimeString(vurdering.tidsstempel)}`
          : vurdering
            ? `Vurdert ${getFormattedDatetimeString(vurdering.tidsstempel)} – ${vurdering.ident}`
            : undefined;

    return (
        <VilkårsutfallKort
            titleId="sykepengegrunnlag-tittel"
            testId="sykepengegrunnlag"
            tittel="Krav til minste sykepengegrunnlag"
            paragraf={
                harEndretParagraf ? <EndretParagrafContainer /> : <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
            }
            utfall={utfall}
            vurdertTagTekst={vurdertTagTekst}
        >
            {sykepengegrunnlag !== undefined && grunnbeløp !== undefined && (
                <VStack gap="space-4">
                    <HStack gap="space-56">
                        <span>Sykepengegrunnlaget</span>
                        <span>{sykepengegrunnlag ? somPenger(sykepengegrunnlag) : 'Ikke funnet'}</span>
                    </HStack>
                    <span>
                        {alderVedSkjæringstidspunkt >= 67
                            ? `2G er ${somPenger(grunnbeløp * 2)}`
                            : `0,5G er ${somPenger(grunnbeløp / 2)}`}
                    </span>
                </VStack>
            )}
        </VilkårsutfallKort>
    );
};
