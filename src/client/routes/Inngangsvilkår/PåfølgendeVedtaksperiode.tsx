import React from 'react';
import {
    StyledBehandletInnhold,
    StyledUbehandletInnhold,
    YrkesskadeContainer
} from './Inngangsvilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import dayjs from 'dayjs';
import { useFørsteVedtaksperiode } from '../../hooks/useFørsteVedtaksperiode';
import { FlexColumn } from '../../components/FlexColumn';

interface PåfølgendeVedtaksperiodeProps {
    vedtaksperiode: Vedtaksperiode;
}

const PåfølgendeVedtaksperiode = ({ vedtaksperiode }: PåfølgendeVedtaksperiodeProps) => {
    const { inngangsvilkår, sykepengegrunnlag } = vedtaksperiode;
    const førsteFraværsdag = dayjs(inngangsvilkår.dagerIgjen.førsteFraværsdag).format('DD.MM.YYYY');
    const førsteVedtaksperiode = useFørsteVedtaksperiode({ nåværendePeriode: vedtaksperiode });

    return (
        <>
            <StyledUbehandletInnhold kolonner={2}>
                <FlexColumn>
                    <Vilkårsgrupper.Arbeidsuførhet />
                    <Vilkårsgrupper.DagerIgjen
                        førsteFraværsdag={inngangsvilkår.dagerIgjen.førsteFraværsdag}
                        førsteSykepengedag={inngangsvilkår.dagerIgjen.førsteSykepengedag}
                        dagerBrukt={inngangsvilkår.dagerIgjen.dagerBrukt}
                        maksdato={inngangsvilkår.dagerIgjen.maksdato}
                    />
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.Alder alder={inngangsvilkår.alderISykmeldingsperioden} />
                    <Vilkårsgrupper.Søknadsfrist
                        innen3Mnd={inngangsvilkår.søknadsfrist.innen3Mnd}
                        sendtNav={inngangsvilkår.søknadsfrist.sendtNav!}
                        sisteSykepengedag={inngangsvilkår.søknadsfrist.søknadTom!}
                    />
                </FlexColumn>
            </StyledUbehandletInnhold>
            <YrkesskadeContainer>
                <Vilkårsgruppe tittel="Yrkesskade må vurderes manuelt" ikontype="advarsel" />
            </YrkesskadeContainer>
            <StyledBehandletInnhold
                saksbehandler={førsteVedtaksperiode!.godkjentAv!}
                tittel={`Inngangsvilkår vurdert første sykdomsdag - ${førsteFraværsdag}`}
                vurderingsdato={dayjs(førsteVedtaksperiode!.godkjentTidspunkt).format('DD.MM.YYYY')}
            >
                <Vilkårsgrupper.Medlemskap />
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
            </StyledBehandletInnhold>
        </>
    );
};

export default PåfølgendeVedtaksperiode;
