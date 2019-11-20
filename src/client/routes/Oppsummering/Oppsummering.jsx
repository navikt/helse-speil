import React, { useContext } from 'react';
import ListItem from '../../components/ListItem';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../tekster';
import './Oppsummering.less';
import { pages } from '../../hooks/useLinks';
import Utbetaling from './Utbetaling';
import { SimuleringContext } from '../../context/SimuleringContext';
import ListSeparator from '../../components/ListSeparator';
import { toKronerOgØre } from '../../utils/locale';
import { PersonContext } from '../../context/PersonContext';

const Oppsummering = () => {
    const { oppsummering } = useContext(PersonContext).personTilBehandling;
    const simuleringContext = useContext(SimuleringContext);

    return (
        <div className="Oppsummering">
            <Panel>
                <Undertittel>{oppsummeringstekster('tittel')}</Undertittel>
                <ListItem
                    label={oppsummeringstekster('sykepengegrunnlag')}
                    value={`${toKronerOgØre(oppsummering.sykepengegrunnlag)} kr`}
                />
                <ListItem
                    label={oppsummeringstekster('dagsats')}
                    value={`${toKronerOgØre(oppsummering.dagsats)} kr`}
                />
                <ListItem
                    label={oppsummeringstekster('antall_utbetalingsdager')}
                    value={oppsummering.antallDager}
                />
                <ListItem
                    label={oppsummeringstekster('beløp')}
                    value={`${toKronerOgØre(oppsummering.beløp)} kr`}
                />
                <ListItem
                    label={oppsummeringstekster('utbetaling_til')}
                    value={`${oppsummering.mottaker?.navn} (${oppsummering.mottaker?.orgnummer})`}
                />

                <ListSeparator type="solid" />
                {simuleringContext.error ? (
                    <Normaltekst>{simuleringContext.error}</Normaltekst>
                ) : (
                    <>
                        <ListItem
                            label="Simulering"
                            value={
                                simuleringContext.simulering?.simulering?.totalBelop
                                    ? `${toKronerOgØre(
                                          simuleringContext.simulering?.simulering?.totalBelop
                                      )} kr`
                                    : simuleringContext.simulering?.feilMelding ??
                                      'Ikke tilgjengelig'
                            }
                        />
                        <ListItem
                            label=""
                            value={
                                simuleringContext.arbeidsgiver === oppsummering.mottaker?.orgnummer
                                    ? `${oppsummering.mottaker?.navn} (${oppsummering.mottaker?.orgnummer})`
                                    : `Organisasjonsnummer: ${simuleringContext.arbeidsgiver}`
                            }
                        />
                    </>
                )}
                <ListSeparator type="solid" />

                <Navigasjonsknapper previous={pages.UTBETALINGSOVERSIKT} />
            </Panel>
            <div className="Oppsummering__right-col">
                <Utbetaling />
            </div>
        </div>
    );
};

export default Oppsummering;
