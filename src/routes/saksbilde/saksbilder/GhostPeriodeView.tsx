import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { GhostPeriodeFragment, PersonFragment } from '@io/graphql';
import { Arbeidsforhold } from '@saksbilde/arbeidsforhold/Arbeidsforhold';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { Saksbildevarsler } from '@saksbilde/varsler/Saksbildevarsler';
import { getVilkårsgrunnlag } from '@state/utils';
import { getPeriodState } from '@utils/mapping';
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
    useNavigateOnMount(
        isTilkommenInntekt(activePeriod, getVilkårsgrunnlag(person, activePeriod.vilkarsgrunnlagId))
            ? Fane.Arbeidsforhold
            : Fane.Sykepengegrunnlag,
    );

    return (
        <div className={styles.Content} data-testid="saksbilde-content-uten-sykefravær">
            <Saksbildevarsler
                periodState={getPeriodState(activePeriod)}
                skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
            />
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
            {tab === 'sykepengegrunnlag' && (
                <div className={styles.RouteContainer}>
                    <Sykepengegrunnlag person={person} />
                </div>
            )}
            {tab === 'arbeidsforhold' && (
                <div className={styles.RouteContainer}>
                    <Arbeidsforhold person={person} aktivPeriode={activePeriod} />
                </div>
            )}
        </div>
    );
};
