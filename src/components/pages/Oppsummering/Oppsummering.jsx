import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './Oppsummering.css';
import { withBehandlingContext } from '../../../context/withBehandlingContext';
import ListeItem from '../../widgets/ListeItem';
import ListeSeparator from '../../widgets/ListeSeparator';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { toKronerOgØre } from '../../../utils/locale';
import { toDate } from '../../../utils/date';

const Oppsummering = withBehandlingContext(({ behandling }) => (
    <>
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
                    value={behandling.oppsummering.refusjonTilArbeidsgiver ? 'Ja' : 'Nei'}
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
                    value={toKronerOgØre(
                        behandling.oppsummering.sykepengegrunnlag,
                        2
                    )}
                />
                <ListeItem
                    label="Månedsbeløp"
                    value={toKronerOgØre(
                        behandling.oppsummering.månedsbeløp,
                        2
                    )}
                    bold
                />
                <ListeItem
                    label="Dagsats"
                    value={toKronerOgØre(behandling.oppsummering.dagsats, 2)}
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
                    value={`${toKronerOgØre(
                        behandling.oppsummering.utbetaling,
                        2
                    )}`}
                />
                <ListeSeparator type="solid" />
            </Panel>
            <div className="Oppsummering__right-col">
                <Panel border>
                    <Undertittel>Innrapportert</Undertittel>
                    <Normaltekst>Ingen uenigheter</Normaltekst>
                </Panel>
                <Panel border>...</Panel>
            </div>
        </div>
        <Navigasjonsknapper previous="/utbetaling" />
    </>
));

export default Oppsummering;
