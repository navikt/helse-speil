import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { TilkommenInntekt } from '@saksbilde/tilkommenInntekt/TilkommenInntekt';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { Inngangsvilkår } from '@saksbilde/vilkår/Inngangsvilkår';
import { Vurderingsmomenter } from '@saksbilde/vurderingsmomenter/Vurderingsmomenter';

import styles from './SharedViews.module.css';

interface BeregnetPeriodeViewProps {
    period: BeregnetPeriodeFragment;
    person: PersonFragment;
}

export const BeregnetPeriodeView = ({ period, person }: BeregnetPeriodeViewProps): ReactElement => {
    if (!period.skjaeringstidspunkt || !period.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const tab = last(usePathname().split('/'));

    return (
        <div className={styles.RouteContainer}>
            {tab === 'dagoversikt' && <Utbetaling person={person} />}
            {decodeURI(tab ?? '') === 'inngangsvilkår' && <Inngangsvilkår />}
            {tab === 'sykepengegrunnlag' && <Sykepengegrunnlag person={person} />}
            {tab === 'vurderingsmomenter' && <Vurderingsmomenter person={person} />}
            {tab === 'tilkommen-inntekt' && <TilkommenInntekt person={person} aktivPeriode={period} />}
        </div>
    );
};
