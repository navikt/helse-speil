import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Lenke from 'nav-frontend-lenker';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';

import { Flex } from '../../../../components/Flex';
import { usePerson, usePersondataSkalAnonymiseres } from '../../../../state/person';
import { useAktivVedtaksperiode } from '../../../../state/tidslinje';
import { somPenger } from '../../../../utils/locale';

import { SimuleringsinfoModal } from './SimuleringsinfoModal';
import { Utbetaling } from './utbetaling/Utbetaling';

const Infogruppe = styled.section`
    line-height: 22px;
`;

const StyledLenke = styled(Lenke)`
    margin-bottom: 1.5rem;
`;

const Simuleringsfeilmelding = styled(Feilmelding)`
    margin-bottom: 1rem;
`;

const Sykepengegrunnlagslenke = styled(Link)`
    color: var(--navds-color-text-primary);

    &:hover {
        text-decoration: none;
    }

    &:active,
    &:focus-visible {
        outline: none;
        color: var(--navds-color-text-inverse);
        text-decoration: none;
        background-color: var(--navds-text-focus);
        box-shadow: 0 0 0 2px var(--navds-text-focus);
    }
`;

const Beløp = styled(Normaltekst)<{ beløp: number }>`
    color: ${({ beløp }) => (beløp >= 0 ? `var(--navds-color-text-primary)` : `var(--navds-color-text-error)`)};
    font-style: ${({ beløp }) => (beløp >= 0 ? `normal` : `italic`)};
`;

const Oppsummering = () => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const personTilBehandling = usePerson();
    const { t } = useTranslation();
    const [åpen, setÅpen] = useState(false);
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();

    if (!aktivVedtaksperiode) return null;

    const { oppsummering, inntektsgrunnlag, simuleringsdata } = aktivVedtaksperiode;

    return (
        <>
            <Infogruppe>
                <Flex justifyContent="space-between">
                    <Sykepengegrunnlagslenke to={`${personTilBehandling?.aktørId}/../sykepengegrunnlag`}>
                        {t('oppsummering.sykepengegrunnlag')}
                    </Sykepengegrunnlagslenke>
                    <Normaltekst>{somPenger(inntektsgrunnlag.sykepengegrunnlag)}</Normaltekst>
                </Flex>
                <Flex justifyContent="space-between">
                    <Normaltekst>{t('oppsummering.antall_utbetalingsdager')}</Normaltekst>
                    <Normaltekst>{oppsummering.antallUtbetalingsdager}</Normaltekst>
                </Flex>
                <Flex justifyContent="space-between">
                    <Normaltekst>{t('oppsummering.beløp')}</Normaltekst>
                    <Beløp beløp={oppsummering.totaltTilUtbetaling}>
                        {oppsummering.totaltTilUtbetaling !== 0
                            ? somPenger(oppsummering.totaltTilUtbetaling)
                            : 'Ingen utbetaling'}
                    </Beløp>
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
                <SimuleringsinfoModal
                    simulering={simuleringsdata}
                    åpenModal={åpen}
                    lukkModal={() => setÅpen(false)}
                    anonymiseringEnabled={anonymiseringEnabled}
                />
            )}
        </>
    );
};

export default Oppsummering;
