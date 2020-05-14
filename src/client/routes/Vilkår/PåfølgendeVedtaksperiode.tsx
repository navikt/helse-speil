import React, { ReactNode } from 'react';
import { Strek, StyledBehandletInnhold, StyledBehandletAvInfotrygd } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgrupper';
import { Opptjening, Vedtaksperiode } from '../../context/types';
import { FlexColumn } from '../../components/FlexColumn';
import TwoColumnGrid from '../../components/TwoColumnGrid';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Dayjs } from 'dayjs';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';
import Vilkårsvisning from './Vilkårsvisning';
import Feilikon from '../../components/Ikon/Feilikon';
import IkkeVurderteVilkår, { IkkeVurdertVilkår } from './Vilkårsgrupper/IkkeVurderteVilkår';

const formatterDato = (dato?: Dayjs) => dato?.format(NORSK_DATOFORMAT) ?? 'Dato ikke funnet';

interface FerdigbehandledeVilkårProps {
    vedtaksperiode: Vedtaksperiode;
}

const FerdigbehandledeVilkår = ({ vedtaksperiode }: FerdigbehandledeVilkårProps) => (
    <>
        <StyledBehandletInnhold
            saksbehandler={vedtaksperiode.godkjentAv!}
            tittel={`Vilkår vurdert første sykdomsdag - ${formatterDato(
                vedtaksperiode.vilkår!.dagerIgjen?.førsteFraværsdag
            )}`}
            vurderingsdato={formatterDato(vedtaksperiode.godkjenttidspunkt)}
        >
            <TwoColumnGrid firstColumnWidth={'35rem'}>
                <FlexColumn>
                    <OptionalOpptjeningstid vedtaksperiode={vedtaksperiode} />
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.KravTilSykepengegrunnlag
                        sykepengegrunnlagVilkår={vedtaksperiode.vilkår!.sykepengegrunnlag}
                        alderSisteSykedag={vedtaksperiode.vilkår!.alder.alderSisteSykedag}
                    />
                </FlexColumn>
            </TwoColumnGrid>
        </StyledBehandletInnhold>
    </>
);

const VilkårVurdertIInfotrygd = () => (
    <StyledBehandletAvInfotrygd tittel={`Inngangsvilkår vurdert i Infotrygd`}>
        <Vilkårsgruppe tittel="Opptjeningstid" ikontype="ok" paragraf="§8-2" />
        <Vilkårsgruppe tittel="Krav til minste sykepengegrunnlag" ikontype="ok" paragraf="§8-3" />
    </StyledBehandletAvInfotrygd>
);

interface OpptionalOpptjeningstidProps {
    vedtaksperiode: Vedtaksperiode;
}

const OptionalOpptjeningstid = ({ vedtaksperiode }: OpptionalOpptjeningstidProps) =>
    vedtaksperiode.vilkår?.opptjening ?? false ? (
        <Vilkårsgrupper.Opptjeningstid
            opptjeningVilkår={vedtaksperiode.vilkår!.opptjening as Opptjening}
            førsteFraværsdag={vedtaksperiode.vilkår!.dagerIgjen?.førsteFraværsdag}
        />
    ) : (
        <Vilkårsgruppe tittel="Opptjening må vurderes manuelt" ikontype="advarsel" paragraf="§8-2" />
    );

interface PåfølgendeVedtaksperiodeProps {
    førsteVedtaksperiode: Vedtaksperiode;
    ikkeOppfylteVilkår: ReactNode[];
    oppfylteVilkår: ReactNode[];
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
    forlengelseFraInfotrygd: boolean;
}

const PåfølgendeVedtaksperiode = ({
    førsteVedtaksperiode,
    ikkeOppfylteVilkår,
    oppfylteVilkår,
    ikkeVurderteVilkår,
    forlengelseFraInfotrygd
}: PåfølgendeVedtaksperiodeProps) => {
    return (
        <>
            {ikkeOppfylteVilkår.length > 0 && (
                <Vilkårsvisning tittel="Ikke oppfylte vilkår" ikon={<Feilikon />} vilkår={ikkeOppfylteVilkår} />
            )}
            <IkkeVurderteVilkår ikkeVurderteVilkår={ikkeVurderteVilkår} />
            <Vilkårsvisning tittel="Vurderte vilkår" ikon={<GrøntSjekkikon />} vilkår={oppfylteVilkår} />
            {forlengelseFraInfotrygd ? (
                <VilkårVurdertIInfotrygd />
            ) : (
                <FerdigbehandledeVilkår vedtaksperiode={førsteVedtaksperiode} />
            )}
            <Strek />
        </>
    );
};

export default PåfølgendeVedtaksperiode;
