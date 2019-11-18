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
import { toLocaleFixedNumberString } from '../../utils/locale';
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
                    value={`${toLocaleFixedNumberString(oppsummering.sykepengegrunnlag, 2)} kr`}
                />
                <ListItem
                    label={oppsummeringstekster('dagsats')}
                    value={`${toLocaleFixedNumberString(oppsummering.dagsats, 2)} kr`}
                />
                <ListItem
                    label={oppsummeringstekster('antall_utbetalingsdager')}
                    value={oppsummering.antallDager}
                />
                <ListItem
                    label={oppsummeringstekster('beløp')}
                    value={`${toLocaleFixedNumberString(oppsummering.beløp, 2)} kr`}
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
                                    ? `${toLocaleFixedNumberString(
                                          simuleringContext.simulering?.simulering?.totalBelop,
                                          2
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
