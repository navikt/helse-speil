import React from 'react';
import IconRow from '../../widgets/rows/IconRow';
import FormRow from '../../widgets/rows/FormRow';
import ListeSeparator from '../../widgets/ListeSeparator';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { Panel } from 'nav-frontend-paneler';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { toKroner } from '../../../utils/locale';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { tekster, utbetalingstekster } from '../../../tekster';

const Utbetaling = withBehandlingContext(({ behandling }) => {
    const {
        antallUtbetalingsdager,
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
            <FormRow
                label={utbetalingstekster('refusjon')}
                value={refusjonTilArbeidsgiver ? 'Ja' : 'Nei'}
            />
            <FormRow
                label={utbetalingstekster('betaler')}
                value={betalerArbeidsgiverperiode ? 'Ja' : 'Nei'}
            />
            <ListeSeparator type="transparent" />
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
            <ListeSeparator type="transparent" />
            <FormRow
                label={utbetalingstekster('utbetaling')}
                value={`${toKroner(antallUtbetalingsdager * dagsats)} kr`}
                bold
            />
            <ListeSeparator />
            <Element className="mvp-tittel">{tekster('mvp')}</Element>
            <IconRow label={utbetalingstekster('forskutterer')} />

            <Navigasjonsknapper previous="/periode" next="/oppsummering" />
        </Panel>
    );
});

export default Utbetaling;
