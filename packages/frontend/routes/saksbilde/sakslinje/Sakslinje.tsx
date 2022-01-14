import styled from '@emotion/styled';
import React from 'react';

import { Flex } from '../../../components/Flex';
import { Location, useNavigation } from '../../../hooks/useNavigation';
import { useVedtaksperiode } from '../../../state/tidslinje';

import { TabLink } from '../TabLink';
import { HistorikkHeader } from '../historikk/HistorikkHeader';
import { Sakslinjemeny, VerktøylinjeForTomtSaksbilde } from './Sakslinjemeny';
import { HjemIkon } from './icons/HjemIkon';

const Container = styled.div`
    grid-area: sakslinje;
    display: flex;
    justify-content: space-between;
    height: 48px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--navds-color-border);
    padding: 0 2rem 0 2rem;

    > div:last-of-type {
        margin-left: 1rem;
    }
`;

const TabList = styled.span`
    display: flex;
`;

interface SakslinjeProps {
    aktivPeriode: TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær;
}

export const Sakslinje = ({ aktivPeriode }: SakslinjeProps) => {
    const { pathForLocation } = useNavigation();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
    const erArbeidsgiverUtenSykefravær = aktivPeriode.tilstand === 'utenSykefravær';
    const kanVises =
        erArbeidsgiverUtenSykefravær ||
        (aktivPeriode as TidslinjeperiodeMedSykefravær).type === 'VEDTAKSPERIODE' ||
        (aktivPeriode as TidslinjeperiodeMedSykefravær).type === 'REVURDERING';

    const kanViseFaresignaler = erArbeidsgiverUtenSykefravær ? false : vedtaksperiode.risikovurdering;

    return (
        <Container className="Sakslinje">
            <Flex>
                {kanVises && (
                    <TabList role="tablist">
                        {!erArbeidsgiverUtenSykefravær && (
                            <>
                                <TabLink to={pathForLocation(Location.Utbetaling)} title="Utbetaling">
                                    Utbetaling
                                </TabLink>
                                <TabLink to={pathForLocation(Location.Inngangsvilkår)} title="Inngangsvilkår">
                                    Inngangsvilkår
                                </TabLink>
                            </>
                        )}
                        <TabLink to={pathForLocation(Location.Sykepengegrunnlag)} title="Sykepengegrunnlag">
                            Sykepengegrunnlag
                        </TabLink>
                        {kanViseFaresignaler && (
                            <TabLink to={pathForLocation(Location.Faresignaler)} title="Faresignaler">
                                Faresignaler
                            </TabLink>
                        )}
                    </TabList>
                )}
                <Sakslinjemeny aktivPeriode={aktivPeriode} />
            </Flex>
            <HistorikkHeader />
        </Container>
    );
};

export const SakslinjeForTomtSaksbilde = () => (
    <Container className="Sakslinje">
        <VerktøylinjeForTomtSaksbilde />
    </Container>
);
