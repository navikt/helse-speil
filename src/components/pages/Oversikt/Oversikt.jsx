import React, { useContext, useEffect, useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import { BehandlingerContext } from '../../../context/BehandlingerContext';
import { oversikttekster } from '../../../tekster';
import { toDate, toDateAndTime } from '../../../utils/date';
import './Oversikt.less';
import { withRouter } from 'react-router';
import Lenke from 'nav-frontend-lenker';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import PropTypes from 'prop-types';
import { extractNameFromEmail } from '../../../utils/locale';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { deleteTildeling, getTildelinger, postTildeling } from '../../../io/http';
import { AuthContext } from '../../../context/AuthContext';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

const twoMinutesInMilliSec = 120000;
const Oversikt = ({ history }) => {
    const behandlingerCtx = useContext(BehandlingerContext);
    const innrapportering = useContext(InnrapporteringContext);
    const { authInfo } = useContext(AuthContext);
    const [behandletSaker, setBehandletSaker] = useState([]);
    const [ubehandletSaker, setUbehandletSaker] = useState([]);
    const [tildelinger, setTildelinger] = useState([]);
    const [error, setError] = useState(undefined);

    const { fetchBehandlingerMedPersoninfo, setValgtBehandling } = behandlingerCtx;
    const behandlinger = behandlingerCtx.state.behandlinger;

    useEffect(() => {
        fetchBehandlingerMedPersoninfo();
    }, []);

    useEffect(() => {
        fetchTildelinger();
        const interval = window.setInterval(fetchTildelinger, twoMinutesInMilliSec);
        return () => {
            window.clearInterval(interval);
        };
    }, [behandlinger.length]);

    const fetchTildelinger = () => {
        if (behandlinger.length > 0) {
            const behandlingsIdList = behandlinger.map(b => b.behandlingsId);
            getTildelinger(behandlingsIdList)
                .then(result => {
                    const nyeTildelinger = result.data.filter(
                        behandlingId => behandlingId.userId !== undefined
                    );
                    setTildelinger(nyeTildelinger);
                })
                .catch(err => {
                    setError('Kunne ikke hente tildelingsinformasjon.');
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        let behandlingerUtenFeedback = [];
        const sakerMedFeedback = behandlinger.reduce((acc, behandling) => {
            const feedback = innrapportering.feedback.find(f => f.key === behandling.behandlingsId);
            if (feedback) {
                const behandletSak = {
                    søkerName: behandling.personinfo.navn ?? behandling.originalSøknad.aktorId,
                    submittedDate: feedback.value.submittedDate,
                    behandlingsId: behandling.behandlingsId,
                    userName: extractNameFromEmail(feedback.value.userId.email)
                };
                acc = [...acc, behandletSak];
            } else {
                behandlingerUtenFeedback.push(behandling);
            }
            return acc;
        }, []);
        setBehandletSaker(sakerMedFeedback);
        setUbehandletSaker(behandlingerUtenFeedback);
    }, [innrapportering.feedback]);

    const velgBehandling = behandling => {
        setValgtBehandling(behandling);
        history.push('/sykdomsvilkår');
    };

    const tildelBehandling = behandlingsId => {
        postTildeling({ behandlingsId: behandlingsId, userId: authInfo.email })
            .then(response => {
                setTildelinger([
                    ...tildelinger,
                    { behandlingsId: behandlingsId, userId: authInfo.email }
                ]);
                setError(undefined);
            })
            .catch(() => {
                setError('Kunne ikke tildele sak.');
                console.log(error);
            });
    };

    const fjernTildeling = behandlingsId => {
        deleteTildeling(behandlingsId)
            .then(() => {
                setTildelinger(tildelinger.filter(t => t.behandlingsId !== behandlingsId));
                setError(undefined);
            })
            .catch(() => {
                setError('Kunne ikke fjerne tildeling av sak.');
                console.log(error);
            });
    };

    return (
        <div className="Oversikt">
            {error && <AlertStripeAdvarsel>{error}</AlertStripeAdvarsel>}
            <div className="Oversikt__container">
                <Panel border className="Oversikt__neste-behandlinger">
                    <Undertittel className="panel-tittel">{oversikttekster('tittel')}</Undertittel>
                    <ul>
                        <li className="row">
                            <Normaltekst>{oversikttekster('søker')}</Normaltekst>
                            <Normaltekst>{oversikttekster('periode')}</Normaltekst>
                            <Normaltekst>{oversikttekster('tildeling')}</Normaltekst>
                        </li>
                        {ubehandletSaker.map(behandling => {
                            const tildeling = tildelinger.find(
                                b => b.behandlingsId === behandling.behandlingsId
                            );
                            const tildelingsCelle = tildeling ? (
                                tildeling.userId === authInfo.email ? (
                                    <>
                                        <Normaltekst>
                                            {extractNameFromEmail(tildeling.userId)}
                                        </Normaltekst>
                                        <Flatknapp
                                            className="knapp--avmeld"
                                            onClick={() => fjernTildeling(behandling.behandlingsId)}
                                        >
                                            Meld av
                                        </Flatknapp>
                                    </>
                                ) : (
                                    <Normaltekst>
                                        {extractNameFromEmail(tildeling.userId)}
                                    </Normaltekst>
                                )
                            ) : (
                                <Knapp
                                    mini
                                    onClick={() => tildelBehandling(behandling.behandlingsId)}
                                >
                                    Tildel til meg
                                </Knapp>
                            );

                            return (
                                <li className="row row--info" key={behandling.behandlingsId}>
                                    <Lenke onClick={() => velgBehandling(behandling)}>
                                        {behandling.personinfo?.navn ??
                                            behandling.originalSøknad.aktorId}
                                    </Lenke>
                                    <Normaltekst>{`${toDate(
                                        behandling.originalSøknad.fom
                                    )} - ${toDate(behandling.originalSøknad.tom)}`}</Normaltekst>
                                    <span className="row__tildeling">{tildelingsCelle}</span>
                                </li>
                            );
                        })}
                    </ul>
                </Panel>
                <Panel border className="Oversikt__historikk">
                    <Undertittel className="panel-tittel">Siste behandlinger</Undertittel>
                    <ul>
                        <li className="row" key="header">
                            <Normaltekst>Søker</Normaltekst>
                            <Normaltekst>Saksbehandler</Normaltekst>
                            <Normaltekst>Innsendt</Normaltekst>
                        </li>
                        {behandletSaker.map(sak => (
                            <li className="row row--info" key={sak.behandlingsId}>
                                <Lenke onClick={() => velgBehandling(sak)}>{sak.søkerName}</Lenke>
                                <Normaltekst>{sak.userName}</Normaltekst>
                                <Normaltekst>{toDateAndTime(sak.submittedDate)}</Normaltekst>
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
        push: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(Oversikt);
