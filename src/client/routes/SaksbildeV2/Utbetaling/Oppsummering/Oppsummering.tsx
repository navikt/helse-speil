import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../../../context/PersonContext';
import { somPenger } from '../../../../utils/locale';
import Lenke from 'nav-frontend-lenker';
import { SimuleringsinfoModal } from './SimuleringsinfoModal';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Utbetaling } from './utbetaling/Utbetaling';

const Infotekst = styled(Normaltekst)`
    margin-bottom: 0.5rem;
`;

const Infogruppe = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 4rem;
`;

const StyledLenke = styled(Lenke)`
    grid-column: 1/-1;
    margin-bottom: 1.5rem;
`;

const Fullbredde = styled.div`
    grid-column: 1/-1;
    margin-bottom: 1.5rem;
`;

const Simuleringsfeilmelding = styled(Feilmelding)`
    margin-bottom: 1rem;
`;

const Oppsummering = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { t } = useTranslation();
    const { url } = useRouteMatch();
    const history = useHistory();
    const [åpen, setÅpen] = useState(false);
    if (!aktivVedtaksperiode) return null;

    const { oppsummering, sykepengegrunnlag, simuleringsdata } = aktivVedtaksperiode;

    return (
        <>
            <Infogruppe>
                <Infotekst>{t('oppsummering.sykepengegrunnlag')}</Infotekst>
                <Infotekst>{somPenger(sykepengegrunnlag.sykepengegrunnlag!)}</Infotekst>
                <Fullbredde>
                    <StyledLenke href="" onClick={() => history.push(`${url}/../sykepengegrunnlag`)}>
                        Beregning av sykepengegrunnlaget
                    </StyledLenke>
                </Fullbredde>
                <Infotekst>{t('oppsummering.antall_utbetalingsdager')}</Infotekst>
                <Infotekst>{oppsummering.antallUtbetalingsdager}</Infotekst>
                <Infotekst>{t('oppsummering.beløp')}</Infotekst>
                <Infotekst>
                    {oppsummering.totaltTilUtbetaling > 0
                        ? somPenger(oppsummering.totaltTilUtbetaling)
                        : 'Ingen utbetaling'}
                </Infotekst>
                {simuleringsdata ? (
                    <Fullbredde>
                        <StyledLenke href="#" onClick={() => setÅpen(true)}>
                            Simulering
                        </StyledLenke>
                    </Fullbredde>
                ) : (
                    <Simuleringsfeilmelding>Mangler simulering</Simuleringsfeilmelding>
                )}
            </Infogruppe>
            <Utbetaling />
            {simuleringsdata && (
                <SimuleringsinfoModal simulering={simuleringsdata} åpenModal={åpen} lukkModal={() => setÅpen(false)} />
            )}
        </>
    );
};

export default Oppsummering;
