import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';
import { useNyOpptjeningVisning } from '@state/toggles';
import { getVilkårsgrunnlag } from '@state/utils';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode } from '@utils/typeguards';

import { VilkårsvurderingerKnapp } from './VilkårsvurderingerKnapp';

interface VilkårsvurderingerKnappHvisTilgjengeligProps {
    person: PersonFragment;
    aktivPeriode: ActivePeriod;
}

export const VilkårsvurderingerKnappHvisTilgjengelig = ({
    person,
    aktivPeriode,
}: VilkårsvurderingerKnappHvisTilgjengeligProps): ReactElement | null => {
    const nyOpptjeningVisning = useNyOpptjeningVisning();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    if (!nyOpptjeningVisning || !isBeregnetPeriode(aktivPeriode)) return null;

    const opptjeningsvurderingId = getVilkårsgrunnlag(person, aktivPeriode.vilkarsgrunnlagId)?.opptjeningsvurderingId;

    if (!opptjeningsvurderingId) return null;

    return <VilkårsvurderingerKnapp personPseudoId={personPseudoId} opptjeningsvurderingId={opptjeningsvurderingId} />;
};
