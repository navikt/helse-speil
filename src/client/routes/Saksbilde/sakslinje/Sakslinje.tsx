import React from 'react';
import styled from '@emotion/styled';
import { Verktøylinje } from './Verktøylinje';
import { TabLink } from '../TabLink';
import { Location, useNavigation } from '../../../hooks/useNavigation';
import { Key, useKeyboard } from '../../../hooks/useKeyboard';
import { Infolinje } from './Infolinje';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';

const Container = styled.div`
    height: 74px;
    border-bottom: 1px solid #c6c2bf;
    display: flex;
    flex: 1;
    padding: 0 2.5rem 0 2rem;
`;

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
            <TabLink hjemIkon disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Utbetaling)}>
                Utbetaling
            </TabLink>
            <TabLink disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Sykmeldingsperiode)}>
                Smperiode
            </TabLink>
            <TabLink disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Vilkår)}>
                Vilkår
            </TabLink>
            <TabLink disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Sykepengegrunnlag)}>
                Spgrunnlag
            </TabLink>
            <Verktøylinje />
            <Infolinje vedtaksperiode={aktivVedtaksperiode} />
        </Container>
    );
};
