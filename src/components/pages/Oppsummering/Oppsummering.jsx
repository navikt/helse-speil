import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { toDate } from '../../../utils/date';
import { toKronerOgØre } from '../../../utils/locale';
import ListeItem from '../../widgets/ListeItem';
import ListeSeparator from '../../widgets/ListeSeparator';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import Innrapportering from './Innrapportering';
import './Oppsummering.less';

const Oppsummering = withBehandlingContext(({ behandling }) => (
    <div className="Oppsummering">
        <Panel border>
            <Undertittel>Oppsummering</Undertittel>
            <ListeItem
                label="Sykdomsvilkår er oppfylt"
                value={behandling.oppsummering.sykdomsvilkårErOppfylt}
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label="Inngangsvilkår er oppfylt"
                value={behandling.oppsummering.inngangsvilkårErOppfylt}
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label="Arbeidsgiver"
                value={behandling.oppsummering.arbeidsgiver.navn}
                bold
            />
            <ListeItem
                label="Organisasjonsnummer"
                value={behandling.oppsummering.arbeidsgiver.orgnummer}
                bold
            />
            <ListeItem
                label="Refusjon til arbeidsgiver"
                value={
                    behandling.oppsummering.refusjonTilArbeidsgiver
                        ? 'Ja'
                        : 'Nei'
                }
                bold
            />
            <ListeItem
                label="Betaler arb.giverperiode"
                value={behandling.oppsummering.betalerArbeidsgiverPeriode}
            />
            <ListeItem
                label="Fordeling"
                value={`${behandling.oppsummering.fordeling}%`}
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label="Sykepengegrunnlag"
                value={toKronerOgØre(behandling.oppsummering.sykepengegrunnlag)}
            />
            <ListeItem
                label="Månedsbeløp"
                value={toKronerOgØre(behandling.oppsummering.månedsbeløp)}
                bold
            />
            <ListeItem
                label="Dagsats"
                value={toKronerOgØre(behandling.oppsummering.dagsats)}
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label="Antall dager"
                value={behandling.oppsummering.antallDager}
            />
            <ListeItem
                label="Sykmeldt fra og med"
                value={toDate(behandling.oppsummering.sykmeldtFraOgMed)}
                bold
            />
            <ListeItem
                label="Sykmeldt til og med"
                value={toDate(behandling.oppsummering.sykmeldtTilOgMed)}
                bold
            />
            <ListeItem
                label="Sykmeldingsgrad"
                value={`${behandling.oppsummering.sykmeldingsgrad}%`}
                bold
            />
            <ListeSeparator type="dotted" />
            <ListeItem
                label="Utbetaling"
                value={`${toKronerOgØre(behandling.oppsummering.utbetaling)}`}
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
