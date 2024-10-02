import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import { TilkommenInntekt } from '@saksbilde/tilkommenInntekt/TilkommenInntekt';
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
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(isTilkommenInntekt(activePeriod) ? Fane.TilkommenInntekt : Fane.Sykepengegrunnlag);

    return (
        <>
            {tab === 'tilkommen-inntekt' && (
                <div className={styles.RouteContainer}>
                    <TilkommenInntekt person={person} aktivPeriode={activePeriod} />
                </div>
            )}
        </>
    );
};
