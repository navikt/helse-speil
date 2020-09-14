import React from 'react';
import styled from '@emotion/styled';
import { Location, useNavigation } from '../../hooks/useNavigation';
import { Vedtaksperiode } from 'internal-types';
import { AktivLenke, InaktivLenke } from './lenker';

const Nav = styled.nav<{ active?: boolean }>`
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #fff;
    padding: 2rem 0;

    ${({ active }) =>
        !active &&
        `
            box-shadow: none;
            background: none;
    `};
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    border-right: 1px solid #c6c2bf;
    width: 250px;
`;

const AktivNav = () => {
    const { pathForLocation } = useNavigation();
    return (
        <Container>
            <Nav>
                <AktivLenke id="nav-link-sykmeldingsperiode" to={pathForLocation(Location.Sykmeldingsperiode)}>
                    Sykmeldingsperiode
                </AktivLenke>
                <AktivLenke id="nav-link-vilkår" to={pathForLocation(Location.Vilkår)}>
                    Vilkår
                </AktivLenke>
                <AktivLenke id="nav-link-inntektskilder" to={pathForLocation(Location.Inntektskilder)}>
                    Inntektskilder
                </AktivLenke>
                <AktivLenke id="nav-link-sykepengegrunnlag" to={pathForLocation(Location.Sykepengegrunnlag)}>
                    Sykepengegrunnlag
                </AktivLenke>
                <InaktivLenke id="nav-link-fordeling">Fordeling</InaktivLenke>
                <AktivLenke id="nav-link-utbetaling" to={pathForLocation(Location.Utbetalingsoversikt)}>
                    Utbetalingsoversikt
                </AktivLenke>
                <AktivLenke id="nav-link-oppsummering" to={pathForLocation(Location.Oppsummering)}>
                    Oppsummering
                </AktivLenke>
            </Nav>
        </Container>
    );
};

const InaktivNav = () => (
    <Container>
        <Nav active={false}>
            <InaktivLenke id="nav-link-sykmeldingsperiode">Sykmeldingsperiode</InaktivLenke>
            <InaktivLenke id="nav-link-vilkår">Vilkår</InaktivLenke>
            <InaktivLenke id="nav-link-inntektskilder">Inntektskilder</InaktivLenke>
            <InaktivLenke id="nav-link-sykepengegrunnlag">Sykepengegrunnlag</InaktivLenke>
            <InaktivLenke id="nav-link-fordeling">Fordeling</InaktivLenke>
            <InaktivLenke id="nav-link-utbetaling">Utbetalingsoversikt</InaktivLenke>
            <InaktivLenke id="nav-link-oppsummering">Oppsummering</InaktivLenke>
        </Nav>
    </Container>
);

type VedtaksperiodeProp = { vedtaksperiode: Vedtaksperiode };

export const Venstremeny = ({ vedtaksperiode }: Partial<VedtaksperiodeProp>) =>
    vedtaksperiode ? <AktivNav /> : <InaktivNav />;
