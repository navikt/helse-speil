import React, { useContext } from 'react';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { useKategoriserteVilkår } from './useKategoriserteVilkår';
import { MedPersonOgVedtaksperiode, PersonContext } from '../../../context/PersonContext';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { OppfylteVilkår } from './vilkårsgrupper/OppfylteVilkår';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { VurdertAvSaksbehandler } from './vilkårsgrupper/VurdertAvSaksbehandler';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertAutomatisk } from './vilkårsgrupper/VurdertAutomatisk';
import { Flex } from '../../../components/Flex';
import styled from '@emotion/styled';
import { Strek } from './Vilkår.styles';
import { førsteVedtaksperiode } from '../../../mapping/selectors';

const Kolonner = styled(Flex)`
    flex-wrap: wrap;
    > *:not(:last-child) {
        margin-right: 3.5rem;
    }
`;

const Separator = styled(Strek)`
    border: none;
    &:not(:last-child) {
        border-top: 1px solid #c6c2bf;
        margin: 2rem -2rem;
    }
`;

export const Vilkår = () => {
    const { aktivVedtaksperiode: vedtaksperiode, personTilBehandling } = useContext(
        PersonContext
    ) as MedPersonOgVedtaksperiode;
    const {
        oppfylteVilkår,
        ikkeVurderteVilkår,
        ikkeOppfylteVilkår,
        vilkårVurdertAvSaksbehandler,
        vilkårVurdertAutomatisk,
        vilkårVurdertIInfotrygd,
    } = useKategoriserteVilkår(vedtaksperiode);

    if (!vedtaksperiode || personTilBehandling === undefined) return null;
    const førstePeriode = førsteVedtaksperiode(vedtaksperiode, personTilBehandling!);

    const harIkkeVurderteVilkår = ikkeVurderteVilkår && ikkeVurderteVilkår.length > 0;
    const harIkkeOppfylteVilkår = ikkeOppfylteVilkår && ikkeOppfylteVilkår.length > 0;
    const harOppfylteVilkår = oppfylteVilkår && oppfylteVilkår.length > 0;
    const harBehandledeVilkår = harIkkeVurderteVilkår || harIkkeOppfylteVilkår || harOppfylteVilkår;

    return (
        <AgurkErrorBoundary sidenavn="Vilkår">
            {vilkårVurdertAvSaksbehandler && vilkårVurdertAvSaksbehandler.length > 0 && (
                <>
                    <VurdertAvSaksbehandler
                        vilkår={vilkårVurdertAvSaksbehandler}
                        saksbehandler={vedtaksperiode.godkjentAv ?? førstePeriode.godkjentAv}
                        skjæringstidspunkt={førstePeriode.vilkår!.dagerIgjen.skjæringstidspunkt}
                    />
                    <Separator />
                </>
            )}
            {vilkårVurdertAutomatisk && vilkårVurdertAutomatisk.length > 0 && (
                <>
                    <VurdertAutomatisk vilkår={vilkårVurdertAutomatisk} saksbehandler={vedtaksperiode.godkjentAv} />
                    <Separator />
                </>
            )}
            {vilkårVurdertIInfotrygd && vilkårVurdertIInfotrygd.length > 0 && (
                <>
                    <VurdertIInfotrygd vilkår={vilkårVurdertIInfotrygd} />
                    <Separator />
                </>
            )}
            {harBehandledeVilkår && (
                <Kolonner>
                    {harIkkeVurderteVilkår && <IkkeVurderteVilkår vilkår={ikkeVurderteVilkår!} />}
                    {harIkkeOppfylteVilkår && <IkkeOppfylteVilkår vilkår={ikkeOppfylteVilkår!} />}
                    {harOppfylteVilkår && <OppfylteVilkår vilkår={oppfylteVilkår!} />}
                </Kolonner>
            )}
        </AgurkErrorBoundary>
    );
};
