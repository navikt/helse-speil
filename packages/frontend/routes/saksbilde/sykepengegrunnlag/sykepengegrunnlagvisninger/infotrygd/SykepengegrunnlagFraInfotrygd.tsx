import React from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';
import { VilkarsgrunnlagInfotrygd } from '@io/graphql';
import { getRequiredInntekt } from '@state/selectors/person';

import { Inntekt } from '../../inntekt/Inntekt';
import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';

import styles from './SykepengegrunnlagFraInfotrygd.module.css';

interface SykepengegrunnlagFraInfogtrygdProps {
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygd;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
}: SykepengegrunnlagFraInfogtrygdProps) => {
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, organisasjonsnummer);

    return (
        <Infotrygdvurdering title="Sykepengegrunnlag satt i Infotrygd">
            <div className={styles.oversikt}>
                <SykepengegrunnlagInfotrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={organisasjonsnummer}
                />
                <span className={styles.strek} />
                <Inntekt inntekt={inntekt} />
            </div>
        </Infotrygdvurdering>
    );
};
