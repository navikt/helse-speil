import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React from 'react';

import { Location, useNavigation } from '../../../hooks/useNavigation';

import { TabLink } from '../TabLink';
import { Infolinje } from './Infolinje';
import { Verktøylinje } from './Verktøylinje';
import { HjemIkon } from './icons/HjemIkon';

const Container = styled.div`
    height: 74px;
    border-bottom: 1px solid var(--navds-color-border);
    display: flex;
    flex: 1;
    padding: 0 2.5rem 0 2rem;
`;

const TabList = styled.span`
    display: flex;
`;

interface SakslinjeProps {
    erNormalVedtaksperiode: Boolean;
}

export const Sakslinje = ({ erNormalVedtaksperiode }: SakslinjeProps) => {
    const { pathForLocation } = useNavigation();

    return (
        <Container>
            {erNormalVedtaksperiode && (
                <TabList role="tablist">
                    <TabLink to={pathForLocation(Location.Utbetaling)} title="Utbetaling" icon={<HjemIkon />}>
                        Utbetaling
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Sykmeldingsperiode)} title="Smperiode">
                        Smperiode
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Vilkår)} title="Vilkår">
                        Vilkår
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Sykepengegrunnlag)} title="Spgrunnlag">
                        Spgrunnlag
                    </TabLink>
                    <TabLink to={pathForLocation(Location.Faresignaler)} title="Faresignaler">
                        Faresignaler
                    </TabLink>
                </TabList>
            )}
            <Verktøylinje />
        </Container>
    );
};
