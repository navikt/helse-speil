import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Oversiktslinje from './Oversiktslinje';
import OversiktsLenke from './OversiktsLenke';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Panel } from 'nav-frontend-paneler';
import { withRouter } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { toDateAndTime } from '../../utils/date';
import { oversikttekster } from '../../tekster';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { PersonContext } from '../../context/PersonContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { deleteTildeling, getTildelinger, postTildeling } from '../../io/http';
import 'nav-frontend-lenker-style';
import './Oversikt.less';

const FETCH_TILDELINGER_INTERVAL_IN_MS = 120000;

const toBehandletSak = (behandling, feedback) => ({
    ...behandling,
    søkerName: behandling.personinfo?.navn ?? behandling.originalSøknad.aktorId,
    submittedDate: feedback.value.submittedDate,
    behandlingsId: behandling.behandlingsId,
    userName: extractNameFromEmail(feedback.value.userId.email),
    behandlet: true
});

const partition = predicate => (acc, cur) =>
    predicate(cur) ? [[...acc[0], cur], acc[1]] : [acc[0], [...acc[1], cur]];

const Oversikt = ({ history }) => {
    const {
        personoversikt,
        hentPersonoversikt,
        velgPersonFraOversikt,
        isFetchingPersonoversikt,
        isFetchingPersoninfo
    } = useContext(PersonContext);
    const { feedback } = useContext(InnrapporteringContext);
    const { authInfo } = useContext(AuthContext);
    const [tildelinger, setTildelinger] = useState([]);
    const [error, setError] = useState();

    const [behandledeSaker, ubehandledeSaker] = useMemo(
        () =>
            personoversikt
                .map(behandling => {
                    const behandlingFeedback = feedback.find(
                        f => f.key === behandling.behandlingsId
                    );
                    return behandlingFeedback
                        ? toBehandletSak(behandling, behandlingFeedback)
                        : behandling;
                })
                .reduce(partition(b => b.behandlet), [[], []]),
        [feedback, personoversikt]
    );

    useEffect(() => {
        hentPersonoversikt();
    }, []);

    useEffect(() => {
        fetchTildelinger();
        const interval = window.setInterval(fetchTildelinger, FETCH_TILDELINGER_INTERVAL_IN_MS);
        return () => {
            window.clearInterval(interval);
        };
    }, [personoversikt.length]);

    const fetchTildelinger = () => {
        if (personoversikt.length > 0) {
            const behandlingsIdList = personoversikt.map(b => b.behandlingsId);
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
        velgPersonFraOversikt(behandling).then(() => history.push('/sykdomsvilkår'));
    };

    return (
        <div className="Oversikt">
            {error && <AlertStripeAdvarsel>{error}</AlertStripeAdvarsel>}
            <div className="Oversikt__container">
                <Panel border className="Oversikt__neste-behandlinger">
                    <Undertittel className="panel-tittel">{oversikttekster('tittel')}</Undertittel>
                    {isFetchingPersonoversikt && (
                        <AlertStripeInfo>
                            Henter behandlinger <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
                    {isFetchingPersoninfo && (
                        <AlertStripeInfo>
                            Henter navn for behandlinger <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
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
