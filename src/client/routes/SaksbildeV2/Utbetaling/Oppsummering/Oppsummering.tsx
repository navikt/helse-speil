import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../../../context/PersonContext';
import { somPenger } from '../../../../utils/locale';
import Lenke from 'nav-frontend-lenker';
import { SimuleringsinfoModal } from './SimuleringsinfoModal';
import { Link } from 'react-router-dom';
import { Utbetaling } from './utbetaling/Utbetaling';
import { Flex } from '../../../../components/Flex';

const Infotekst = styled(Normaltekst)`
    margin-bottom: 0.5rem;
`;

const Infogruppe = styled.section`
    margin-bottom: 1.5rem;
`;

const StyledLink = styled(Link)`
    margin-bottom: 2rem;
    display: block;
    color: #0067c5;
    max-width: max-content;
    &:hover {
        text-decoration: none;
    }

    &:active,
    &:focus {
        outline: none;
        color: #fff;
        text-decoration: none;
        background-color: #254b6d;
        box-shadow: 0 0 0 2px #254b6d;
    }
`;

const StyledLenke = styled(Lenke)`
    margin-bottom: 1.5rem;
`;

const Simuleringsfeilmelding = styled(Feilmelding)`
    margin-bottom: 1rem;
`;

const Oppsummering = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const { t } = useTranslation();
    const [åpen, setÅpen] = useState(false);
    if (!aktivVedtaksperiode) return null;

    const { oppsummering, sykepengegrunnlag, simuleringsdata } = aktivVedtaksperiode;

    return (
        <>
            <Infogruppe>
                <Flex justifyContent="space-between">
                    <Infotekst>{t('oppsummering.sykepengegrunnlag')}</Infotekst>
                    <Infotekst>{somPenger(sykepengegrunnlag.sykepengegrunnlag!)}</Infotekst>
                </Flex>
                <StyledLink to={`${personTilBehandling?.aktørId}/../sykepengegrunnlag`}>
                    Beregning av sykepengegrunnlaget
                </StyledLink>
                <Flex justifyContent="space-between">
                    <Infotekst>{t('oppsummering.antall_utbetalingsdager')}</Infotekst>
                    <Infotekst>{oppsummering.antallUtbetalingsdager}</Infotekst>
                </Flex>
                <Flex justifyContent="space-between">
                    <Infotekst>{t('oppsummering.beløp')}</Infotekst>
                    <Infotekst>
                        {oppsummering.totaltTilUtbetaling > 0
                            ? somPenger(oppsummering.totaltTilUtbetaling)
                            : 'Ingen utbetaling'}
                    </Infotekst>
                </Flex>

                {simuleringsdata ? (
                    <StyledLenke href="#" onClick={() => setÅpen(true)}>
                        Simulering
                    </StyledLenke>
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
