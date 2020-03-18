import React from 'react';
import { StyledBehandletInnhold, StyledUbehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types';
import dayjs from 'dayjs';
import { FlexColumn } from '../../components/FlexColumn';
import { Deloverskrift, Overskrift } from './components';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';
import './PåfølgendeVedtaksperiode.less';
import Grid from '../../components/Grid';

interface PåfølgendeVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

const PåfølgendeVedtaksperiode = ({ aktivVedtaksperiode, førsteVedtaksperiode }: PåfølgendeVedtaksperiodeProps) => {
    const { vilkår } = aktivVedtaksperiode;
    const førsteFraværsdag = dayjs(førsteVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag).format('DD.MM.YYYY');

    return (
        <>
            <Overskrift>
                <Deloverskrift tittel="Vurderte vilkår" ikon={<GrøntSjekkikon />} />
            </Overskrift>
            <StyledUbehandletInnhold className="understrek" kolonner={2}>
                <FlexColumn>
                    <Vilkårsgrupper.Alder alder={vilkår.alderISykmeldingsperioden} />
                    <Vilkårsgrupper.Søknadsfrist
                        innen3Mnd={vilkår.søknadsfrist.innen3Mnd}
                        sendtNav={vilkår.søknadsfrist.sendtNav!}
                        sisteSykepengedag={vilkår.søknadsfrist.søknadTom!}
                    />
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.DagerIgjen
                        førsteFraværsdag={vilkår.dagerIgjen.førsteFraværsdag}
                        førsteSykepengedag={vilkår.dagerIgjen.førsteSykepengedag}
                        dagerBrukt={vilkår.dagerIgjen.dagerBrukt}
                        maksdato={vilkår.dagerIgjen.maksdato}
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
                <Grid kolonner={2}>
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
                    </FlexColumn>
                    <FlexColumn>
                        <Vilkårsgrupper.KravTilSykepengegrunnlag
                            sykepengegrunnlag={førsteVedtaksperiode.sykepengegrunnlag.årsinntektFraInntektsmelding!}
                        />
                    </FlexColumn>
                </Grid>
            </StyledBehandletInnhold>
        </>
    );
};

export default PåfølgendeVedtaksperiode;
