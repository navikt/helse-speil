import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import { withRouter } from 'react-router';
import Lenke from 'nav-frontend-lenker';
import PropTypes from 'prop-types';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import { oversikttekster } from '../../tekster';
import { toDateAndTime } from '../../utils/date';
import './Oversikt.less';
import Oversiktslinje from './Oversiktslinje';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { AuthContext } from '../../context/AuthContext';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { deleteTildeling, getTildelinger, postTildeling } from '../../io/http';

const fetchTildelingerInterval = 120000;
const Oversikt = ({ history }) => {
    const {
        behandlingsoversikt,
        fetchBehandlingsoversiktMedPersoninfo,
        velgBehandlingFraOversikt
    } = useContext(BehandlingerContext);
    const innrapportering = useContext(InnrapporteringContext);
    const { authInfo } = useContext(AuthContext);
    const [tildelinger, setTildelinger] = useState([]);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        fetchBehandlingsoversiktMedPersoninfo();
    }, []);

    const toBehandletSak = (behandling, feedback) => ({
        søkerName: behandling.personinfo?.navn ?? behandling.originalSøknad.aktorId,
        submittedDate: feedback.value.submittedDate,
        behandlingsId: behandling.behandlingsId,
        userName: extractNameFromEmail(feedback.value.userId.email)
    });

    const [behandledeSaker, ubehandledeSaker] = useMemo(
        () =>
            behandlingsoversikt.reduce(
                ([behandledeSaker, ubehandledeSaker], behandling) => {
                    const feedback = innrapportering.feedback.find(
                        f => f.key === behandling.behandlingsId
                    );
                    return feedback
                        ? [
                              [...behandledeSaker, toBehandletSak(behandling, feedback)],
                              ubehandledeSaker
                          ]
                        : [behandledeSaker, [...ubehandledeSaker, behandling]];
                },
                [[], []]
            ),
        [innrapportering.feedback, behandlingsoversikt]
    );

    useEffect(() => {
        fetchTildelinger();
        const interval = window.setInterval(fetchTildelinger, fetchTildelingerInterval);
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
                    console.log(err);
                });
        }
    };

    const velgBehandlingAndNavigate = async behandling => {
        await velgBehandlingFraOversikt(behandling)
            .then(() => {
                history.push('/sykdomsvilkår');
            })
            .catch(() => {
                // Catch rejection to avoid warning; expecting error handling to have been done
            });
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
                                <Lenke onClick={() => velgBehandlingAndNavigate(sak)}>
                                    {sak.søkerName}
                                </Lenke>
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
        push: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(Oversikt);
