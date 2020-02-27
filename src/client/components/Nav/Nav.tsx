import React, {useContext} from 'react';
import useLinks, {pages} from '../../hooks/useLinks';
import Link from './Link';
import styled from '@emotion/styled';
import {PersonContext} from "../../context/PersonContext";

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

const StyledNav = styled.nav`
    display: flex;
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

const Nav = () => {
    const links = useLinks();
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const active = aktivVedtaksperiode !== undefined;

    return (
        <StyledNav active={aktivVedtaksperiode !== undefined}>
            <Lenke
                id="nav-link-sykmeldingsperiode"
                to={links?.[pages.SYKMELDINGSPERIODE]}
                active={active}
            >
                Sykmeldingsperiode
            </Lenke>
            <Lenke id="nav-link-inngangsvilkår" to={links?.[pages.INNGANGSVILKÅR]} active={active}>
                Inngangsvilkår
            </Lenke>
            <Lenke active={false} id="nav-link-oppfølging">
                Oppfølging
            </Lenke>
            <Lenke id="nav-link-inntektskilder" to={links?.[pages.INNTEKTSKILDER]} active={active}>
                Inntektskilder
            </Lenke>
            <Lenke
                id="nav-link-sykepengegrunnlag"
                to={links?.[pages.SYKEPENGEGRUNNLAG]}
                active={active}
            >
                Sykepengegrunnlag
            </Lenke>
            <Lenke id="nav-link-fordeling" to={links?.[pages.FORDELING]} active={false}>
                Fordeling
            </Lenke>
            <Lenke id="nav-link-utbetaling" to={links?.[pages.UTBETALINGSOVERSIKT]} active={active}>
                Utbetalingsoversikt
            </Lenke>
            <Lenke id="nav-link-oppsummering" to={links?.[pages.OPPSUMMERING]} active={active}>
                Oppsummering
            </Lenke>
        </StyledNav>
    );
};

export default Nav;
