import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Ikon from 'nav-frontend-ikoner-assets';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import './Periode.css';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import ListeItemBolk from '../../widgets/Bolk/ListeItemBolk';
import ListeSeparator from '../../widgets/ListeSeparator';

const Periode = withBehandlingContext(({ behandling }) => {
    const {
        antallKalenderdager,
        arbeidsgiverperiodeKalenderdager,
        antallVirkedager,
        antallFeriedager,
        antallDager,
        sykmeldingsgrad
    } = behandling.periode;

    return (
        <Panel className="Periode" border>
            <Undertittel className="panel-tittel">Sykepengeperiode</Undertittel>
            <ListeItemBolk
                label="Antall kalenderdager"
                value={antallKalenderdager}
            />
            <ListeItemBolk
                label="Arb.giverperiode, kalenderdager"
                value={arbeidsgiverperiodeKalenderdager}
            />
            <ListeSeparator type="dotted" />
            <ListeItemBolk label="Antall virkedager" value={antallVirkedager} />
            <ListeItemBolk
                label="Ferie"
                value={antallFeriedager ? antallFeriedager : '-'}
            />
            <ListeSeparator type="dotted" />
            <ListeItemBolk
                label="Antall dager"
                value={antallDager}
            />
            <ListeSeparator type="dotted" />
            <ListeItemBolk
                label="Sykmeldingsgrad"
                value={`${sykmeldingsgrad}%`}
            />
            <ListeSeparator />
            <Undertittel>Filter for MVP</Undertittel>
            <ListeItemBolk
                label="Ingen friskmelding"
                value={<Ikon kind="ok-sirkel-fyll" size={24} />}
            />
            <ListeItemBolk
                label="Ingen gradering"
                value={<Ikon kind="ok-sirkel-fyll" size={24} />}
            />
            <Navigasjonsknapper previous="/beregning" next="/utbetaling" />
        </Panel>
    );
});

export default Periode;
