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
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import { FlexColumn } from '../../components/FlexColumn';

interface PåfølgendeVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

const PåfølgendeVedtaksperiode = ({
    aktivVedtaksperiode,
    førsteVedtaksperiode
}: PåfølgendeVedtaksperiodeProps) => {
    const { inngangsvilkår } = aktivVedtaksperiode;
    const førsteFraværsdag = dayjs(
        førsteVedtaksperiode.inngangsvilkår.dagerIgjen.førsteFraværsdag
    ).format('DD.MM.YYYY');

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
                <Vilkårsgruppe
                    tittel="Yrkesskade må vurderes manuelt"
                    paragraf="§8-55"
                    ikontype="advarsel"
                />
            </YrkesskadeContainer>
            <StyledBehandletInnhold
                saksbehandler={førsteVedtaksperiode.godkjentAv!}
                tittel={`Inngangsvilkår vurdert første sykdomsdag - ${førsteFraværsdag}`}
                vurderingsdato={
                    førsteVedtaksperiode.godkjentTidspunkt
                        ? dayjs(førsteVedtaksperiode.godkjentTidspunkt).format('DD.MM.YYYY')
                        : 'ukjent'
                }
            >
                <Vilkårsgrupper.Medlemskap />
                {førsteVedtaksperiode.inngangsvilkår.opptjening ? (
                    <Vilkårsgrupper.Opptjeningstid
                        harOpptjening={førsteVedtaksperiode.inngangsvilkår.opptjening.harOpptjening}
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
                        førsteVedtaksperiode.sykepengegrunnlag.årsinntektFraInntektsmelding!
                    }
                />
            </StyledBehandletInnhold>
        </>
    );
};

export default PåfølgendeVedtaksperiode;
