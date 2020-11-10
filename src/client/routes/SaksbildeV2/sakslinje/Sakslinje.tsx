import React from 'react';
import styled from '@emotion/styled';
import { Periodetype as PeriodetypeTittel } from 'internal-types';
import { Periodetype } from './Periodetype';
import { Verktøylinje } from './Verktøylinje';
import { TabLink } from '../TabLink';
import { Flex } from '../../../components/Flex';
import { useRouteMatch } from 'react-router-dom';

const SakslinjeWrapper = styled.div`
    height: 90px;
    border-bottom: 1px solid #c6c2bf;
    display: flex;
    flex: 1;
    padding: 0 2rem;
`;

const SakslinjeVenstre = styled(Flex)`
    width: 18rem;
    padding-right: 1rem;
    margin-right: 2.5rem;
    align-items: center;
    border-right: 1px solid #c6c2bf;
`;

interface SakslinjeProps {
    aktivVedtaksperiodetype: PeriodetypeTittel;
}

export const Sakslinje = ({ aktivVedtaksperiodetype }: SakslinjeProps) => {
    const { url } = useRouteMatch();

    return (
        <SakslinjeWrapper>
            <SakslinjeVenstre>
                <Periodetype tittel={aktivVedtaksperiodetype} />
                <Verktøylinje />
            </SakslinjeVenstre>
            <TabLink to={`${url}/utbetaling`}>Utbetaling</TabLink>
            <TabLink to={`${url}/sykmeldingsperiode`}>Sykmeldingsperiode</TabLink>
            <TabLink to={`${url}/vilkår`}>Vilkår</TabLink>
            <TabLink to={`${url}/sykepengegrunnlag`}>Sykepengegrunnlag</TabLink>
        </SakslinjeWrapper>
    );
};
