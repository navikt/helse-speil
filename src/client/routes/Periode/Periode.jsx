import React, { useContext } from 'react';
import IconRow from '../../components/Rows/IconRow';
import FormRow from '../../components/Rows/FormRow';
import ListSeparator from '../../components/ListSeparator/ListSeparator';
import NavigationButtons from '../../components/NavigationButtons';
import FormRowWithListValues from '../../components/Rows/FormRowWithListValues';
import { Panel } from 'nav-frontend-paneler';
import { toDate } from '../../utils/date';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { periodetekster, tekster } from '../../tekster';

const Periode = () => {
    const { personTilBehandling } = useContext(BehandlingerContext);
    const {
        antallKalenderdager,
        arbeidsgiverperiodeKalenderdager,
        antallVirkedager,
        ferieperioder,
        antallUtbetalingsdager,
        sykmeldingsgrad
    } = personTilBehandling.periode;

    const ferieperioderAsString = ferieperioder.map(
        periode => `${toDate(periode.fom)} - ${toDate(periode.tom)}`
    );

    return (
        <Panel className="Periode">
            <Undertittel className="panel-tittel">{periodetekster('tittel')}</Undertittel>
            <FormRow label={periodetekster('kalenderdager')} value={antallKalenderdager} />
            <FormRow
                label={periodetekster('arbeidsgiverperiode')}
                value={arbeidsgiverperiodeKalenderdager}
            />
            <FormRow label={periodetekster('virkedager')} value={antallVirkedager} />
            <FormRowWithListValues label={periodetekster('ferie')} items={ferieperioderAsString} />
            <FormRow
                label={periodetekster('antall_utbetalingsdager')}
                value={antallUtbetalingsdager}
                bold
            />
            <FormRow label={periodetekster('sykmeldingsgrad')} value={`${sykmeldingsgrad}%`} bold />
            <ListSeparator />
            <Element className="mvp-tittel">{tekster('mvp')}</Element>
            <IconRow label={periodetekster('friskmelding')} />
            <IconRow label={`Sykmeldingen er på ${sykmeldingsgrad}%`} />
            <NavigationButtons previous="/beregning" next="/utbetaling" />
        </Panel>
    );
};

export default Periode;
