import styled from '@emotion/styled';
import React from 'react';

import { Location, useNavigation } from '../../../hooks/useNavigation';
import { Periodetype, Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';

import { TabLink } from '../TabLink';
import { Sakslinjemeny, VerktøylinjeForTomtSaksbilde } from './Sakslinjemeny';
import { HjemIkon } from './icons/HjemIkon';

const Container = styled.div`
    height: 48px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--navds-color-border);
    display: flex;
    flex: 1;
    padding: 0 2.5rem 0 2rem;

    > div:last-of-type {
        margin-left: 1rem;
    }
`;

const TabList = styled.span`
    display: flex;
`;

interface SakslinjeProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Sakslinje = ({ aktivPeriode }: SakslinjeProps) => {
    const { pathForLocation } = useNavigation();

    return (
        <Container>
            {aktivPeriode?.type === Periodetype.VEDTAKSPERIODE && (
                <TabList role="tablist">
                    <TabLink to={pathForLocation(Location.Utbetaling)} title="Utbetaling" icon={<HjemIkon />}>
                        Utbetaling
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Vilkår)} title="Vilkår">
                        Vilkår
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Sykepengegrunnlag)} title="Sykepengegrunnlag">
                        Sykepengegrunnlag
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Faresignaler)} title="Faresignaler">
                        Faresignaler
                    </TabLink>
                </TabList>
            )}
            <Sakslinjemeny aktivPeriode={aktivPeriode} />
        </Container>
    );
};

export const SakslinjeForTomtSaksbilde = () => (
    <Container>
        <VerktøylinjeForTomtSaksbilde />
    </Container>
);
