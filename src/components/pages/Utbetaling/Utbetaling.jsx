import React from 'react';
import Ikon from 'nav-frontend-ikoner-assets';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import './Utbetaling.css';
import ListeItemBolk from '../../widgets/Bolk/ListeItemBolk';
import ListeSeparator from '../../widgets/ListeSeparator';
import ListeItem from '../../widgets/ListeItem';
import { toKronerOgØre } from '../../../utils/locale';
import { tekster, utbetalingstekster } from '../../../tekster';

const Utbetaling = withBehandlingContext(({ behandling }) => {
    const {
        antallDager,
        betalerArbeidsgiverperiode,
        dagsats,
        refusjonTilArbeidsgiver,
        sykepengegrunnlag,
        sykmeldingsgrad
    } = behandling.utbetaling;
    return (
        <Panel className="Utbetaling" border>
            <Undertittel className="panel-tittel">
                {utbetalingstekster('tittel')}
            </Undertittel>
            <ListeItemBolk
                label={utbetalingstekster('refusjon')}
                value={refusjonTilArbeidsgiver ? 'Ja' : 'Nei'}
            />
            <ListeItemBolk
                label={utbetalingstekster('betaler')}
                value={betalerArbeidsgiverperiode ? 'Ja' : 'Nei'}
            />

            <ListeSeparator type="dotted" />

            <ListeItem
                label={utbetalingstekster('sykepengegrunnlag')}
                value={toKronerOgØre(sykepengegrunnlag)}
            />
            <ListeItem
                label={utbetalingstekster('dagsats')}
                value={toKronerOgØre(dagsats)}
            />

            <ListeSeparator type="dotted" />

            <ListeItem
                label={utbetalingstekster('dager')}
                value={antallDager}
            />
            <ListeItem
                label={utbetalingstekster('sykmeldingsgrad')}
                value={`${sykmeldingsgrad}%`}
            />

            <ListeSeparator type="dotted" />

            <ListeItemBolk
                label={utbetalingstekster('utbetaling')}
                value={toKronerOgØre(antallDager * dagsats)}
            />

            <ListeSeparator type="solid" />

            <Undertittel>{tekster('mvp')}</Undertittel>
            <ListeItemBolk
                label={utbetalingstekster('forskutterer')}
                value={<Ikon kind="ok-sirkel-fyll" size={24} />}
            />

            <Navigasjonsknapper previous="/periode" next="/oppsummering" />
        </Panel>
    );
});

export default Utbetaling;
