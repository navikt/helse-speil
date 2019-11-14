import React, { useContext, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Oversiktslinje from './Oversiktslinje';
import OversiktsLenke from './OversiktsLenke';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Panel } from 'nav-frontend-paneler';
import { withRouter } from 'react-router';
import { toDateAndTime } from '../../utils/date';
import { oversikttekster } from '../../tekster';
import { TildelingerContext } from '../../context/TildelingerContext';
import { SaksoversiktContext } from '../../context/SaksoversiktContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import 'nav-frontend-lenker-style';
import './Oversikt.less';
import useLinks, { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';

const FETCH_TILDELINGER_INTERVAL_IN_MS = 120000;

const toBehandletBehov = behov => ({
    ...behov,
    søkerNavn: behov.personinfo?.navn ?? behov.aktørId,
    caseWorkerName: extractNameFromEmail('MANGLER BRUKERNAVN'),
    behandlet: true
});

const partition = predicate => (acc, cur) =>
    predicate(cur) ? [[...acc[0], cur], acc[1]] : [acc[0], [...acc[1], cur]];

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
    const { feedback } = useContext(InnrapporteringContext);
    const links = useLinks();
    const linksRef = useRef(links);
    useEffect(() => {
        linksRef.current = links;
    }, [links]);

    const [behandledeBehov, ubehandledeBehov] = useMemo(
        () =>
            saksoversikt
                .map(behov => (behov['@løsning'] ? toBehandletBehov(behov) : behov))
                .reduce(partition(b => b.behandlet), [[], []]),
        [feedback, saksoversikt]
    );

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
            if (person !== undefined) {
                setTimeout(() => history.push(linksRef.current[pages.SYKMELDINGSPERIODE]), 0);
            }
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
                        {ubehandledeBehov.map(behov => {
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
                <Panel border className="Oversikt__historikk">
                    <Undertittel className="panel-tittel">Siste behov</Undertittel>
                    <ul>
                        <li className="row" key="header">
                            <Normaltekst>Søker</Normaltekst>
                            <Normaltekst>Saksbehandler</Normaltekst>
                            <Normaltekst>Innsendt</Normaltekst>
                        </li>
                        {behandledeBehov.map(behov => (
                            <li className="row row--info" key={behov['@id']}>
                                <OversiktsLenke onClick={() => velgBehovAndNavigate(behov)}>
                                    {behov.søkerNavn}
                                </OversiktsLenke>
                                <Normaltekst>{capitalizeName(behov.caseWorkerName)}</Normaltekst>
                                <Normaltekst>{toDateAndTime(behov.submittedDate)}</Normaltekst>
                            </li>
                        ))}
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
