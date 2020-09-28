import React, { useContext } from 'react';
import Panel from 'nav-frontend-paneler';
import styled from '@emotion/styled';
import Simuleringsinfo from './Simuleringsinfo';
import { Utbetaling } from './utbetaling/Utbetaling';
import { Navigasjonsknapper } from '../../../components/Navigasjonsknapper';
import { toKronerOgØre } from '../../../utils/locale';
import { PersonContext } from '../../../context/PersonContext';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Grid } from '../../../components/Grid';

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
                <ErrorBoundary>
                    <Oppsummeringstittel>{t('oppsummering.tittel')}</Oppsummeringstittel>
                    <Grid gridTemplateColumns="1fr 1fr">
                        <Normaltekst>{t('oppsummering.sykepengegrunnlag')}</Normaltekst>
                        <Normaltekst>{`${toKronerOgØre(sykepengegrunnlag.sykepengegrunnlag!)} kr`}</Normaltekst>
                        <Normaltekst>{t('oppsummering.antall_utbetalingsdager')}</Normaltekst>
                        <Normaltekst>{oppsummering.antallUtbetalingsdager}</Normaltekst>
                        <Normaltekst>{t('oppsummering.beløp')}</Normaltekst>
                        <Normaltekst>
                            {oppsummering.totaltTilUtbetaling > 0
                                ? `${toKronerOgØre(oppsummering.totaltTilUtbetaling)} kr`
                                : 'Ingen utbetaling'}
                        </Normaltekst>
                        <Normaltekst>{t('oppsummering.utbetaling_til')}</Normaltekst>
                        <Normaltekst>{`Organisasjonsnummer: ${inntektskilder[0].organisasjonsnummer}`}</Normaltekst>
                    </Grid>
                    <Divider />
                    {simuleringsdata ? (
                        <Simuleringsinfo simulering={simuleringsdata} />
                    ) : (
                        <Infotekst>Ingen simulering</Infotekst>
                    )}
                </ErrorBoundary>
                <Navigasjonsknapper />
            </StyledPanel>
            <Utbetaling />
        </Innhold>
    );
};

export default Oppsummering;
