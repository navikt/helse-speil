import React from 'react';
import { StyledBehandletInnhold, YrkesskadeContainer } from './Inngangsvilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import dayjs from 'dayjs';
import { FlexColumn } from '../../components/FlexColumn';
import styled from '@emotion/styled';
import Grid from '../../components/Grid';

interface BehandletVedtaksperiodeProps {
    vedtaksperiode: Vedtaksperiode;
}

const Innhold = styled(Grid)`
    margin-top: 2rem;
`;

const BehandletVedtaksperiode = ({ vedtaksperiode }: BehandletVedtaksperiodeProps) => {
    const { godkjentAv, godkjentTidspunkt, inngangsvilkår, sykepengegrunnlag } = vedtaksperiode;

    const førsteFraværsdag = dayjs(inngangsvilkår.dagerIgjen.førsteFraværsdag).format('DD.MM.YYYY');

    return (
        <>
            <StyledBehandletInnhold
                saksbehandler={godkjentAv!}
                tittel={`Inngangsvilkår vurdert første sykdomsdag - ${førsteFraværsdag}`}
                vurderingsdato={dayjs(godkjentTidspunkt).format('DD.MM.YYYY')}
            >
                <Innhold kolonner={2}>
                    <FlexColumn>
                        <Vilkårsgrupper.Arbeidsuførhet />
                        <Vilkårsgrupper.Medlemskap />
                        <Vilkårsgrupper.Alder alder={inngangsvilkår.alderISykmeldingsperioden} />
                        <Vilkårsgrupper.Søknadsfrist
                            innen3Mnd={inngangsvilkår.søknadsfrist.innen3Mnd}
                            sendtNav={inngangsvilkår.søknadsfrist.sendtNav!}
                            sisteSykepengedag={inngangsvilkår.søknadsfrist.søknadTom!}
                        />
                    </FlexColumn>
                    <FlexColumn>
                        {inngangsvilkår.opptjening ? (
                            <Vilkårsgrupper.Opptjeningstid
                                harOpptjening={inngangsvilkår.opptjening.harOpptjening}
                                førsteFraværsdag={inngangsvilkår.dagerIgjen.førsteFraværsdag}
                                fom={inngangsvilkår.opptjening.opptjeningFra}
                                antallOpptjeningsdagerErMinst={
                                    inngangsvilkår.opptjening.antallOpptjeningsdagerErMinst
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
                            sykepengegrunnlag={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                        />
                        <Vilkårsgrupper.DagerIgjen
                            førsteFraværsdag={inngangsvilkår.dagerIgjen.førsteFraværsdag}
                            førsteSykepengedag={inngangsvilkår.dagerIgjen.førsteSykepengedag}
                            dagerBrukt={inngangsvilkår.dagerIgjen.dagerBrukt}
                            maksdato={inngangsvilkår.dagerIgjen.maksdato}
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
