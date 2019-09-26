import React, { useEffect } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import './Oversikt.less';
import { withRouter } from 'react-router';
import Lenke from 'nav-frontend-lenker';
import { withBehandlingContext } from '../../context/BehandlingerContext';
import { oversikttekster } from '../../tekster';
import { toDate } from '../../utils/date';

const Beregning = withBehandlingContext(
    ({ behandlinger, fetchAlleBehandlinger, setValgtBehandling, history }) => {
        useEffect(() => {
            fetchAlleBehandlinger();
        }, []);

        const velgBehandling = behandling => {
            setValgtBehandling(behandling);
            history.push('/sykdomsvilkår');
        };

        return (
            <Panel border className="Oversikt">
                <Undertittel className="panel-tittel">{oversikttekster('tittel')}</Undertittel>

                <table className="tabell">
                    <thead>
                        <tr>
                            <th>{oversikttekster('søker')}</th>
                            <th>{oversikttekster('periode')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {behandlinger.map(behandling => (
                            <tr key={behandling.behandlingsId}>
                                <td>
                                    <Lenke onClick={() => velgBehandling(behandling)}>
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
        );
    }
);

export default withRouter(Beregning);
