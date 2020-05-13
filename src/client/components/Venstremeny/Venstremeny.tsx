import React, { useContext } from 'react';
import Link from './Link';
import styled from '@emotion/styled';
import { PersonContext } from '../../context/PersonContext';
import { Location, useNavigation } from '../../hooks/useNavigation';
import { ForlengelseFraInfotrygd } from '../../context/types';

interface Props {
    active?: boolean;
}

const Lenke = styled(Link)`
    text-decoration: none;
    padding: 0.5rem 3rem 0.5rem 2rem;
    color: #3e3832;

    &:hover,
    &.active {
        background: #e7e9e9;
    }

    &.active {
        box-shadow: inset 0.35rem 0 0 0 #0067c5;
    }

    &:focus {
        box-shadow: 0 0 0 3px #254b6d;
        outline: none;
    }

    &:focus {
        z-index: 1000;
    }

    &.inactive {
        color: #b5b5b5;
    }
`;

const Nav = styled.nav`
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #fff;
    padding: 2rem 0;

    ${(props: Props) =>
        !props.active &&
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
const Venstremeny = () => {
    const { pathForLocation } = useNavigation();
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const active = aktivVedtaksperiode !== undefined;
    const erForlengelseFraInfotrygd = aktivVedtaksperiode?.forlengelseFraInfotrygd === ForlengelseFraInfotrygd.JA;

    return (
        <Container>
            <Nav active={aktivVedtaksperiode !== undefined}>
                <Lenke
                    id="nav-link-sykmeldingsperiode"
                    to={pathForLocation(Location.Sykmeldingsperiode)}
                    active={active}
                >
                    Sykmeldingsperiode
                </Lenke>
                <Lenke id="nav-link-vilkår" to={pathForLocation(Location.Vilkår)} active={active}>
                    Vilkår
                </Lenke>
                <Lenke
                    id="nav-link-inntektskilder"
                    to={pathForLocation(Location.Inntektskilder)}
                    active={!erForlengelseFraInfotrygd}
                >
                    Inntektskilder
                </Lenke>
                <Lenke id="nav-link-sykepengegrunnlag" to={pathForLocation(Location.Sykepengegrunnlag)} active={active}>
                    Sykepengegrunnlag
                </Lenke>
                <Lenke id="nav-link-fordeling" active={false}>
                    Fordeling
                </Lenke>
                <Lenke id="nav-link-utbetaling" to={pathForLocation(Location.Utbetalingsoversikt)} active={active}>
                    Utbetalingsoversikt
                </Lenke>
                <Lenke id="nav-link-oppsummering" to={pathForLocation(Location.Oppsummering)} active={active}>
                    Oppsummering
                </Lenke>
            </Nav>
        </Container>
    );
};

export default Venstremeny;
