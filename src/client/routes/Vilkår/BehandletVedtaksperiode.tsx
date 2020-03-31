import React from 'react';
import { Strek, StyledBehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgrupper/Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import dayjs from 'dayjs';
import { FlexColumn } from '../../components/FlexColumn';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../utils/date';
import Grid from '../../components/Grid';

interface BehandletVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

const Innhold = styled(Grid)`
    margin-top: 2rem;
`;

const BehandletVedtaksperiode = ({ aktivVedtaksperiode, førsteVedtaksperiode }: BehandletVedtaksperiodeProps) => {
    const førsteFraværsdag =
        førsteVedtaksperiode.vilkår.dagerIgjen?.førsteFraværsdag.format(NORSK_DATOFORMAT) ?? 'Ukjent dato';

    return (
        <>
            <StyledBehandletInnhold
                saksbehandler={aktivVedtaksperiode.godkjentAv!}
                tittel={`Vilkår vurdert første sykdomsdag - ${førsteFraværsdag}`}
                vurderingsdato={
                    førsteVedtaksperiode?.godkjenttidspunkt
                        ? dayjs(førsteVedtaksperiode?.godkjenttidspunkt).format(NORSK_DATOFORMAT)
                        : 'ukjent'
                }
            >
                <Innhold kolonner={2}>
                    <FlexColumn>
                        <Vilkårsgruppe tittel="Arbeidsuførhet" paragraf="§8-4" ikontype="ok" />
                        <Vilkårsgruppe tittel="Medlemskap" paragraf="§2" ikontype="ok" />
                        <Vilkårsgruppe tittel="Medvirkning" paragraf="§8-8" ikontype="ok" />
                        <Vilkårsgrupper.Alder
                            alder={aktivVedtaksperiode.vilkår.alderISykmeldingsperioden}
                            oppfylt={true}
                        />
                        <Vilkårsgrupper.Søknadsfrist
                            innen3Mnd={aktivVedtaksperiode.vilkår.søknadsfrist?.oppfylt}
                            sendtNav={aktivVedtaksperiode.vilkår.søknadsfrist?.sendtNav}
                            sisteSykepengedag={aktivVedtaksperiode.vilkår.søknadsfrist?.søknadTom!}
                            oppfylt={true}
                        />
                    </FlexColumn>
                    <FlexColumn>
                        {førsteVedtaksperiode.vilkår.opptjening ? (
                            <Vilkårsgrupper.Opptjeningstid
                                førsteFraværsdag={førsteVedtaksperiode.vilkår.dagerIgjen?.førsteFraværsdag}
                                opptjeningFra={førsteVedtaksperiode.vilkår.opptjening.opptjeningFra}
                                antallOpptjeningsdagerErMinst={
                                    førsteVedtaksperiode.vilkår.opptjening.antallOpptjeningsdagerErMinst
                                }
                                oppfylt={true}
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
                            oppfylt={true}
                        />
                        <Vilkårsgrupper.DagerIgjen
                            førsteFraværsdag={aktivVedtaksperiode.vilkår.dagerIgjen?.førsteFraværsdag}
                            førsteSykepengedag={aktivVedtaksperiode.vilkår.dagerIgjen?.førsteSykepengedag}
                            dagerBrukt={aktivVedtaksperiode.vilkår.dagerIgjen?.dagerBrukt}
                            maksdato={aktivVedtaksperiode.vilkår.dagerIgjen?.maksdato}
                            oppfylt={true}
                        />
                    </FlexColumn>
                </Innhold>
            </StyledBehandletInnhold>
            <Strek />
        </>
    );
};

export default BehandletVedtaksperiode;
