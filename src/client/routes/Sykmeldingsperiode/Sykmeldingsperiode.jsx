import React, { useContext } from 'react';
import IconRow from '../../components/Rows/IconRow';
import Timeline from '../../components/Timeline';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { sykmeldingsperiodetekster } from '../../tekster';
import './Sykmeldingsperiode.less';
import { BehandlingerContext } from '../../context/BehandlingerContext';

const Sykmeldingsperiode = () => {
    const { personTilBehandling: person } = useContext(BehandlingerContext);
    return (
        <Panel className="Sykmeldingsperiode">
            <Undertittel className="panel-tittel">Sykmeldingsperiode</Undertittel>
            {person.arbeidsgivere ? (
                <>
                    <IconRow label={sykmeldingsperiodetekster('dager')} bold />
                    <Timeline person={person} />
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
            <Navigasjonsknapper next="/sykdomsvilkår" />
        </Panel>
    );
};

export default Sykmeldingsperiode;
