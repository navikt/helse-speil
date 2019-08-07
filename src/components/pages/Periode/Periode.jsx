import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Ikon from 'nav-frontend-ikoner-assets';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import ListeItemBolk from '../../widgets/Bolk/ListeItemBolk';
import ListeSeparator from '../../widgets/ListeSeparator';
import './Periode.css';
import { periodetekster, tekster } from '../../../tekster';

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
            <Undertittel className="panel-tittel">
                {periodetekster('tittel')}
            </Undertittel>
            <ListeItemBolk
                label={periodetekster('kalenderdager')}
                value={antallKalenderdager}
            />
            <ListeItemBolk
                label={periodetekster('arbeidsgiverperiode')}
                value={arbeidsgiverperiodeKalenderdager}
            />
            <ListeSeparator type="dotted" />
            <ListeItemBolk
                label={periodetekster('virkedager')}
                value={antallVirkedager}
            />
            <ListeItemBolk
                label={periodetekster('ferie')}
                value={antallFeriedager ? antallFeriedager : '-'}
            />
            <ListeSeparator type="dotted" />
            <ListeItemBolk
                label={periodetekster('dager')}
                value={antallDager}
            />
            <ListeSeparator type="dotted" />
            <ListeItemBolk
                label={periodetekster('sykmeldingsgrad')}
                value={`${sykmeldingsgrad}%`}
            />
            <ListeSeparator />
            <Undertittel>{tekster('mvp')}</Undertittel>
            <ListeItemBolk
                label={periodetekster('friskmelding')}
                value={<Ikon kind="ok-sirkel-fyll" size={24} />}
            />
            <ListeItemBolk
                label={periodetekster('gradering')}
                value={<Ikon kind="ok-sirkel-fyll" size={24} />}
            />
            <Navigasjonsknapper previous="/beregning" next="/utbetaling" />
        </Panel>
    );
});

export default Periode;
