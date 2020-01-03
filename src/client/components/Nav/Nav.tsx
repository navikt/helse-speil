import React from 'react';
import useLinks, { pages } from '../../hooks/useLinks';
import Link from './Link';
import { Normaltekst } from 'nav-frontend-typografi';
import './Nav.less';

interface Props {
    active?: boolean;
}

const Nav = ({ active }: Props) => {
    const links = useLinks();
    return (
        <nav className={`Nav ${active ? '' : 'inactive'}`}>
            <Link
                id="nav-link-sykmeldingsperiode"
                to={links?.[pages.SYKMELDINGSPERIODE]}
                active={active}
            >
                <Normaltekst>Sykmeldingsperiode</Normaltekst>
            </Link>
            <Link id="nav-link-sykdomsvilkår" to={links?.[pages.SYKDOMSVILKÅR]} active={active}>
                <Normaltekst>Sykdomsvilkår</Normaltekst>
            </Link>
            <Link id="nav-link-inngangsvilkår" to={links?.[pages.INNGANGSVILKÅR]} active={active}>
                <Normaltekst>Inngangsvilkår</Normaltekst>
            </Link>
            <Link id="nav-link-inntektskilder" to={links?.[pages.INNTEKTSKILDER]} active={active}>
                <Normaltekst>Inntektskilder</Normaltekst>
            </Link>
            <Link
                id="nav-link-sykepengegrunnlag"
                to={links?.[pages.SYKEPENGEGRUNNLAG]}
                active={active}
            >
                <Normaltekst>Sykepengegrunnlag</Normaltekst>
            </Link>
            <Link id="nav-link-fordeling" to={links?.[pages.FORDELING]} active={false}>
                <Normaltekst>Fordeling</Normaltekst>
            </Link>
            <Link id="nav-link-utbetaling" to={links?.[pages.UTBETALINGSOVERSIKT]} active={active}>
                <Normaltekst>Utbetalingsoversikt</Normaltekst>
            </Link>
            <Link id="nav-link-oppsummering" to={links?.[pages.OPPSUMMERING]} active={active}>
                <Normaltekst>Oppsummering</Normaltekst>
            </Link>
        </nav>
    );
};

export default Nav;
