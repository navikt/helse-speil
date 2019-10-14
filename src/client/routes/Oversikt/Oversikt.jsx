import React, { useContext, useMemo } from 'react';
import Lenke from 'nav-frontend-lenker';
import PropTypes from 'prop-types';
import { Panel } from 'nav-frontend-paneler';
import { withRouter } from 'react-router';
import { oversikttekster } from '../../tekster';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { extractNameFromEmail } from '../../utils/locale';
import { toDate, toDateAndTime } from '../../utils/date';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './Oversikt.less';

const toBehandletSak = (behandling, feedback) => ({
    ...behandling,
    søkerName: behandling.personinfo?.navn ?? behandling.originalSøknad.aktorId,
    submittedDate: feedback.value.submittedDate,
    behandlingsId: behandling.behandlingsId,
    userName: extractNameFromEmail(feedback.value.userId.email)
});

const Oversikt = ({ history }) => {
    const { behandlingsoversikt, velgBehandlingFraOversikt } = useContext(BehandlingerContext);
    const { feedback } = useContext(InnrapporteringContext);

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

    const velgBehandlingAndNavigate = behandling => {
        velgBehandlingFraOversikt(behandling).then(() => history.push('/sykdomsvilkår'));
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
        push: PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(Oversikt);
