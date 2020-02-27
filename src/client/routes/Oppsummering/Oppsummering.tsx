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
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import './Oppsummering.less';
import { useTranslation } from 'react-i18next';

const Oppsummering = () => {
    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext);
    const { error, simulering, arbeidsgiver } = useContext(SimuleringContext);
    const { t } = useTranslation();
    if (!aktivVedtaksperiode) return null;

    const { oppsummering, sykepengegrunnlag } = aktivVedtaksperiode;

    const simuleringsBeløp = simulering?.simulering?.totalBelop
        ? `${toKronerOgØre(simulering?.simulering?.totalBelop)} kr`
        : simulering?.feilMelding ?? 'Ikke tilgjengelig';

    const simuleringsArbeidsgiver = `Organisasjonsnummer: ${personTilBehandling?.arbeidsgivere[0].organisasjonsnummer}`;

    return (
        <div className="Oppsummering">
            <Panel>
                <Undertittel>{t('oppsummering.tittel')}</Undertittel>
                <List>
                    <ListItem label={t('oppsummering.sykepengegrunnlag')}>
                        {`${toKronerOgØre(sykepengegrunnlag.årsinntektFraInntektsmelding!)} kr`}
                    </ListItem>
                    <ListItem label={t('oppsummering.dagsats')}>
                        {`${toKronerOgØre(sykepengegrunnlag.dagsats!)} kr`}
                    </ListItem>
                    <ListItem label={t('oppsummering.antall_utbetalingsdager')}>
                        {oppsummering.antallUtbetalingsdager}
                    </ListItem>
                    <ListItem label={t('oppsummering.beløp')}>
                        {`${toKronerOgØre(oppsummering.totaltTilUtbetaling)} kr`}
                    </ListItem>
                    <ListItem label={t('oppsummering.utbetaling_til')}>
                        {simuleringsArbeidsgiver}
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
