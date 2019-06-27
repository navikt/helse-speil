import React from 'react';
import Ikon from 'nav-frontend-ikoner-assets';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { withBehandlingContext } from '../../../context/withBehandlingContext';
import './Utbetaling.css';
import EnigBolk from '../../widgets/Bolk/EnigBolk';
import ListeSeparator from '../../widgets/ListeSeparator';
import ListeItem from '../../widgets/ListeItem';
import { toMonetaryValue } from '../../../utils/locale';

const Utbetaling = withBehandlingContext(({ behandling }) => {
    const {
        antallDager,
        arbeidsgiverForskutterer,
        betalerArbeidsgiverperiode,
        dagsats,
        refusjonTilArbeidsgiver,
        sykepengegrunnlag,
        sykmeldingsgrad
    } = behandling.utbetaling;
    return (
        <Panel className="Utbetaling" border>
            <Undertittel className="panel-tittel">Utbetaling</Undertittel>
            <EnigBolk
                label="Refusjon til arbeidsgiver"
                value={refusjonTilArbeidsgiver ? 'Ja' : 'Nei'}
            />
            <EnigBolk
                label="Betaler arb.giverperiode"
                value={betalerArbeidsgiverperiode ? 'Ja' : 'Nei'}
            />

            <ListeSeparator type="dotted" />

            <ListeItem label="Sykepengegrunnlag" value={toMonetaryValue(sykepengegrunnlag)} />
            <ListeItem label="Dagsats" value={toMonetaryValue(dagsats)} />

            <ListeSeparator type="dotted" />

            <ListeItem label="Antall dager" value={antallDager} />
            <ListeItem label="Sykmeldingsgrad" value={`${sykmeldingsgrad}%`} />

            <ListeSeparator type="dotted" />

            <EnigBolk
                label="Utbetaling"
                value={toMonetaryValue(antallDager * dagsats)}
            />

            <ListeSeparator type="solid" />

            <Undertittel>Filter for MVP</Undertittel>
            <EnigBolk label="Arb.giver forskutterer" value={
                arbeidsgiverForskutterer
                    ? <Ikon kind="ok-sirkel-fyll" size={24} />
                    : <Ikon kind="feil-sirkel-fyll" size={24} />
            } />

            <Navigasjonsknapper previous="/periode" next="/oppsummering" />
        </Panel>
    );
});

export default Utbetaling;
