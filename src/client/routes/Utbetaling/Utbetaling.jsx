import React, { useContext } from 'react';
import IconRow from '../../components/Rows/IconRow';
import FormRow from '../../components/Rows/FormRow';
import ListSeparator from '../../components/ListSeparator/ListSeparator';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { toKroner } from '../../utils/locale';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { tekster, utbetalingstekster } from '../../tekster';
import { BehandlingerContext } from '../../context/BehandlingerContext';

const Utbetaling = () => {
    const { personTilBehandling } = useContext(BehandlingerContext);
    const {
        antallUtbetalingsdager,
        betalerArbeidsgiverperiode,
        dagsats,
        sykepengegrunnlag,
        sykmeldingsgrad,
        utbetalingsbeløp
    } = personTilBehandling.utbetaling;

    return (
        <Panel className="Utbetaling">
            <Undertittel className="panel-tittel">{utbetalingstekster('tittel')}</Undertittel>
            <FormRow
                label={utbetalingstekster('refusjon')}
                value={tekster('informasjon ikke tilgjengelig')}
            />
            <FormRow
                label={utbetalingstekster('betaler')}
                value={betalerArbeidsgiverperiode ? 'Ja' : 'Nei'}
            />
            <ListSeparator type="transparent" />
            <FormRow
                label={utbetalingstekster('sykepengegrunnlag')}
                value={`${toKroner(sykepengegrunnlag)} kr`}
                showRightSide={false}
            />
            <FormRow
                label={utbetalingstekster('dagsats')}
                value={`${toKroner(dagsats)} kr`}
                showRightSide={false}
            />
            <FormRow
                label={utbetalingstekster('dager')}
                value={antallUtbetalingsdager}
                showRightSide={false}
            />
            <FormRow
                label={utbetalingstekster('sykmeldingsgrad')}
                value={`${sykmeldingsgrad}%`}
                showRightSide={false}
            />
            <ListSeparator type="transparent" />
            <FormRow
                label={utbetalingstekster('utbetaling')}
                value={`${toKroner(utbetalingsbeløp)} kr`}
                bold
            />
            <ListSeparator />
            <Element className="mvp-tittel">{tekster('mvp')}</Element>
            <IconRow label={utbetalingstekster('forskutterer')} />

            <Navigasjonsknapper previous="/periode" next="/oppsummering" />
        </Panel>
    );
};

export default Utbetaling;
