import React from 'react';
import { StyledUbehandletInnhold, YrkesskadeContainer } from './Inngangsvilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import { FlexColumn } from '../../components/FlexColumn';

interface UbehandletVedtaksperiodeProps {
    vedtaksperiode: Vedtaksperiode;
}

const UbehandletVedtaksperiode = ({ vedtaksperiode }: UbehandletVedtaksperiodeProps) => {
    const { inngangsvilkår, sykepengegrunnlag } = vedtaksperiode;

    return (
        <>
            <StyledUbehandletInnhold kolonner={2}>
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
            </StyledUbehandletInnhold>
            <YrkesskadeContainer>
                <Vilkårsgruppe tittel="Yrkesskade må vurderes manuelt" ikontype="advarsel" />
            </YrkesskadeContainer>
        </>
    );
};

export default UbehandletVedtaksperiode;
