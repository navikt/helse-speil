import React, { useContext } from 'react';
import ListItem from '../../components/ListItem';
import ListSeparator from '../../components/ListSeparator';
import Innrapportering from './Innrapportering';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { toDate } from '../../utils/date';
import { toKroner } from '../../utils/locale';
import { Undertittel } from 'nav-frontend-typografi';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { oppsummeringstekster, tekster } from '../../tekster';
import './Oppsummering.less';

const Oppsummering = () => {
    const { valgtBehandling } = useContext(BehandlingerContext);
    return (
        <div className="Oppsummering">
            <Panel>
                <Undertittel>{oppsummeringstekster('tittel')}</Undertittel>
                <ListItem
                    label={oppsummeringstekster('sykdomsvilkår')}
                    value={valgtBehandling.oppsummering.sykdomsvilkårErOppfylt}
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('inngangsvilkår')}
                    value={valgtBehandling.oppsummering.inngangsvilkårErOppfylt}
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('arbeidsgiver')}
                    value={valgtBehandling.oppsummering.arbeidsgiver.navn}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('orgnr')}
                    value={valgtBehandling.oppsummering.arbeidsgiver.orgnummer}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('refusjon')}
                    value={tekster('informasjon ikke tilgjengelig')}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('betaler')}
                    value={valgtBehandling.oppsummering.betalerArbeidsgiverperiode ? 'Nei' : 'Ja'}
                />
                <ListItem
                    label={oppsummeringstekster('fordeling')}
                    value={`${valgtBehandling.oppsummering.fordeling}%`}
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('sykepengegrunnlag')}
                    value={`${toKroner(valgtBehandling.oppsummering.sykepengegrunnlag)} kr`}
                />
                <ListItem
                    label={oppsummeringstekster('månedsbeløp')}
                    value={`${toKroner(valgtBehandling.oppsummering.månedsbeløp)} kr`}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('dagsats')}
                    value={`${toKroner(valgtBehandling.oppsummering.dagsats)} kr`}
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('antall_utbetalingsdager')}
                    value={valgtBehandling.oppsummering.antallUtbetalingsdager}
                />
                <ListItem
                    label={oppsummeringstekster('fom')}
                    value={toDate(valgtBehandling.oppsummering.sykmeldtFraOgMed)}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('tom')}
                    value={toDate(valgtBehandling.oppsummering.sykmeldtTilOgMed)}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('sykmeldingsgrad')}
                    value={`${valgtBehandling.oppsummering.sykmeldingsgrad}%`}
                    bold
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('utbetalesFom')}
                    value={toDate(valgtBehandling.oppsummering.utbetalesFom)}
                />
                <ListItem
                    label={oppsummeringstekster('utbetalesTom')}
                    value={toDate(valgtBehandling.oppsummering.utbetalesTom)}
                />
                <ListItem
                    label={oppsummeringstekster('utbetaling')}
                    value={`${toKroner(valgtBehandling.oppsummering.utbetaling)} kr`}
                />
                <ListSeparator type="solid" />
                <Navigasjonsknapper previous="/utbetaling" />
            </Panel>
            <div className="Oppsummering__right-col">
                <Innrapportering />
            </div>
        </div>
    );
};

export default Oppsummering;
