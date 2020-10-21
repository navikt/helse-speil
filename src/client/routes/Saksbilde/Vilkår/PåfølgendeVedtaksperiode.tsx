import React, { ReactNode } from 'react';
import Vilkårsgruppe from './Vilkårsgrupper';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsvisning from './Vilkårsvisning';
import IkkeVurderteVilkår, { IkkeVurdertVilkår } from './Vilkårsgrupper/IkkeVurderteVilkår';
import { Grid } from '../../../components/Grid';
import { Dayjs } from 'dayjs';
import { Feilikon } from '../../../components/ikoner/Feilikon';
import { GrøntSjekkikon } from '../../../components/ikoner/GrøntSjekkikon';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Opptjening, Risikovurdering, Vedtaksperiode } from 'internal-types';
import { Strek, StyledBehandletAvInfotrygd, StyledBehandletInnhold, Vilkårinnhold } from './Vilkår.styles';
import { FlexColumn } from '../../../components/Flex';
import { institusjonsopphold } from './BehandletVedtaksperiode';

const formatterDato = (dato?: Dayjs) => dato?.format(NORSK_DATOFORMAT) ?? 'Dato ikke funnet';

interface FerdigbehandledeVilkårProps {
    vedtaksperiode: Vedtaksperiode;
}

export const FerdigbehandledeVilkår = ({ vedtaksperiode }: FerdigbehandledeVilkårProps) => (
    <>
        <StyledBehandletInnhold
            saksbehandler={vedtaksperiode.godkjentAv!}
            tittel={`Vilkår vurdert ved skjæringstidspunkt - ${formatterDato(
                vedtaksperiode.vilkår!.dagerIgjen?.skjæringstidspunkt
            )}`}
            vurderingsdato={formatterDato(vedtaksperiode.godkjenttidspunkt)}
            automatiskBehandlet={vedtaksperiode.automatiskBehandlet}
        >
            <Grid gridTemplateColumns={'35rem auto'}>
                <FlexColumn>
                    <OptionalOpptjeningstid vedtaksperiode={vedtaksperiode} />
                    {institusjonsopphold(vedtaksperiode)}
                </FlexColumn>
                <FlexColumn>
                    <Vilkårsgrupper.KravTilSykepengegrunnlag
                        sykepengegrunnlagVilkår={vedtaksperiode.vilkår!.sykepengegrunnlag}
                        alderSisteSykedag={vedtaksperiode.vilkår!.alder.alderSisteSykedag}
                    />
                    <Vilkårsgruppe tittel="Medlemskap" paragraf="§ 2" ikontype="ok" />
                </FlexColumn>
            </Grid>
        </StyledBehandletInnhold>
    </>
);

export const VilkårVurdertIInfotrygd = () => (
    <Vilkårinnhold>
        <StyledBehandletAvInfotrygd tittel={`Inngangsvilkår vurdert i Infotrygd`}>
            <Vilkårsgruppe tittel="Opptjeningstid" ikontype="ok" paragraf="§ 8-2" />
            <Vilkårsgruppe tittel="Krav til minste sykepengegrunnlag" ikontype="ok" paragraf="§ 8-3" />
        </StyledBehandletAvInfotrygd>
    </Vilkårinnhold>
);

interface OpptionalOpptjeningstidProps {
    vedtaksperiode: Vedtaksperiode;
}

const OptionalOpptjeningstid = ({ vedtaksperiode }: OpptionalOpptjeningstidProps) =>
    vedtaksperiode.vilkår?.opptjening ?? false ? (
        <Vilkårsgrupper.Opptjeningstid
            opptjeningVilkår={vedtaksperiode.vilkår!.opptjening as Opptjening}
            skjæringstidspunkt={vedtaksperiode.vilkår!.dagerIgjen?.skjæringstidspunkt}
        />
    ) : (
        <Vilkårsgruppe tittel="Opptjening må vurderes manuelt" ikontype="advarsel" paragraf="§ 8-2" />
    );

interface PåfølgendeVedtaksperiodeProps {
    førsteVedtaksperiode: Vedtaksperiode;
    ikkeOppfylteVilkår: ReactNode[];
    oppfylteVilkår: ReactNode[];
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
    forlengelseFraInfotrygd?: boolean;
    risikovurdering?: Risikovurdering;
}

interface OppfylteVilkårProps {
    vilkår: ReactNode[];
    risikovurdering?: Risikovurdering;
}

const OppfylteVilkår = (props: OppfylteVilkårProps) => (
    <Vilkårsvisning
        tittel="Vurderte vilkår"
        ikon={<GrøntSjekkikon />}
        vilkår={props.vilkår}
        risikovurdering={props.risikovurdering}
    />
);

const IkkeOppfylteVilkår = ({ vilkår }: { vilkår: ReactNode[] }) =>
    vilkår.length > 0 ? <Vilkårsvisning tittel="Ikke oppfylte vilkår" ikon={<Feilikon />} vilkår={vilkår} /> : null;

export const PåfølgendeVedtaksperiode = (props: PåfølgendeVedtaksperiodeProps) => (
    <>
        <IkkeOppfylteVilkår vilkår={props.ikkeOppfylteVilkår} />
        <IkkeVurderteVilkår ikkeVurderteVilkår={props.ikkeVurderteVilkår} risikovurdering={props.risikovurdering} />
        <OppfylteVilkår vilkår={props.oppfylteVilkår} risikovurdering={props.risikovurdering} />
        {props.forlengelseFraInfotrygd ? (
            <VilkårVurdertIInfotrygd />
        ) : (
            <FerdigbehandledeVilkår vedtaksperiode={props.førsteVedtaksperiode} />
        )}
        <Strek />
    </>
);
