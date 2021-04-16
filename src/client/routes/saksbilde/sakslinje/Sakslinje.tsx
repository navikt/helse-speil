import React from 'react';
import styled from '@emotion/styled';
import { Verktøylinje } from './Verktøylinje';
import { TabLink } from '../TabLink';
import { Location, useNavigation } from '../../../hooks/useNavigation';
import { Infolinje } from './Infolinje';
import { HjemIkon } from './icons/HjemIkon';
import { Dayjs } from 'dayjs';

const Container = styled.div`
    height: 74px;
    border-bottom: 1px solid var(--navds-color-border);
    display: flex;
    flex: 1;
    padding: 0 2.5rem 0 2rem;
`;

const TabList = styled.span`
    display: flex;
`;

interface SakslinjeProps {
    aktivVedtaksperiode: Boolean;
    arbeidsgivernavn?: string;
    arbeidsgiverOrgnr?: string;
    fom?: Dayjs;
    tom?: Dayjs;
    skjæringstidspunkt?: Dayjs;
    maksdato?: Dayjs;
    over67År?: boolean;
}

export const Sakslinje = ({
    aktivVedtaksperiode,
    arbeidsgivernavn,
    arbeidsgiverOrgnr,
    fom,
    tom,
    skjæringstidspunkt,
    maksdato,
    over67År,
}: SakslinjeProps) => {
    const { pathForLocation } = useNavigation();

    return (
        <Container>
            <TabList role="tablist">
                <TabLink
                    disabled={!aktivVedtaksperiode}
                    to={pathForLocation(Location.Utbetaling)}
                    title="Utbetaling"
                    icon={<HjemIkon />}
                >
                    Utbetaling
                </TabLink>
                <TabLink
                    disabled={!aktivVedtaksperiode}
                    to={pathForLocation(Location.Sykmeldingsperiode)}
                    title="Smperiode"
                >
                    Smperiode
                </TabLink>
                <TabLink disabled={!aktivVedtaksperiode} to={pathForLocation(Location.Vilkår)} title="Vilkår">
                    Vilkår
                </TabLink>
                <TabLink
                    disabled={!aktivVedtaksperiode}
                    to={pathForLocation(Location.Sykepengegrunnlag)}
                    title="Spgrunnlag"
                >
                    Spgrunnlag
                </TabLink>
                <TabLink
                    disabled={!aktivVedtaksperiode}
                    to={pathForLocation(Location.Faresignaler)}
                    title="Faresignaler"
                >
                    Faresignaler
                </TabLink>
            </TabList>
            <Verktøylinje />
            {
                <Infolinje
                    arbeidsgivernavn={arbeidsgivernavn}
                    arbeidsgiverOrgnr={arbeidsgiverOrgnr}
                    fom={fom}
                    tom={tom}
                    skjæringstidspunkt={skjæringstidspunkt}
                    maksdato={maksdato}
                    over67År={over67År}
                />
            }
        </Container>
    );
};
