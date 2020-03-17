import React from 'react';
import { StyledBehandletInnhold, StyledUbehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import dayjs from 'dayjs';
import { FlexColumn } from '../../components/FlexColumn';

interface PåfølgendeVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

const PåfølgendeVedtaksperiode = ({ aktivVedtaksperiode, førsteVedtaksperiode }: PåfølgendeVedtaksperiodeProps) => {
    const { vilkår } = aktivVedtaksperiode;
    const førsteFraværsdag = dayjs(førsteVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag).format('DD.MM.YYYY');

    return (
        <>
            <StyledUbehandletInnhold kolonner={2}>
                <FlexColumn>
                    <Vilkårsgrupper.Arbeidsuførhet />
                    <Vilkårsgrupper.DagerIgjen
                        førsteFraværsdag={vilkår.dagerIgjen.førsteFraværsdag}
                        førsteSykepengedag={vilkår.dagerIgjen.førsteSykepengedag}
                        dagerBrukt={vilkår.dagerIgjen.dagerBrukt}
                        maksdato={vilkår.dagerIgjen.maksdato}
                    />
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.Alder alder={vilkår.alderISykmeldingsperioden} />
                    <Vilkårsgrupper.Søknadsfrist
                        innen3Mnd={vilkår.søknadsfrist.innen3Mnd}
                        sendtNav={vilkår.søknadsfrist.sendtNav!}
                        sisteSykepengedag={vilkår.søknadsfrist.søknadTom!}
                    />
                </FlexColumn>
            </StyledUbehandletInnhold>
            <StyledBehandletInnhold
                saksbehandler={førsteVedtaksperiode.godkjentAv!}
                tittel={`Vilkår vurdert første sykdomsdag - ${førsteFraværsdag}`}
                vurderingsdato={
                    førsteVedtaksperiode.godkjentTidspunkt
                        ? dayjs(førsteVedtaksperiode.godkjentTidspunkt).format('DD.MM.YYYY')
                        : 'ukjent'
                }
            >
                <Vilkårsgrupper.Medlemskap />
                {førsteVedtaksperiode.vilkår.opptjening ? (
                    <Vilkårsgrupper.Opptjeningstid
                        harOpptjening={førsteVedtaksperiode.vilkår.opptjening.harOpptjening}
                        førsteFraværsdag={førsteVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag}
                        opptjeningFra={førsteVedtaksperiode.vilkår.opptjening.opptjeningFra}
                        antallOpptjeningsdagerErMinst={
                            førsteVedtaksperiode.vilkår.opptjening.antallOpptjeningsdagerErMinst
                        }
                    />
                ) : (
                    <Vilkårsgruppe tittel="Opptjening må vurderes manuelt" ikontype="advarsel" paragraf="§8-2" />
                )}
                <Vilkårsgrupper.KravTilSykepengegrunnlag
                    sykepengegrunnlag={førsteVedtaksperiode.sykepengegrunnlag.årsinntektFraInntektsmelding!}
                />
            </StyledBehandletInnhold>
        </>
    );
};

export default PåfølgendeVedtaksperiode;
