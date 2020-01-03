import React, { useContext } from 'react';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Utbetaling from './Utbetaling';
import ListSeparator from '../../components/ListSeparator';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { toKronerOgØre } from '../../utils/locale';
import { PersonContext } from '../../context/PersonContext';
import { SimuleringContext } from '../../context/SimuleringContext';
import { oppsummeringstekster } from '../../tekster';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import './Oppsummering.less';
import { Person } from '../../context/types';

const Oppsummering = () => {
    const { oppsummering } = useContext(PersonContext).personTilBehandling as Person;
    const { error, simulering, arbeidsgiver } = useContext(SimuleringContext);

    const simuleringsBeløp = simulering?.simulering?.totalBelop
        ? `${toKronerOgØre(simulering?.simulering?.totalBelop)} kr`
        : simulering?.feilMelding ?? 'Ikke tilgjengelig';

    const simuleringsArbeidsgiver =
        arbeidsgiver === oppsummering.mottaker?.orgnummer
            ? `${oppsummering.mottaker?.navn} (${oppsummering.mottaker?.orgnummer})`
            : `Organisasjonsnummer: ${arbeidsgiver}`;

    return (
        <div className="Oppsummering">
            <Panel>
                <Undertittel>{oppsummeringstekster('tittel')}</Undertittel>
                <List>
                    <ListItem label={oppsummeringstekster('sykepengegrunnlag')}>
                        {`${toKronerOgØre(oppsummering.sykepengegrunnlag)} kr`}
                    </ListItem>
                    <ListItem label={oppsummeringstekster('dagsats')}>
                        {`${toKronerOgØre(oppsummering.dagsats)} kr`}
                    </ListItem>
                    <ListItem label={oppsummeringstekster('antall_utbetalingsdager')}>
                        {oppsummering.antallDager}
                    </ListItem>
                    <ListItem label={oppsummeringstekster('beløp')}>
                        {`${toKronerOgØre(oppsummering.beløp)} kr`}
                    </ListItem>
                    <ListItem label={oppsummeringstekster('utbetaling_til')}>
                        {`${oppsummering.mottaker?.navn} (${oppsummering.mottaker?.orgnummer})`}
                    </ListItem>
                </List>
                <ListSeparator />
                {simulering && arbeidsgiver && (
                    <List>
                        <ListItem label="Simulering">{simuleringsBeløp}</ListItem>
                        <ListItem label="">{simuleringsArbeidsgiver}</ListItem>
                    </List>
                )}
                {error && <Normaltekst>{error}</Normaltekst>}
                <ListSeparator />
                <Navigasjonsknapper previous={pages.UTBETALINGSOVERSIKT} />
            </Panel>
            <div className="Oppsummering__right-col">
                <Utbetaling />
            </div>
        </div>
    );
};

export default Oppsummering;
