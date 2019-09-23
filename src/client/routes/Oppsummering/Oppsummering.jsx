import React from 'react';
import ListItem from '../../components/ListItem/ListItem';
import ListSeparator from '../../components/ListSeparator/ListSeparator';
import Innrapportering from './Innrapportering';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { toDate } from '../../utils/date';
import { toKroner } from '../../utils/locale';
import { Undertittel } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../context/BehandlingerContext';
import { oppsummeringstekster, tekster } from '../../tekster';
import './Oppsummering.less';

const Oppsummering = withBehandlingContext(({ behandling }) => {
    return (
        <div className="Oppsummering">
            <Panel border>
                <Undertittel>{oppsummeringstekster('tittel')}</Undertittel>
                <ListItem
                    label={oppsummeringstekster('sykdomsvilkår')}
                    value={behandling.oppsummering.sykdomsvilkårErOppfylt}
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('inngangsvilkår')}
                    value={behandling.oppsummering.inngangsvilkårErOppfylt}
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('arbeidsgiver')}
                    value={behandling.oppsummering.arbeidsgiver.navn}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('orgnr')}
                    value={behandling.oppsummering.arbeidsgiver.orgnummer}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('refusjon')}
                    value={tekster('informasjon ikke tilgjengelig')}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('betaler')}
                    value={behandling.oppsummering.betalerArbeidsgiverperiode ? 'Nei' : 'Ja'}
                />
                <ListItem
                    label={oppsummeringstekster('fordeling')}
                    value={`${behandling.oppsummering.fordeling}%`}
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('sykepengegrunnlag')}
                    value={`${toKroner(behandling.oppsummering.sykepengegrunnlag)} kr`}
                />
                <ListItem
                    label={oppsummeringstekster('månedsbeløp')}
                    value={`${toKroner(behandling.oppsummering.månedsbeløp)} kr`}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('dagsats')}
                    value={`${toKroner(behandling.oppsummering.dagsats)} kr`}
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('antall_utbetalingsdager')}
                    value={behandling.oppsummering.antallUtbetalingsdager}
                />
                <ListItem
                    label={oppsummeringstekster('fom')}
                    value={toDate(behandling.oppsummering.sykmeldtFraOgMed)}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('tom')}
                    value={toDate(behandling.oppsummering.sykmeldtTilOgMed)}
                    bold
                />
                <ListItem
                    label={oppsummeringstekster('sykmeldingsgrad')}
                    value={`${behandling.oppsummering.sykmeldingsgrad}%`}
                    bold
                />
                <ListSeparator type="dotted" />
                <ListItem
                    label={oppsummeringstekster('utbetalesFom')}
                    value={toDate(behandling.oppsummering.utbetalesFom)}
                />
                <ListItem
                    label={oppsummeringstekster('utbetalesTom')}
                    value={toDate(behandling.oppsummering.utbetalesTom)}
                />
                <ListItem
                    label={oppsummeringstekster('utbetaling')}
                    value={`${toKroner(behandling.oppsummering.utbetaling)} kr`}
                />
                <ListSeparator type="solid" />
                <Navigasjonsknapper previous="/utbetaling" />
            </Panel>
            <div className="Oppsummering__right-col">
                <Innrapportering />
            </div>
        </div>
    );
});

export default Oppsummering;
