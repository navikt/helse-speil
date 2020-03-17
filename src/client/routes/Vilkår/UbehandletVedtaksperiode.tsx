import React from 'react';
import { StyledUbehandletInnhold, YrkesskadeContainer } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import { FlexColumn } from '../../components/FlexColumn';

interface UbehandletVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
}

const UbehandletVedtaksperiode = ({ aktivVedtaksperiode }: UbehandletVedtaksperiodeProps) => {
    const { vilkår, sykepengegrunnlag } = aktivVedtaksperiode;

    return (
        <>
            <StyledUbehandletInnhold kolonner={2}>
                <FlexColumn>
                    <Vilkårsgrupper.Arbeidsuførhet />
                    <Vilkårsgrupper.Medlemskap />
                    <Vilkårsgrupper.Alder alder={vilkår.alderISykmeldingsperioden} />
                    <Vilkårsgrupper.Søknadsfrist
                        innen3Mnd={vilkår.søknadsfrist.innen3Mnd}
                        sendtNav={vilkår.søknadsfrist.sendtNav!}
                        sisteSykepengedag={vilkår.søknadsfrist.søknadTom!}
                    />
                </FlexColumn>
                <FlexColumn>
                    {vilkår.opptjening ? (
                        <Vilkårsgrupper.Opptjeningstid
                            harOpptjening={vilkår.opptjening.harOpptjening}
                            førsteFraværsdag={vilkår.dagerIgjen.førsteFraværsdag}
                            opptjeningFra={vilkår.opptjening.opptjeningFra}
                            antallOpptjeningsdagerErMinst={vilkår.opptjening.antallOpptjeningsdagerErMinst}
                        />
                    ) : (
                        <Vilkårsgruppe tittel="Opptjening må vurderes manuelt" ikontype="advarsel" paragraf="§8-2" />
                    )}
                    <Vilkårsgrupper.KravTilSykepengegrunnlag
                        sykepengegrunnlag={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                    />
                    <Vilkårsgrupper.DagerIgjen
                        førsteFraværsdag={vilkår.dagerIgjen.førsteFraværsdag}
                        førsteSykepengedag={vilkår.dagerIgjen.førsteSykepengedag}
                        dagerBrukt={vilkår.dagerIgjen.dagerBrukt}
                        maksdato={vilkår.dagerIgjen.maksdato}
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
