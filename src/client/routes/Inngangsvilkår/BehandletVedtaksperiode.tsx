import React from 'react';
import { StyledBehandletInnhold, YrkesskadeContainer } from './Inngangsvilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import dayjs from 'dayjs';
import { FlexColumn } from '../../components/FlexColumn';
import styled from '@emotion/styled';
import Grid from '../../components/Grid';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';

interface BehandletVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

const Innhold = styled(Grid)`
    margin-top: 2rem;
`;

const BehandletVedtaksperiode = ({
    aktivVedtaksperiode,
    førsteVedtaksperiode
}: BehandletVedtaksperiodeProps) => {
    const førsteFraværsdag = dayjs(
        førsteVedtaksperiode.inngangsvilkår.dagerIgjen.førsteFraværsdag
    ).format('DD.MM.YYYY');

    return (
        <>
            <StyledBehandletInnhold
                saksbehandler={aktivVedtaksperiode.godkjentAv!}
                tittel={`Inngangsvilkår vurdert første sykdomsdag - ${førsteFraværsdag}`}
                vurderingsdato={
                    førsteVedtaksperiode?.godkjentTidspunkt
                        ? dayjs(førsteVedtaksperiode?.godkjentTidspunkt).format('DD.MM.YYYY')
                        : 'ukjent'
                }
            >
                <Innhold kolonner={2}>
                    <FlexColumn>
                        <Vilkårsgrupper.Arbeidsuførhet />
                        <Vilkårsgrupper.Medlemskap />
                        <Vilkårsgrupper.Alder
                            alder={aktivVedtaksperiode.inngangsvilkår.alderISykmeldingsperioden}
                        />
                        <Vilkårsgrupper.Søknadsfrist
                            innen3Mnd={aktivVedtaksperiode.inngangsvilkår.søknadsfrist.innen3Mnd}
                            sendtNav={aktivVedtaksperiode.inngangsvilkår.søknadsfrist.sendtNav!}
                            sisteSykepengedag={
                                aktivVedtaksperiode.inngangsvilkår.søknadsfrist.søknadTom!
                            }
                        />
                    </FlexColumn>
                    <FlexColumn>
                        {førsteVedtaksperiode.inngangsvilkår.opptjening ? (
                            <Vilkårsgrupper.Opptjeningstid
                                harOpptjening={
                                    førsteVedtaksperiode.inngangsvilkår.opptjening.harOpptjening
                                }
                                førsteFraværsdag={
                                    førsteVedtaksperiode.inngangsvilkår.dagerIgjen.førsteFraværsdag
                                }
                                fom={førsteVedtaksperiode.inngangsvilkår.opptjening.opptjeningFra}
                                antallOpptjeningsdagerErMinst={
                                    førsteVedtaksperiode.inngangsvilkår.opptjening
                                        .antallOpptjeningsdagerErMinst
                                }
                            />
                        ) : (
                            <Vilkårsgruppe
                                tittel="Opptjening må vurderes manuelt"
                                ikontype="advarsel"
                                paragraf="§8-2"
                            />
                        )}
                        <Vilkårsgrupper.KravTilSykepengegrunnlag
                            sykepengegrunnlag={
                                aktivVedtaksperiode.sykepengegrunnlag.årsinntektFraInntektsmelding!
                            }
                        />
                        <Vilkårsgrupper.DagerIgjen
                            førsteFraværsdag={
                                aktivVedtaksperiode.inngangsvilkår.dagerIgjen.førsteFraværsdag
                            }
                            førsteSykepengedag={
                                aktivVedtaksperiode.inngangsvilkår.dagerIgjen.førsteSykepengedag
                            }
                            dagerBrukt={aktivVedtaksperiode.inngangsvilkår.dagerIgjen.dagerBrukt}
                            maksdato={aktivVedtaksperiode.inngangsvilkår.dagerIgjen.maksdato}
                        />
                    </FlexColumn>
                </Innhold>
            </StyledBehandletInnhold>
            <YrkesskadeContainer>
                <Vilkårsgruppe tittel="Yrkesskade må vurderes manuelt" ikontype="advarsel" />
            </YrkesskadeContainer>
        </>
    );
};

export default BehandletVedtaksperiode;
