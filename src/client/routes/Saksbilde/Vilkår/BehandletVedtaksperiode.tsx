import React, { ReactNode } from 'react';
import { Strek, StyledBehandletInnhold } from './Vilkår.styles';
import Vilkårsgrupper from './Vilkårsgrupper/Vilkårsgrupper';
import Vilkårsgruppe from './Vilkårsgrupper/Vilkårsgruppe';
import { Vedtaksperiode } from 'internal-types';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Grid } from '../../../components/Grid';
import { FerdigbehandledeVilkår, VilkårVurdertIInfotrygd } from './PåfølgendeVedtaksperiode';
import { FlexColumn } from '../../../components/Flex';

interface BehandletVedtaksperiodeProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
}

interface BehandletVedtaksperiodeWrapperProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
    tittel?: string;
    children: ReactNode;
}

const Innhold = styled(Grid)`
    margin-top: 2rem;
`;

const BehandletVedtaksperiodeWrapper = ({
    aktivVedtaksperiode,
    førsteVedtaksperiode,
    tittel,
    children,
}: BehandletVedtaksperiodeWrapperProps) => {
    const skjæringstidspunkt =
        førsteVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt.format(NORSK_DATOFORMAT) ?? 'Ukjent dato';
    const overskrift = tittel ? tittel : `Vilkår vurdert ved skjæringstidspunkt - ${skjæringstidspunkt}`;
    return (
        <StyledBehandletInnhold
            saksbehandler={aktivVedtaksperiode.godkjentAv}
            tittel={overskrift}
            vurderingsdato={
                aktivVedtaksperiode?.godkjenttidspunkt
                    ? dayjs(aktivVedtaksperiode?.godkjenttidspunkt).format(NORSK_DATOFORMAT)
                    : 'ukjent'
            }
            automatiskBehandlet={aktivVedtaksperiode.automatiskBehandlet}
        >
            {children}
        </StyledBehandletInnhold>
    );
};

export const institusjonsopphold = (vedtaksperiode: Vedtaksperiode) =>
    vedtaksperiode.godkjenttidspunkt?.isAfter(dayjs('10-04-2020')) && ( //Ble lagt på sjekk i spleis 30/09/20
        <Vilkårsgruppe tittel="Ingen institusjonsopphold" paragraf="§ 8-53 og 8-54" ikontype="ok" />
    );

export const BehandletVedtaksperiode = ({
    aktivVedtaksperiode,
    førsteVedtaksperiode,
}: BehandletVedtaksperiodeProps) => {
    const vilkår = aktivVedtaksperiode.vilkår!;
    if (aktivVedtaksperiode.id !== førsteVedtaksperiode.id && aktivVedtaksperiode.automatiskBehandlet) {
        return (
            <>
                <BehandletVedtaksperiodeWrapper
                    aktivVedtaksperiode={aktivVedtaksperiode}
                    førsteVedtaksperiode={førsteVedtaksperiode}
                    tittel={'Vilkår vurdert for denne perioden'}
                >
                    <Innhold kolonner={2}>
                        <FlexColumn>
                            <Vilkårsgruppe tittel="Arbeidsuførhet" paragraf="§ 8-4" ikontype="ok" />
                            <Vilkårsgruppe tittel="Medvirkning" paragraf="§ 8-8" ikontype="ok" />
                            <Vilkårsgrupper.Alder {...vilkår.alder} />
                            <Vilkårsgrupper.Søknadsfrist {...vilkår.søknadsfrist} />
                        </FlexColumn>
                        <FlexColumn>
                            {institusjonsopphold(aktivVedtaksperiode)}
                            <Vilkårsgrupper.DagerIgjen {...vilkår.dagerIgjen!} />
                        </FlexColumn>
                    </Innhold>
                </BehandletVedtaksperiodeWrapper>
                <Strek />
                <FerdigbehandledeVilkår vedtaksperiode={førsteVedtaksperiode} />
            </>
        );
    }
    return (
        <>
            <BehandletVedtaksperiodeWrapper
                aktivVedtaksperiode={aktivVedtaksperiode}
                førsteVedtaksperiode={førsteVedtaksperiode}
            >
                <Innhold kolonner={2}>
                    <FlexColumn>
                        <Vilkårsgruppe tittel="Arbeidsuførhet" paragraf="§ 8-4" ikontype="ok" />
                        <Vilkårsgruppe tittel="Medlemskap" paragraf="§ 2" ikontype="ok" />
                        <Vilkårsgruppe tittel="Medvirkning" paragraf="§ 8-8" ikontype="ok" />
                        <Vilkårsgrupper.Alder {...vilkår.alder} />
                        <Vilkårsgrupper.Søknadsfrist {...vilkår.søknadsfrist} />
                    </FlexColumn>
                    <FlexColumn>
                        {institusjonsopphold(aktivVedtaksperiode)}
                        {vilkår.opptjening ? (
                            <Vilkårsgrupper.Opptjeningstid
                                opptjeningVilkår={vilkår.opptjening}
                                skjæringstidspunkt={vilkår.dagerIgjen?.skjæringstidspunkt}
                            />
                        ) : (
                            <Vilkårsgruppe
                                tittel="Opptjening må vurderes manuelt"
                                ikontype="advarsel"
                                paragraf="§ 8-2"
                            />
                        )}
                        <Vilkårsgrupper.KravTilSykepengegrunnlag
                            sykepengegrunnlagVilkår={vilkår.sykepengegrunnlag!}
                            alderSisteSykedag={vilkår.alder.alderSisteSykedag}
                        />
                        <Vilkårsgrupper.DagerIgjen {...vilkår.dagerIgjen!} />
                    </FlexColumn>
                </Innhold>
            </BehandletVedtaksperiodeWrapper>
            <Strek />
        </>
    );
};

export const BehandletVedtaksperiodeFraInfotrygd = ({
    aktivVedtaksperiode,
    førsteVedtaksperiode,
}: BehandletVedtaksperiodeProps) => {
    const vilkår = aktivVedtaksperiode.vilkår!!;
    return (
        <>
            <BehandletVedtaksperiodeWrapper
                aktivVedtaksperiode={aktivVedtaksperiode}
                førsteVedtaksperiode={førsteVedtaksperiode}
            >
                <Innhold kolonner={2}>
                    <FlexColumn>
                        <Vilkårsgruppe tittel="Arbeidsuførhet" paragraf="§ 8-4" ikontype="ok" />
                        <Vilkårsgruppe tittel="Medlemskap" paragraf="§ 2" ikontype="ok" />
                        <Vilkårsgrupper.Alder {...vilkår.alder} />
                        <Vilkårsgrupper.Søknadsfrist {...vilkår.søknadsfrist} />
                    </FlexColumn>
                    <FlexColumn>
                        <Vilkårsgruppe tittel="Medvirkning" paragraf="§ 8-8" ikontype="ok" />
                        {institusjonsopphold(aktivVedtaksperiode)}
                        <Vilkårsgrupper.DagerIgjen {...vilkår.dagerIgjen!} />
                    </FlexColumn>
                </Innhold>
                <VilkårVurdertIInfotrygd />
            </BehandletVedtaksperiodeWrapper>
            <Strek />
        </>
    );
};
