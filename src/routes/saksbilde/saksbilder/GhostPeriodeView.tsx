import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { GhostPeriodeFragment, PersonFragment } from '@io/graphql';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { TilkommenInntekt } from '@saksbilde/tilkommenInntekt/TilkommenInntekt';
import { isTilkommenInntekt } from '@utils/typeguards';

import styles from './SharedViews.module.css';

interface GhostPeriodeViewProps {
    activePeriod: GhostPeriodeFragment;
    person: PersonFragment;
}

export const GhostPeriodeView = ({ activePeriod, person }: GhostPeriodeViewProps): ReactElement => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(isTilkommenInntekt(activePeriod) ? Fane.TilkommenInntekt : Fane.Sykepengegrunnlag);

    return (
        <>
            {tab === 'sykepengegrunnlag' && (
                <div className={styles.RouteContainer}>
                    <Sykepengegrunnlag person={person} />
                </div>
            )}
            {tab === 'tilkommen-inntekt' && (
                <div className={styles.RouteContainer}>
                    <TilkommenInntekt person={person} aktivPeriode={activePeriod} />
                </div>
            )}
        </>
    );
};
