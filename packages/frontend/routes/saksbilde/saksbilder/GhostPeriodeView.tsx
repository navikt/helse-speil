import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Location } from '@hooks/useNavigation';
import type { GhostPeriode } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';

import { Historikk } from '../historikk';
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

    useNavigateOnMount(Location.Sykepengegrunnlag);

    return (
        <>
            <Venstremeny />
            <div className={styles.Content} data-testid="saksbilde-content-uten-sykefravær">
                <Saksbildevarsler
                    periodState={getPeriodState(activePeriod)}
                    skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                />
                <Routes>
                    <Route
                        path="sykepengegrunnlag"
                        element={
                            <div className={styles.RouteContainer}>
                                <Sykepengegrunnlag />
                            </div>
                        }
                    />
                </Routes>
            </div>
            <Historikk />
        </>
    );
};

export default GhostPeriodeView;
