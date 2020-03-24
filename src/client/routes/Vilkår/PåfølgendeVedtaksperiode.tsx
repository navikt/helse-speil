import React from 'react';
import { Strek, StyledBehandletInnhold, StyledUbehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgrupper';
import { Vedtaksperiode } from '../../context/types';
import { FlexColumn } from '../../components/FlexColumn';
import TwoColumnGrid from '../../components/TwoColumnGrid';
import { NORSK_DATOFORMAT } from '../../utils/date';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';
import Vilkårstittel from './Vilkårstittel';
import styled from '@emotion/styled';

interface PåfølgendeVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

const VurderteVilkårstittel = styled(Vilkårstittel)`
    margin-top: 2rem;
    margin-left: 2rem;
`;

const PåfølgendeVedtaksperiode = ({ aktivVedtaksperiode, førsteVedtaksperiode }: PåfølgendeVedtaksperiodeProps) => {
    const { vilkår } = aktivVedtaksperiode;
    return (
        <>
            <VurderteVilkårstittel størrelse="m" ikon={<GrøntSjekkikon />}>
                Vurderte vilkår
            </VurderteVilkårstittel>
            <StyledUbehandletInnhold firstColumnWidth={'37rem'}>
                <FlexColumn>
                    <Vilkårsgrupper.Alder alder={vilkår.alderISykmeldingsperioden} oppfylt={true} />
                    <Vilkårsgrupper.Søknadsfrist
                        innen3Mnd={vilkår.søknadsfrist?.innen3Mnd}
                        sendtNav={vilkår.søknadsfrist?.sendtNav!}
                        sisteSykepengedag={vilkår.søknadsfrist?.søknadTom!}
                        oppfylt={true}
                    />
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.DagerIgjen
                        førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
                        førsteSykepengedag={vilkår.dagerIgjen?.førsteSykepengedag}
                        dagerBrukt={vilkår.dagerIgjen?.dagerBrukt}
                        maksdato={vilkår.dagerIgjen?.maksdato}
                        oppfylt={true}
                    />
                </FlexColumn>
            </StyledUbehandletInnhold>
            <Strek />
            <StyledBehandletInnhold
                saksbehandler={førsteVedtaksperiode.godkjentAv!}
                tittel={`Vilkår vurdert første sykdomsdag - ${førsteVedtaksperiode.vilkår.dagerIgjen?.førsteFraværsdag.format(
                    NORSK_DATOFORMAT
                ) ?? 'Ikke funnet'}`}
                vurderingsdato={
                    førsteVedtaksperiode.godkjenttidspunkt
                        ? førsteVedtaksperiode.godkjenttidspunkt.format(NORSK_DATOFORMAT)
                        : 'ukjent'
                }
            >
                <TwoColumnGrid firstColumnWidth={'35rem'}>
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
                    </FlexColumn>
                    <FlexColumn>
                        <Vilkårsgrupper.KravTilSykepengegrunnlag
                            sykepengegrunnlag={førsteVedtaksperiode.sykepengegrunnlag.årsinntektFraInntektsmelding!}
                            oppfylt={true}
                        />
                    </FlexColumn>
                </TwoColumnGrid>
            </StyledBehandletInnhold>
            <Strek />
        </>
    );
};

export default PåfølgendeVedtaksperiode;
