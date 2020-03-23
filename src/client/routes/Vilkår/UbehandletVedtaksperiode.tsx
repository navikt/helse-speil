import React from 'react';
import { StyledUbehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgrupper/Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import { FlexColumn } from '../../components/FlexColumn';
import VurderteVilkår from './Vilkårsgrupper/VurderteVilkår';

interface UbehandletVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
}

const UbehandletVedtaksperiode = ({ aktivVedtaksperiode }: UbehandletVedtaksperiodeProps) => {
    const { vilkår, sykepengegrunnlag } = aktivVedtaksperiode;

    return (
        <>
            <VurderteVilkår />
            <StyledUbehandletInnhold>
                <FlexColumn>
                    <Vilkårsgrupper.Alder alder={vilkår.alderISykmeldingsperioden} />
                    <Vilkårsgrupper.Søknadsfrist
                        innen3Mnd={vilkår.søknadsfrist?.innen3Mnd}
                        sendtNav={vilkår.søknadsfrist?.sendtNav!}
                        sisteSykepengedag={vilkår.søknadsfrist?.søknadTom!}
                    />
                    {vilkår.opptjening ? (
                        <Vilkårsgrupper.Opptjeningstid
                            harOpptjening={vilkår.opptjening.harOpptjening}
                            førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
                            opptjeningFra={vilkår.opptjening.opptjeningFra}
                            antallOpptjeningsdagerErMinst={vilkår.opptjening.antallOpptjeningsdagerErMinst}
                        />
                    ) : (
                        <Vilkårsgruppe tittel="Opptjening må vurderes manuelt" ikontype="advarsel" paragraf="§8-2" />
                    )}
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.KravTilSykepengegrunnlag
                        sykepengegrunnlag={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                    />
                    <Vilkårsgrupper.DagerIgjen
                        førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
                        førsteSykepengedag={vilkår.dagerIgjen?.førsteSykepengedag}
                        dagerBrukt={vilkår.dagerIgjen?.dagerBrukt}
                        maksdato={vilkår.dagerIgjen?.maksdato}
                    />
                </FlexColumn>
            </StyledUbehandletInnhold>
        </>
    );
};

export default UbehandletVedtaksperiode;
