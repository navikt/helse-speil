import React from 'react';
import styled from '@emotion/styled';
import { Periodetype as PeriodetypeTittel } from 'internal-types';
import { Periodetype } from './Periodetype';
import { Verktøylinje } from './Verktøylinje';
import { TabLink } from '../TabLink';
import { Flex } from '../../../components/Flex';
import { Location, useNavigation } from '../../../hooks/useNavigationV2';
import { Key, useKeyboard } from '../../../hooks/useKeyboard';
import { Infolinje } from './Infolinje';

const SakslinjeWrapper = styled.div`
    height: 90px;
    border-bottom: 1px solid #c6c2bf;
    display: flex;
    flex: 1;
    padding: 0 2.5rem 0 2rem;
`;

const SakslinjeVenstre = styled(Flex)`
    flex-shrink: 0;
    width: 18rem;
    padding-right: 1.5rem;
    margin-right: 2.5rem;
    align-items: center;
    border-right: 1px solid #c6c2bf;
`;

interface SakslinjeProps {
    aktivVedtaksperiodetype: PeriodetypeTittel;
}

export const Sakslinje = ({ aktivVedtaksperiodetype }: SakslinjeProps) => {
    const { pathForLocation, navigateToNext, navigateToPrevious } = useNavigation();

    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true },
    });

    return (
        <SakslinjeWrapper>
            <SakslinjeVenstre>
                <Periodetype tittel={aktivVedtaksperiodetype} />
                <Verktøylinje />
            </SakslinjeVenstre>
            <TabLink to={pathForLocation(Location.Utbetaling)}>Utbetaling</TabLink>
            <TabLink to={pathForLocation(Location.Sykmeldingsperiode)}>Sykmeldingsperiode</TabLink>
            <TabLink to={pathForLocation(Location.Vilkår)}>Vilkår</TabLink>
            <TabLink to={pathForLocation(Location.Sykepengegrunnlag)}>Sykepengegrunnlag</TabLink>
            <Infolinje />
        </SakslinjeWrapper>
    );
};
