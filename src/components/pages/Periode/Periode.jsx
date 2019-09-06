import React from 'react';
import IconRow from '../../widgets/rows/IconRow';
import FormRow from '../../widgets/rows/FormRow';
import ListeSeparator from '../../widgets/ListeSeparator';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { Panel } from 'nav-frontend-paneler';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { periodetekster, tekster } from '../../../tekster';
import { toDate } from '../../../utils/date';
import FormRowWithListValues from '../../widgets/rows/FormRowWithListValues';

const Periode = withBehandlingContext(({ behandling }) => {
    const {
        antallKalenderdager,
        arbeidsgiverperiodeKalenderdager,
        antallVirkedager,
        ferieperioder,
        antallUtbetalingsdager,
        sykmeldingsgrad
    } = behandling.periode;
    const ferieperioderAsString = ferieperioder.map(
        periode => `${toDate(periode.fom)} - ${toDate(periode.tom)}`
    );
    return (
        <Panel className="Periode" border>
            <Undertittel className="panel-tittel">
                {periodetekster('tittel')}
            </Undertittel>
            <FormRow
                label={periodetekster('kalenderdager')}
                value={antallKalenderdager}
            />
            <FormRow
                label={periodetekster('arbeidsgiverperiode')}
                value={arbeidsgiverperiodeKalenderdager}
            />
            <FormRow
                label={periodetekster('virkedager')}
                value={antallVirkedager}
            />
            <FormRowWithListValues
                label={periodetekster('ferie')}
                items={ferieperioderAsString}
            />
            <FormRow
                label={periodetekster('antall_utbetalingsdager')}
                value={antallUtbetalingsdager}
                bold
            />
            <FormRow
                label={periodetekster('sykmeldingsgrad')}
                value={`${sykmeldingsgrad}%`}
                bold
            />
            <ListeSeparator />
            <Element className="mvp-tittel">{tekster('mvp')}</Element>
            <IconRow label={periodetekster('friskmelding')} />
            <IconRow label={`Sykmeldingen er på ${sykmeldingsgrad}%`} />
            <Navigasjonsknapper previous="/beregning" next="/utbetaling" />
        </Panel>
    );
});

export default Periode;
