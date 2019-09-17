import React, { useEffect, useState } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { oversikttekster } from '../../../tekster';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { toDate } from '../../../utils/date';
import './Oversikt.less';
import { getPerson } from '../../../io/http';
import { withRouter } from 'react-router';
import Lenke from 'nav-frontend-lenker';

const Beregning = withBehandlingContext(
    ({ behandlinger, fetchAlleBehandlinger, setValgtBehandling, history }) => {
        const [behandlingerMedNavn, setBehandlingerMedNavn] = useState(behandlinger);

        useEffect(() => {
            fetchAlleBehandlinger();
        }, []);

        useEffect(() => {
            if (behandlinger.length > 0) {
                hentNavnForBehandlinger();
            }
        }, [behandlinger]);

        const hentNavnForBehandlinger = async () => {
            const mappedBehandlinger = await Promise.all(
                behandlinger.map(behandling => fetchPerson(behandling))
            );
            setBehandlingerMedNavn(mappedBehandlinger);
        };

        const fetchPerson = async behandling => {
            return await getPerson(behandling.originalSøknad.aktorId)
                .then(response => {
                    return {
                        behandlingsId: behandling.behandlingsId,
                        fom: behandling.originalSøknad.fom,
                        tom: behandling.originalSøknad.tom,
                        navn: response.data.navn
                    };
                })
                .catch(err => {
                    console.error('Feil ved henting av person.', err);
                    return {
                        behandlingsId: behandling.behandlingsId,
                        fom: behandling.originalSøknad.fom,
                        tom: behandling.originalSøknad.tom,
                        navn: behandling.originalSøknad.aktorId
                    };
                });
        };

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
                        {behandlingerMedNavn.map(behandling => (
                            <tr key={behandling.behandlingsId}>
                                <td>
                                    <Lenke onClick={() => velgBehandling(behandling)}>
                                        {behandling.navn}
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
