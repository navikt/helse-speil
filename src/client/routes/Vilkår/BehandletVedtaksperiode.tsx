import React from 'react';
import { StyledBehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import dayjs from 'dayjs';
import { FlexColumn } from '../../components/FlexColumn';
import styled from '@emotion/styled';
import TwoColumnGrid from '../../components/TwoColumnGrid';

interface BehandletVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

const Innhold = styled(TwoColumnGrid)`
    margin-top: 2rem;
`;

const BehandletVedtaksperiode = ({ aktivVedtaksperiode, førsteVedtaksperiode }: BehandletVedtaksperiodeProps) => {
    const førsteFraværsdag = dayjs(førsteVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag).format('DD.MM.YYYY');

    return (
        <>
            <StyledBehandletInnhold
                saksbehandler={aktivVedtaksperiode.godkjentAv!}
                tittel={`Vilkår vurdert første sykdomsdag - ${førsteFraværsdag}`}
                vurderingsdato={
                    førsteVedtaksperiode?.godkjentTidspunkt
                        ? dayjs(førsteVedtaksperiode?.godkjentTidspunkt).format('DD.MM.YYYY')
                        : 'ukjent'
                }
            >
                <Innhold firstColumnWidth={'35rem'}>
                    <FlexColumn>
                        <Vilkårsgruppe tittel="Arbeidsuførhet" paragraf="§8-4" ikontype="ok" />
                        <Vilkårsgruppe tittel="Medlemskap" paragraf="§2" ikontype="ok" />
                        <Vilkårsgruppe tittel="Medvirkning" paragraf="§8-8" ikontype="ok" />
                        <Vilkårsgrupper.Alder alder={aktivVedtaksperiode.vilkår.alderISykmeldingsperioden} />
                        <Vilkårsgrupper.Søknadsfrist
                            innen3Mnd={aktivVedtaksperiode.vilkår.søknadsfrist.innen3Mnd}
                            sendtNav={aktivVedtaksperiode.vilkår.søknadsfrist.sendtNav!}
                            sisteSykepengedag={aktivVedtaksperiode.vilkår.søknadsfrist.søknadTom!}
                        />
                    </FlexColumn>
                    <FlexColumn>
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
                            <Vilkårsgruppe
                                tittel="Opptjening må vurderes manuelt"
                                ikontype="advarsel"
                                paragraf="§8-2"
                            />
                        )}
                        <Vilkårsgrupper.KravTilSykepengegrunnlag
                            sykepengegrunnlag={aktivVedtaksperiode.sykepengegrunnlag.årsinntektFraInntektsmelding!}
                        />
                        <Vilkårsgrupper.DagerIgjen
                            førsteFraværsdag={aktivVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag}
                            førsteSykepengedag={aktivVedtaksperiode.vilkår.dagerIgjen.førsteSykepengedag}
                            dagerBrukt={aktivVedtaksperiode.vilkår.dagerIgjen.dagerBrukt}
                            maksdato={aktivVedtaksperiode.vilkår.dagerIgjen.maksdato}
                        />
                    </FlexColumn>
                </Innhold>
            </StyledBehandletInnhold>
        </>
    );
};

export default BehandletVedtaksperiode;
