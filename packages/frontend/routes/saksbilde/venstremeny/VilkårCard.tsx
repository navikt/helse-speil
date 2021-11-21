import React from 'react';

import { Card } from './Card';
import { CardTitle } from './CardTitle';
import { VilkårList } from './VilkårList';

interface VilkårCardProps {
    aktivPeriode: Tidslinjeperiode;
    skjæringstidspunkt: DateString;
    vilkårsgrunnlaghistorikkId: UUID;
}

export const VilkårCard = ({ aktivPeriode, skjæringstidspunkt, vilkårsgrunnlaghistorikkId }: VilkårCardProps) => {
    return (
        <Card>
            <CardTitle>INNGANGSVILKÅR</CardTitle>
            <VilkårList
                periode={aktivPeriode}
                skjæringstidspunkt={skjæringstidspunkt}
                vilkårsgrunnlaghistorikkId={vilkårsgrunnlaghistorikkId}
            />
        </Card>
    );
};
