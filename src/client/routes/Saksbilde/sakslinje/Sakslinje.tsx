import React from 'react';
import styled from '@emotion/styled';
import { Periodelabel } from './Periodelabel';
import { Verktøylinje } from './Verktøylinje';
import { TabLink } from '../TabLink';
import { Flex } from '../../../components/Flex';
import { Location, useNavigation } from '../../../hooks/useNavigation';
import { Key, useKeyboard } from '../../../hooks/useKeyboard';
import { Infolinje } from './Infolinje';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { Vedtaksperiode } from 'internal-types';

const Container = styled.div`
    height: 74px;
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

export const LasterSakslinje = () => (
    <Container>
        <SakslinjeVenstre></SakslinjeVenstre>
    </Container>
);

export const Sakslinje = () => {
    const { pathForLocation, navigateToNext, navigateToPrevious } = useNavigation();
    const aktivVedtaksperiode = useAktivVedtaksperiode();

    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true },
    });

    return (
        <Container>
            <SakslinjeVenstre>
                <Periodelabel periodetype={aktivVedtaksperiode?.periodetype} />
                <Verktøylinje />
            </SakslinjeVenstre>
            <TabLink hjemIkon disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Utbetaling)}>
                Utbetaling
            </TabLink>
            <TabLink disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Sykmeldingsperiode)}>
                Sykmeldingsperiode
            </TabLink>
            <TabLink disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Vilkår)}>
                Vilkår
            </TabLink>
            <TabLink disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Sykepengegrunnlag)}>
                Sykepengegrunnlag
            </TabLink>
            <Infolinje />
        </Container>
    );
};
