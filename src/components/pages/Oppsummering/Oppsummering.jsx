import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { toDate } from '../../../utils/date';
import { toKroner } from '../../../utils/locale';
import ListeItem from '../../widgets/ListeItem';
import ListeSeparator from '../../widgets/ListeSeparator';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import Innrapportering from './Innrapportering';
import './Oppsummering.less';
import { oppsummeringstekster } from '../../../tekster';

const Oppsummering = withBehandlingContext(({ behandling }) => (
    <div className="Oppsummering">
        <Panel border>
            <Undertittel>{oppsummeringstekster('tittel')}</Undertittel>
            <ListeItem
                label={oppsummeringstekster('sykdomsvilkår')}
                value={behandling.oppsummering.sykdomsvilkårErOppfylt}
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label={oppsummeringstekster('inngangsvilkår')}
                value={behandling.oppsummering.inngangsvilkårErOppfylt}
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label={oppsummeringstekster('arbeidsgiver')}
                value={behandling.oppsummering.arbeidsgiver.navn}
                bold
            />
            <ListeItem
                label={oppsummeringstekster('orgnr')}
                value={behandling.oppsummering.arbeidsgiver.orgnummer}
                bold
            />
            <ListeItem
                label={oppsummeringstekster('refusjon')}
                value={
                    behandling.oppsummering.refusjonTilArbeidsgiver
                        ? 'Ja'
                        : 'Nei'
                }
                bold
            />
            <ListeItem
                label={oppsummeringstekster('betaler')}
                value={`${toKroner(
                    behandling.oppsummering.betalerArbeidsgiverPeriode
                )} kr`}
            />
            <ListeItem
                label={oppsummeringstekster('fordeling')}
                value={`${behandling.oppsummering.fordeling}%`}
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label={oppsummeringstekster('sykepengegrunnlag')}
                value={`${toKroner(
                    behandling.oppsummering.sykepengegrunnlag
                )} kr`}
            />
            <ListeItem
                label={oppsummeringstekster('månedsbeløp')}
                value={`${toKroner(behandling.oppsummering.månedsbeløp)} kr`}
                bold
            />
            <ListeItem
                label={oppsummeringstekster('dagsats')}
                value={`${toKroner(behandling.oppsummering.dagsats)} kr`}
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label={oppsummeringstekster('dager')}
                value={behandling.oppsummering.antallDager}
            />
            <ListeItem
                label={oppsummeringstekster('fom')}
                value={toDate(behandling.oppsummering.sykmeldtFraOgMed)}
                bold
            />
            <ListeItem
                label={oppsummeringstekster('tom')}
                value={toDate(behandling.oppsummering.sykmeldtTilOgMed)}
                bold
            />
            <ListeItem
                label={oppsummeringstekster('sykmeldingsgrad')}
                value={`${behandling.oppsummering.sykmeldingsgrad}%`}
                bold
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label={oppsummeringstekster('utbetaling')}
                value={`${toKroner(behandling.oppsummering.utbetaling)} kr`}
            />
            <ListeSeparator type="solid" />
            <Navigasjonsknapper previous="/utbetaling" />
        </Panel>
        <div className="Oppsummering__right-col">
            <Innrapportering />
        </div>
    </div>
));

export default Oppsummering;
