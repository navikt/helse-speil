import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { TilkommenInntekt } from '@saksbilde/tilkommenInntekt/TilkommenInntekt';
import { Saksbildevarsler } from '@saksbilde/varsler/Saksbildevarsler';
import { getPeriodState } from '@utils/mapping';
import { isTilkommenInntekt } from '@utils/typeguards';

import styles from './SharedViews.module.css';

interface NyttInntektsforholdPeriodeViewProps {
    activePeriod: NyttInntektsforholdPeriodeFragment;
    person: PersonFragment;
}

export const NyttInntektsforholdPeriodeView = ({
    activePeriod,
    person,
}: NyttInntektsforholdPeriodeViewProps): ReactElement => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(isTilkommenInntekt(activePeriod) ? Fane.TilkommenInntekt : Fane.Sykepengegrunnlag);

    return (
        <div className={styles.Content} data-testid="saksbilde-content-uten-sykefravær">
            <Saksbildevarsler
                periodState={getPeriodState(activePeriod)}
                skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
            />
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
            {tab === 'tilkommen-inntekt' && (
                <div className={styles.RouteContainer}>
                    <TilkommenInntekt person={person} aktivPeriode={activePeriod} />
                </div>
            )}
        </div>
    );
};
