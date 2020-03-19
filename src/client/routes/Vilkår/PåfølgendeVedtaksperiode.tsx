import React from 'react';
import { StyledBehandletInnhold, StyledUbehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgrupper';
import { Vedtaksperiode } from '../../context/types';
import dayjs from 'dayjs';
import { FlexColumn } from '../../components/FlexColumn';
import TwoColumnGrid from '../../components/TwoColumnGrid';
import { Strek } from './Vilkår';
import { NORSK_DATOFORMAT } from '../../utils/date';
import VurderteVilkår from './Vilkårsgrupper/VurderteVilkår';

interface PåfølgendeVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

const PåfølgendeVedtaksperiode = ({ aktivVedtaksperiode, førsteVedtaksperiode }: PåfølgendeVedtaksperiodeProps) => {
    const { vilkår } = aktivVedtaksperiode;
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
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.DagerIgjen
                        førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
                        førsteSykepengedag={vilkår.dagerIgjen?.førsteSykepengedag}
                        dagerBrukt={vilkår.dagerIgjen?.dagerBrukt}
                        maksdato={vilkår.dagerIgjen?.maksdato}
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
                        ? dayjs(førsteVedtaksperiode.godkjenttidspunkt).format(NORSK_DATOFORMAT)
                        : 'ukjent'
                }
            >
                <TwoColumnGrid firstColumnWidth={'35rem'}>
                    <FlexColumn>
                        {førsteVedtaksperiode.vilkår.opptjening ? (
                            <Vilkårsgrupper.Opptjeningstid
                                harOpptjening={førsteVedtaksperiode.vilkår.opptjening.harOpptjening}
                                førsteFraværsdag={førsteVedtaksperiode.vilkår.dagerIgjen?.førsteFraværsdag}
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
                    </FlexColumn>
                    <FlexColumn>
                        <Vilkårsgrupper.KravTilSykepengegrunnlag
                            sykepengegrunnlag={førsteVedtaksperiode.sykepengegrunnlag.årsinntektFraInntektsmelding!}
                        />
                    </FlexColumn>
                </TwoColumnGrid>
            </StyledBehandletInnhold>
        </>
    );
};

export default PåfølgendeVedtaksperiode;
