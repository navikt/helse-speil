import React from 'react';
import IconRow from '../../components/Rows/IconRow';
import FormRow from '../../components/Rows/FormRow';
import ListSeparator from '../../components/ListSeparator/ListSeparator';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { toKroner } from '../../utils/locale';
import { withBehandlingContext } from '../../context/BehandlingerContext';
import { tekster, utbetalingstekster } from '../../tekster';

const Utbetaling = withBehandlingContext(({ behandling }) => {
    const {
        antallUtbetalingsdager,
        betalerArbeidsgiverperiode,
        dagsats,
        sykepengegrunnlag,
        sykmeldingsgrad,
        utbetalingsbeløp
    } = behandling.utbetaling;

    return (
        <Panel className="Utbetaling" border>
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
});

export default Utbetaling;
