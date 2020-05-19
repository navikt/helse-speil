import React from 'react';
import { Strek, StyledBehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgrupper/Vilkårsgruppe';
import { Vedtaksperiode } from '../../context/types.internal';
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
        førsteVedtaksperiode.vilkår?.dagerIgjen?.førsteFraværsdag.format(NORSK_DATOFORMAT) ?? 'Ukjent dato';

    const vilkår = aktivVedtaksperiode.vilkår!!;

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
                        <Vilkårsgrupper.Alder {...vilkår.alder} />
                        <Vilkårsgrupper.Søknadsfrist {...vilkår.søknadsfrist} />
                    </FlexColumn>
                    <FlexColumn>
                        {vilkår.opptjening ? (
                            <Vilkårsgrupper.Opptjeningstid
                                opptjeningVilkår={vilkår.opptjening}
                                førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
                            />
                        ) : (
                            <Vilkårsgruppe
                                tittel="Opptjening må vurderes manuelt"
                                ikontype="advarsel"
                                paragraf="§8-2"
                            />
                        )}
                        <Vilkårsgrupper.KravTilSykepengegrunnlag
                            sykepengegrunnlagVilkår={vilkår.sykepengegrunnlag!}
                            alderSisteSykedag={vilkår.alder.alderSisteSykedag}
                        />
                        <Vilkårsgrupper.DagerIgjen {...vilkår.dagerIgjen!} />
                    </FlexColumn>
                </Innhold>
            </StyledBehandletInnhold>
            <Strek />
        </>
    );
};

export default BehandletVedtaksperiode;
