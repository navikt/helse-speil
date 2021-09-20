import React from 'react';

import { useVedtaksperiode } from '../../../state/tidslinje';

import { Card } from './Card';
import { CardTitle } from './CardTitle';
import { Vilkårsoversikt } from './Vilkårsoversikt';

interface VilkårCardProps {
    aktivPeriode: Tidslinjeperiode;
}

export const VilkårCard = ({ aktivPeriode }: VilkårCardProps) => {
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);

    if (!vedtaksperiode || !vedtaksperiode.fullstendig) return null;

    return (
        <Card>
            <CardTitle>INNGANGSVILKÅR</CardTitle>
            <Vilkårsoversikt vedtaksperiode={vedtaksperiode} />
        </Card>
    );
};
