import React from 'react';
import Link from './Link';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './Nav.less';

const Nav = ({ active }) => {
    return (
        <nav className={`Nav ${active ? '' : 'inactive'}`}>
            <Link id="nav-link-sykmeldingsperiode" to="/sykmeldingsperiode" active={active}>
                <Normaltekst>Sykmeldingsperiode</Normaltekst>
            </Link>
            <Link id="nav-link-sykdomsvilkår" to="/sykdomsvilkår" active={active}>
                <Normaltekst>Sykdomsvilkår</Normaltekst>
            </Link>
            <Link id="nav-link-inngangsvilkår" to="/inngangsvilkår" active={active}>
                <Normaltekst>Inngangsvilkår</Normaltekst>
            </Link>
            <Link id="nav-link-beregning" to="/beregning" active={active}>
                <Normaltekst>Sykepengegrunnlag</Normaltekst>
            </Link>
            <Link id="nav-link-periode" to="/periode" active={active}>
                <Normaltekst>Sykepengeperiode</Normaltekst>
            </Link>
            <Link id="nav-link-utbetaling" to="/utbetaling" active={active}>
                <Normaltekst>Utbetaling</Normaltekst>
            </Link>
            <Link id="nav-link-oppsummering" to="/oppsummering" active={active}>
                <Normaltekst>Oppsummering</Normaltekst>
            </Link>
        </nav>
    );
};

Nav.propTypes = {
    active: PropTypes.bool
};

export default Nav;
