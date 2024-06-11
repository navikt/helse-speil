import { usePathname } from 'next/navigation';
import React from 'react';
import { last } from 'remeda';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { GhostPeriode } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';

import styles from './SharedViews.module.css';

interface GhostPeriodeViewProps {
    activePeriod: GhostPeriode;
}

export const GhostPeriodeView: React.FC<GhostPeriodeViewProps> = ({ activePeriod }) => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(Fane.Sykepengegrunnlag);

    return (
        <div className={styles.Content} data-testid="saksbilde-content-uten-sykefravær">
            <Saksbildevarsler
                periodState={getPeriodState(activePeriod)}
                skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
            />
            <SaksbildeMenu activePeriod={activePeriod} />
            {tab === 'sykepengegrunnlag' && (
                <div className={styles.RouteContainer}>
                    <Sykepengegrunnlag />
                </div>
            )}
        </div>
    );
};

export default GhostPeriodeView;
