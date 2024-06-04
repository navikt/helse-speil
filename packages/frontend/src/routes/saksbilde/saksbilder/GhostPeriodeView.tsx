import { useParams } from 'next/navigation';
import React from 'react';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { GhostPeriode } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';

import { Historikk } from '../historikk';
import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

interface GhostPeriodeViewProps {
    activePeriod: GhostPeriode;
}

export const GhostPeriodeView: React.FC<GhostPeriodeViewProps> = ({ activePeriod }) => {
    if (!activePeriod.skjaeringstidspunkt || !activePeriod.vilkarsgrunnlagId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }
    const { tab } = useParams<{ tab: string }>();

    useNavigateOnMount(Fane.Sykepengegrunnlag);

    return (
        <>
            <Venstremeny />
            <div className={styles.Content} data-testid="saksbilde-content-uten-sykefravær">
                <Saksbildevarsler
                    periodState={getPeriodState(activePeriod)}
                    skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                />
                <SaksbildeMenu />
                {tab === 'sykepengegrunnlag' && <Sykepengegrunnlag />}
            </div>
            <Historikk />
        </>
    );
};

export default GhostPeriodeView;
