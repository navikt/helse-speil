import React, { HTMLAttributes } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { VilkarsgrunnlagSpleisV2 } from '@io/graphql';
import styles from '@saksbilde/sykepengegrunnlag/sykepengegrunnlagvisninger/spleis/SykepengegrunnlagFraSpleis.module.css';
import { SykepengegrunnlagSelvstendigPanel } from '@saksbilde/sykepengegrunnlag/sykepengegrunnlagvisninger/spleis/selvstendig/SykepengegrunnlagSelvstendigPanel';

interface SykepengegrunnlagProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2;
}

export const SykepengegrunnlagSelvstendig = ({ vilkårsgrunnlag }: SykepengegrunnlagProps) => {
    return (
        <HStack justify="start" wrap={false}>
            <SykepengegrunnlagSelvstendigPanel
                beregningsgrunnlag={vilkårsgrunnlag.beregningsgrunnlag}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
            />
            <span className={styles.strek} />
            <BodyShort>&nbsp;</BodyShort>
        </HStack>
    );
};
