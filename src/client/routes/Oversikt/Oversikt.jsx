import React, { useContext, useEffect, useMemo } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import { withRouter } from 'react-router';
import Lenke from 'nav-frontend-lenker';
import PropTypes from 'prop-types';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import { extractNameFromEmail } from '../../utils/locale';
import { oversikttekster } from '../../tekster';
import { toDate, toDateAndTime } from '../../utils/date';
import './Oversikt.less';

const Oversikt = ({ history }) => {
    const behandlingerCtx = useContext(BehandlingerContext);
    const innrapportering = useContext(InnrapporteringContext);

    const {
        behandlingsoversikt,
        fetchBehandlingsoversiktMedPersoninfo,
        velgBehandlingFraOversikt
    } = behandlingerCtx;

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

    const velgBehandlingAndNavigate = async behandling => {
        await velgBehandlingFraOversikt(behandling)
            .then(() => {
                history.push('/sykdomsvilkår');
            })
            .catch(() => {
                // Catch rejection to avoid warning; expecting error handling to have been done
            });
    };

    return (
        <div className="Oversikt">
            <Panel border className="Oversikt__list">
                <Undertittel className="panel-tittel">{oversikttekster('tittel')}</Undertittel>

                <table className="tabell">
                    <thead>
                        <tr>
                            <th>{oversikttekster('søker')}</th>
                            <th>{oversikttekster('periode')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ubehandledeSaker.map(behandling => (
                            <tr key={behandling.behandlingsId}>
                                <td>
                                    <Lenke onClick={() => velgBehandlingAndNavigate(behandling)}>
                                        {behandling.personinfo?.navn ??
                                            behandling.originalSøknad.aktorId}
                                    </Lenke>
                                </td>
                                <td>{`${toDate(behandling.originalSøknad.fom)} - ${toDate(
                                    behandling.originalSøknad.tom
                                )}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                            <Normaltekst>{sak.userName}</Normaltekst>
                            <Normaltekst>{toDateAndTime(sak.submittedDate)}</Normaltekst>
                        </li>
                    ))}
                </ul>
            </Panel>
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
