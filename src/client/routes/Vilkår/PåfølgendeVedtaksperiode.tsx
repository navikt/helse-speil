import React, { ReactNode } from 'react';
import { Strek, StyledBehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgrupper';
import { Vedtaksperiode } from '../../context/types';
import { FlexColumn } from '../../components/FlexColumn';
import TwoColumnGrid from '../../components/TwoColumnGrid';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Dayjs } from 'dayjs';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';
import Vilkårsvisning from './Vilkårsvisning';
import Feilikon from '../../components/Ikon/Feilikon';
import IkkeVurderteVilkår from './Vilkårsgrupper/IkkeVurderteVilkår';

const formatterDato = (dato?: Dayjs) => dato?.format(NORSK_DATOFORMAT) ?? 'Dato ikke funnet';

interface FerdigbehandledeVilkårProps {
    vedtaksperiode: Vedtaksperiode;
}

const FerdigbehandledeVilkår = ({ vedtaksperiode }: FerdigbehandledeVilkårProps) => (
    <>
        <StyledBehandletInnhold
            saksbehandler={vedtaksperiode.godkjentAv!}
            tittel={`Vilkår vurdert første sykdomsdag - ${formatterDato(
                vedtaksperiode.vilkår.dagerIgjen?.førsteFraværsdag
            )}`}
            vurderingsdato={formatterDato(vedtaksperiode.godkjenttidspunkt)}
        >
            <TwoColumnGrid firstColumnWidth={'35rem'}>
                <FlexColumn>
                    <OptionalOpptjeningstid vedtaksperiode={vedtaksperiode} />
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.KravTilSykepengegrunnlag
                        sykepengegrunnlag={vedtaksperiode.sykepengegrunnlag.årsinntektFraInntektsmelding!}
                        oppfylt={true}
                    />
                </FlexColumn>
            </TwoColumnGrid>
        </StyledBehandletInnhold>
    </>
);

interface OpptionalOpptjeningstidProps {
    vedtaksperiode: Vedtaksperiode;
}

const OptionalOpptjeningstid = ({ vedtaksperiode }: OpptionalOpptjeningstidProps) =>
    vedtaksperiode.vilkår.opptjening ? (
        <Vilkårsgrupper.Opptjeningstid
            førsteFraværsdag={vedtaksperiode.vilkår.dagerIgjen?.førsteFraværsdag}
            opptjeningFra={vedtaksperiode.vilkår.opptjening.opptjeningFra}
            antallOpptjeningsdagerErMinst={vedtaksperiode.vilkår.opptjening.antallOpptjeningsdagerErMinst}
            oppfylt={true}
        />
    ) : (
        <Vilkårsgruppe tittel="Opptjening må vurderes manuelt" ikontype="advarsel" paragraf="§8-2" />
    );

interface PåfølgendeVedtaksperiodeProps {
    førsteVedtaksperiode: Vedtaksperiode;
    ikkeOppfylteVilkår: ReactNode[];
    oppfylteVilkår: ReactNode[];
}

const PåfølgendeVedtaksperiode = ({
    førsteVedtaksperiode,
    ikkeOppfylteVilkår,
    oppfylteVilkår
}: PåfølgendeVedtaksperiodeProps) => {
    return (
        <>
            {ikkeOppfylteVilkår.length > 0 && (
                <Vilkårsvisning tittel="Ikke oppfylte vilkår" ikon={<Feilikon />} vilkår={ikkeOppfylteVilkår} />
            )}
            <IkkeVurderteVilkår />
            <Vilkårsvisning tittel="Vurderte vilkår" ikon={<GrøntSjekkikon />} vilkår={oppfylteVilkår} />
            <Strek />
            <FerdigbehandledeVilkår vedtaksperiode={førsteVedtaksperiode} />
            <Strek />
        </>
    );
};

export default PåfølgendeVedtaksperiode;
