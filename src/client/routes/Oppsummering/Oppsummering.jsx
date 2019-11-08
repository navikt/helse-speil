import React, { useContext } from 'react';
import ListItem from '../../components/ListItem';
import ListSeparator from '../../components/ListSeparator';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { toDate } from '../../utils/date';
import { toKroner } from '../../utils/locale';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import { oppsummeringstekster, tekster } from '../../tekster';
import './Oppsummering.less';
import { pages } from '../../hooks/useLinks';
import Utbetaling from './Utbetaling';

const Oppsummering = () => {
    const { personTilBehandling } = useContext(PersonContext);
    return (
        <div className="Oppsummering">
            <Panel>
                <Undertittel>{oppsummeringstekster('tittel')}</Undertittel>
                {personTilBehandling.oppsummering ? (
                    <>
                        <ListItem
                            label={oppsummeringstekster('sykdomsvilkår')}
                            value={personTilBehandling.oppsummering.sykdomsvilkårErOppfylt}
                        />
                        <ListSeparator type="dotted" />
                        <ListItem
                            label={oppsummeringstekster('inngangsvilkår')}
                            value={personTilBehandling.oppsummering.inngangsvilkårErOppfylt}
                        />
                        <ListSeparator type="dotted" />
                        <ListItem
                            label={oppsummeringstekster('arbeidsgiver')}
                            value={personTilBehandling.oppsummering.arbeidsgiver.navn}
                            bold
                        />
                        <ListItem
                            label={oppsummeringstekster('orgnr')}
                            value={personTilBehandling.oppsummering.arbeidsgiver.orgnummer}
                            bold
                        />
                        <ListItem
                            label={oppsummeringstekster('refusjon')}
                            value={tekster('informasjon ikke tilgjengelig')}
                            bold
                        />
                        <ListItem
                            label={oppsummeringstekster('betaler')}
                            value={
                                personTilBehandling.oppsummering.betalerArbeidsgiverperiode
                                    ? 'Nei'
                                    : 'Ja'
                            }
                        />
                        <ListItem
                            label={oppsummeringstekster('fordeling')}
                            value={`${personTilBehandling.oppsummering.fordeling}%`}
                        />
                        <ListSeparator type="dotted" />
                        <ListItem
                            label={oppsummeringstekster('sykepengegrunnlag')}
                            value={`${toKroner(
                                personTilBehandling.oppsummering.sykepengegrunnlag
                            )} kr`}
                        />
                        <ListItem
                            label={oppsummeringstekster('månedsbeløp')}
                            value={`${toKroner(personTilBehandling.oppsummering.månedsbeløp)} kr`}
                            bold
                        />
                        <ListItem
                            label={oppsummeringstekster('dagsats')}
                            value={`${toKroner(personTilBehandling.oppsummering.dagsats)} kr`}
                        />
                        <ListSeparator type="dotted" />
                        <ListItem
                            label={oppsummeringstekster('antall_utbetalingsdager')}
                            value={personTilBehandling.oppsummering.antallUtbetalingsdager}
                        />
                        <ListItem
                            label={oppsummeringstekster('fom')}
                            value={toDate(personTilBehandling.oppsummering.sykmeldtFraOgMed)}
                            bold
                        />
                        <ListItem
                            label={oppsummeringstekster('tom')}
                            value={toDate(personTilBehandling.oppsummering.sykmeldtTilOgMed)}
                            bold
                        />
                        <ListItem
                            label={oppsummeringstekster('sykmeldingsgrad')}
                            value={`${personTilBehandling.oppsummering.sykmeldingsgrad}%`}
                            bold
                        />
                        <ListSeparator type="dotted" />
                        <ListItem
                            label={oppsummeringstekster('utbetalesFom')}
                            value={toDate(personTilBehandling.oppsummering.utbetalesFom)}
                        />
                        <ListItem
                            label={oppsummeringstekster('utbetalesTom')}
                            value={toDate(personTilBehandling.oppsummering.utbetalesTom)}
                        />
                        <ListItem
                            label={oppsummeringstekster('utbetaling')}
                            value={`${toKroner(personTilBehandling.oppsummering.utbetaling)} kr`}
                        />
                        <ListSeparator type="solid" />
                    </>
                ) : (
                    <Normaltekst>Ingen data</Normaltekst>
                )}

                <Navigasjonsknapper previous={pages.UTBETALINGSOVERSIKT} />
            </Panel>
            <div className="Oppsummering__right-col">
                <Utbetaling />
            </div>
        </div>
    );
};

export default Oppsummering;
