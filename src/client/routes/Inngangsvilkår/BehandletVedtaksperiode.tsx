import React from 'react';
import { FlexColumn, StyledBehandletInnhold, YrkesskadeContainer } from './Inngangsvilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import Grid from '../../components/Grid';
import dayjs from 'dayjs';

interface BehandletVedtaksperiodeProps {
    vedtaksperiode: Vedtaksperiode;
}

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
                <Grid kolonner={2}>
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
                </Grid>
            </StyledBehandletInnhold>
            <YrkesskadeContainer>
                <Vilkårsgruppe tittel="Yrkesskade må vurderes manuelt" ikontype="advarsel" />
            </YrkesskadeContainer>
        </>
    );
};

export default BehandletVedtaksperiode;
