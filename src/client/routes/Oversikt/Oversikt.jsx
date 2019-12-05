import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Oversiktslinje from './Oversiktslinje';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Panel } from 'nav-frontend-paneler';
import { withRouter } from 'react-router';
import { oversikttekster } from '../../tekster';
import { TildelingerContext } from '../../context/TildelingerContext';
import { SaksoversiktContext } from '../../context/SaksoversiktContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import 'nav-frontend-lenker-style';
import './Oversikt.less';
import { buildLinks, pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';

const FETCH_TILDELINGER_INTERVAL_IN_MS = 120000;

const Oversikt = ({ history }) => {
    const { hentPerson } = useContext(PersonContext);
    const {
        saksoversikt,
        hentSaksoversikt,
        isFetchingSaksoversikt,
        isFetchingPersoninfo
    } = useContext(SaksoversiktContext);
    const {
        tildelBehandling,
        tildelinger,
        tildelingError,
        fetchTildelinger,
        fjernTildeling
    } = useContext(TildelingerContext);

    useEffect(() => {
        hentSaksoversikt();
    }, []);

    useEffect(() => {
        fetchTildelinger(saksoversikt);
        const id = window.setInterval(
            () => fetchTildelinger(saksoversikt),
            FETCH_TILDELINGER_INTERVAL_IN_MS
        );
        return () => window.clearInterval(id);
    }, [saksoversikt.length]);

    const velgBehovAndNavigate = behov => {
        hentPerson(behov.aktørId).then(person => {
            history.push(buildLinks(person)[pages.SYKMELDINGSPERIODE]);
        });
    };

    return (
        <div className="Oversikt">
            {tildelingError && <AlertStripeAdvarsel>{tildelingError}</AlertStripeAdvarsel>}
            <div className="Oversikt__container">
                <Panel border className="Oversikt__neste-behandlinger">
                    <Undertittel className="panel-tittel">{oversikttekster('tittel')}</Undertittel>
                    {isFetchingSaksoversikt && (
                        <AlertStripeInfo>
                            Henter personer <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
                    {isFetchingPersoninfo && (
                        <AlertStripeInfo>
                            Henter navn <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
                    <ul>
                        <li className="row">
                            <Normaltekst>{oversikttekster('søker')}</Normaltekst>
                            <Normaltekst>{oversikttekster('tidspunkt')}</Normaltekst>
                            <Normaltekst>{oversikttekster('tildeling')}</Normaltekst>
                        </li>
                        {saksoversikt.map(behov => {
                            const tildeling = tildelinger.find(b => b.behovId === behov['@id']);
                            return (
                                <Oversiktslinje
                                    behov={behov}
                                    tildeling={tildeling}
                                    onAssignCase={tildelBehandling}
                                    onUnassignCase={fjernTildeling}
                                    onSelectCase={velgBehovAndNavigate}
                                    key={behov['@id']}
                                />
                            );
                        })}
                    </ul>
                </Panel>
            </div>
        </div>
    );
};

Oversikt.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(Oversikt);
