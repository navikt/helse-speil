import React, { useContext } from 'react';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Utbetaling from './Utbetaling';
import Navigasjonsknapper from '../../components/NavigationButtons';
import Panel from 'nav-frontend-paneler';
import { toKronerOgØre } from '../../utils/locale';
import { PersonContext } from '../../context/PersonContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Simuleringsinfo from './Simuleringsinfo';

const Innhold = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid #3e3832;
    grid-column-start: 1;
    grid-column-end: 4;
    margin: 1rem 0;
`;

const StyledPanel = styled(Panel)`
    flex: 1;
    overflow-x: hidden;
    margin-right: 0;
    min-width: 24rem;
    max-width: max-content;
`;

const Oppsummeringstittel = styled(Undertittel)`
    margin-bottom: 1rem;
`;

const Infotekst = styled(Normaltekst)`
    margin-bottom: 1rem;
`;

const Oppsummering = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { t } = useTranslation();
    if (!aktivVedtaksperiode) return null;

    const { oppsummering, simuleringsdata, sykepengegrunnlag, inntektskilder } = aktivVedtaksperiode;

    return (
        <Innhold>
            <StyledPanel>
                <Oppsummeringstittel>{t('oppsummering.tittel')}</Oppsummeringstittel>
                <List>
                    <ListItem label={t('oppsummering.sykepengegrunnlag')}>
                        {`${toKronerOgØre(sykepengegrunnlag.årsinntektFraInntektsmelding!)} kr`}
                    </ListItem>
                    <ListItem label={t('oppsummering.antall_utbetalingsdager')}>
                        {oppsummering.antallUtbetalingsdager}
                    </ListItem>
                    <ListItem label={t('oppsummering.beløp')}>
                        {oppsummering.totaltTilUtbetaling > 0
                            ? `${toKronerOgØre(oppsummering.totaltTilUtbetaling)} kr`
                            : 'Ingen utbetaling'}
                    </ListItem>
                    <ListItem label={t('oppsummering.utbetaling_til')}>
                        {`Organisasjonsnummer: ${inntektskilder[0].organisasjonsnummer}`}
                    </ListItem>
                </List>
                <Divider />
                {simuleringsdata ? (
                    <Simuleringsinfo simulering={simuleringsdata} />
                ) : (
                    <Infotekst>Ingen simulering</Infotekst>
                )}
                <Navigasjonsknapper />
            </StyledPanel>
            <Utbetaling />
        </Innhold>
    );
};

export default Oppsummering;
