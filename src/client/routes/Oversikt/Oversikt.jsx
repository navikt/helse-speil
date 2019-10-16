import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Oversiktslinje from './Oversiktslinje';
import OversiktsLenke from './OversiktsLenke';
import { Panel } from 'nav-frontend-paneler';
import { withRouter } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { toDateAndTime } from '../../utils/date';
import { oversikttekster } from '../../tekster';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { deleteTildeling, getTildelinger, postTildeling } from '../../io/http';
import './Oversikt.less';

const toBehandletSak = (behandling, feedback) => ({
    ...behandling,
    søkerName: behandling.personinfo?.navn ?? behandling.originalSøknad.aktorId,
    submittedDate: feedback.value.submittedDate,
    behandlingsId: behandling.behandlingsId,
    userName: extractNameFromEmail(feedback.value.userId.email)
});

const FETCH_TILDELINGER_INTERVAL_IN_MS = 120000;

const Oversikt = ({ history }) => {
    const { behandlingsoversikt, velgBehandlingFraOversikt } = useContext(BehandlingerContext);
    const { feedback } = useContext(InnrapporteringContext);
    const { authInfo } = useContext(AuthContext);
    const [tildelinger, setTildelinger] = useState([]);
    const [error, setError] = useState();

    const [behandledeSaker, ubehandledeSaker] = useMemo(
        () =>
            behandlingsoversikt.reduce(
                (partitioned, behandling) => {
                    const feedbackForBehandling = feedback.find(
                        f => f.key === behandling.behandlingsId
                    );
                    return feedbackForBehandling
                        ? [
                              [
                                  ...partitioned[0],
                                  toBehandletSak(behandling, feedbackForBehandling)
                              ],
                              partitioned[1]
                          ]
                        : [partitioned[0], [...partitioned[1], behandling]];
                },
                [[], []]
            ),
        [feedback, behandlingsoversikt]
    );

    useEffect(() => {
        fetchTildelinger();
        const interval = window.setInterval(fetchTildelinger, FETCH_TILDELINGER_INTERVAL_IN_MS);
        return () => {
            window.clearInterval(interval);
        };
    }, [behandlingsoversikt.length]);

    const fetchTildelinger = () => {
        if (behandlingsoversikt.length > 0) {
            const behandlingsIdList = behandlingsoversikt.map(b => b.behandlingsId);
            getTildelinger(behandlingsIdList)
                .then(result => {
                    const nyeTildelinger = result.data.filter(
                        behandlingId => behandlingId.userId !== undefined
                    );
                    setTildelinger(nyeTildelinger);
                })
                .catch(err => {
                    setError('Kunne ikke hente tildelingsinformasjon.');
                    console.error(err);
                });
        }
    };

    const tildelBehandling = behandlingsId => {
        const userId = authInfo.email;
        postTildeling({ behandlingsId, userId })
            .then(() => {
                setTildelinger([...tildelinger, { behandlingsId, userId }]);
                setError(undefined);
            })
            .catch(error => {
                const assignedUser = error.message?.alreadyAssignedTo;
                if (assignedUser) {
                    setError(`Saken er allerede tildelt til ${assignedUser}`);
                } else {
                    setError('Kunne ikke tildele sak.');
                }
            });
    };

    const fjernTildeling = behandlingsId => {
        deleteTildeling(behandlingsId)
            .then(() => {
                setTildelinger(tildelinger.filter(t => t.behandlingsId !== behandlingsId));
                setError(undefined);
            })
            .catch(error => {
                setError('Kunne ikke fjerne tildeling av sak.');
                console.error(error);
            });
    };

    const velgBehandlingAndNavigate = behandling => {
        velgBehandlingFraOversikt(behandling).then(() => history.push('/sykdomsvilkår'));
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
                        {ubehandledeSaker.map(behandling => {
                            const tildeling = tildelinger.find(
                                b => b.behandlingsId === behandling.behandlingsId
                            );
                            return (
                                <Oversiktslinje
                                    behandling={behandling}
                                    tildeling={tildeling}
                                    onAssignCase={tildelBehandling}
                                    onUnassignCase={fjernTildeling}
                                    onSelectCase={velgBehandlingAndNavigate}
                                    key={behandling.behandlingsId}
                                />
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
                        {behandledeSaker.map(sak => (
                            <li className="row row--info" key={sak.behandlingsId}>
                                <OversiktsLenke onClick={() => velgBehandlingAndNavigate(sak)}>
                                    {sak.søkerName}
                                </OversiktsLenke>
                                <Normaltekst>{capitalizeName(sak.userName)}</Normaltekst>
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
        push: PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(Oversikt);
