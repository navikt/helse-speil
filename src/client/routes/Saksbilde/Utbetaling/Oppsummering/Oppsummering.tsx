import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';
import { somPenger } from '../../../../utils/locale';
import Lenke from 'nav-frontend-lenker';
import { SimuleringsinfoModal } from './SimuleringsinfoModal';
import { Link } from 'react-router-dom';
import { Utbetaling } from './utbetaling/Utbetaling';
import { Flex } from '../../../../components/Flex';
import { useRecoilValue } from 'recoil';
import { aktivVedtaksperiodeState } from '../../../../state/vedtaksperiode';
import { usePerson } from '../../../../state/person';
import { Person } from 'internal-types';

const Infogruppe = styled.section`
    margin-bottom: 2.5rem;
    line-height: 22px;
`;

const StyledLenke = styled(Lenke)`
    margin-bottom: 1.5rem;
`;

const Simuleringsfeilmelding = styled(Feilmelding)`
    margin-bottom: 1rem;
`;

const Sykepengegrunnlagslenke = styled(Link)`
    color: #3e3832;

    &:hover {
        text-decoration: none;
    }

    &:active,
    &:focus-visible {
        outline: none;
        color: #fff;
        text-decoration: none;
        background-color: #254b6d;
        box-shadow: 0 0 0 2px #254b6d;
    }
`;

const Oppsummering = () => {
    const aktivVedtaksperiode = useRecoilValue(aktivVedtaksperiodeState);
    const personTilBehandling = usePerson();
    const { t } = useTranslation();
    const [åpen, setÅpen] = useState(false);
    if (!aktivVedtaksperiode) return null;

    const { oppsummering, sykepengegrunnlag, simuleringsdata } = aktivVedtaksperiode;

    return (
        <>
            <Infogruppe>
                <Flex justifyContent="space-between">
                    <Sykepengegrunnlagslenke to={`${personTilBehandling?.aktørId}/../sykepengegrunnlag`}>
                        {t('oppsummering.sykepengegrunnlag')}
                    </Sykepengegrunnlagslenke>
                    <Normaltekst>{somPenger(sykepengegrunnlag.sykepengegrunnlag!)}</Normaltekst>
                </Flex>
                <Flex justifyContent="space-between">
                    <Normaltekst>{t('oppsummering.antall_utbetalingsdager')}</Normaltekst>
                    <Normaltekst>{oppsummering.antallUtbetalingsdager}</Normaltekst>
                </Flex>
                <Flex justifyContent="space-between">
                    <Normaltekst>{t('oppsummering.beløp')}</Normaltekst>
                    <Normaltekst>
                        {oppsummering.totaltTilUtbetaling > 0
                            ? somPenger(oppsummering.totaltTilUtbetaling)
                            : 'Ingen utbetaling'}
                    </Normaltekst>
                </Flex>

                {simuleringsdata ? (
                    <StyledLenke href="#" onClick={() => setÅpen(true)}>
                        Simulering
                    </StyledLenke>
                ) : (
                    <Simuleringsfeilmelding>Mangler simulering</Simuleringsfeilmelding>
                )}
            </Infogruppe>
            <Utbetaling vedtaksperiode={aktivVedtaksperiode} />
            {simuleringsdata && (
                <SimuleringsinfoModal simulering={simuleringsdata} åpenModal={åpen} lukkModal={() => setÅpen(false)} />
            )}
        </>
    );
};

export default Oppsummering;
