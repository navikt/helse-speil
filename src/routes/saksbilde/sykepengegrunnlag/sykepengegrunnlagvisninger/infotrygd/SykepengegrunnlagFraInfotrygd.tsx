import React, { ReactElement } from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';
import { ApiSaksbildePerson, ApiVilkårsgrunnlagInfotrygdV2 } from '@io/rest/generated/spesialist.schemas';
import { Inntekt } from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt';
import { getActiveInntekt } from '@state/utils';

import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';

import styles from './SykepengegrunnlagFraInfotrygd.module.css';

interface SykepengegrunnlagFraInfogtrygdProps {
    person: ApiSaksbildePerson;
    vilkårsgrunnlag: ApiVilkårsgrunnlagInfotrygdV2;
    organisasjonsnummer: string;
    navn: string;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    person,
    vilkårsgrunnlag,
    organisasjonsnummer,
    navn,
}: SykepengegrunnlagFraInfogtrygdProps): ReactElement => {
    const inntekt = getActiveInntekt(vilkårsgrunnlag, organisasjonsnummer);

    return (
        <Infotrygdvurdering title="Sykepengegrunnlag satt i Infotrygd">
            <div className={styles.oversikt}>
                <SykepengegrunnlagInfotrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={organisasjonsnummer}
                    arbeidsgivernavn={navn}
                />
                <span className={styles.strek} />
                <Inntekt person={person} inntekt={inntekt} vilkårsgrunnlag={vilkårsgrunnlag} />
            </div>
        </Infotrygdvurdering>
    );
};
