import React, { ReactElement } from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';
import { PersonFragment, VilkarsgrunnlagInfotrygdV2 } from '@io/graphql';
import { Inntekt } from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { getRequiredInntekt } from '@state/utils';

import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';

import styles from './SykepengegrunnlagFraInfotrygd.module.css';

interface SykepengegrunnlagFraInfogtrygdProps {
    person: PersonFragment;
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygdV2;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    person,
    vilkårsgrunnlag,
    organisasjonsnummer,
}: SykepengegrunnlagFraInfogtrygdProps): ReactElement => {
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, organisasjonsnummer);
    const arbeidsgivernavn = useArbeidsgiver(person, inntekt.arbeidsgiver)?.navn;

    return (
        <Infotrygdvurdering title="Sykepengegrunnlag satt i Infotrygd">
            <div className={styles.oversikt}>
                <SykepengegrunnlagInfotrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={organisasjonsnummer}
                    arbeidsgivernavn={arbeidsgivernavn}
                />
                <span className={styles.strek} />
                <Inntekt person={person} inntekt={inntekt} />
            </div>
        </Infotrygdvurdering>
    );
};
