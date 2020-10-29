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
    margin: 2rem -2rem;
`;

export const VilkårV2 = () => {
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

    return (
        <AgurkErrorBoundary sidenavn="Vilkår">
            <Kolonner>
                {ikkeVurderteVilkår && ikkeVurderteVilkår.length > 0 && (
                    <AgurkErrorBoundary sidenavn="IkkeVurderteVilkår">
                        <IkkeVurderteVilkår vilkår={ikkeVurderteVilkår} />
                    </AgurkErrorBoundary>
                )}
                {ikkeOppfylteVilkår && ikkeOppfylteVilkår.length > 0 && (
                    <AgurkErrorBoundary sidenavn="IkkeOppfylteVilkår">
                        <IkkeOppfylteVilkår vilkår={ikkeOppfylteVilkår} />
                    </AgurkErrorBoundary>
                )}
                {oppfylteVilkår && oppfylteVilkår.length > 0 && (
                    <AgurkErrorBoundary sidenavn="OppfylteVilkår">
                        <OppfylteVilkår vilkår={oppfylteVilkår} />
                    </AgurkErrorBoundary>
                )}
            </Kolonner>
            {vilkårVurdertAvSaksbehandler && vilkårVurdertAvSaksbehandler.length > 0 && (
                <>
                    <Separator />
                    <AgurkErrorBoundary sidenavn="VurdertAvSaksbehandler">
                        <VurdertAvSaksbehandler
                            vilkår={vilkårVurdertAvSaksbehandler}
                            saksbehandler={vedtaksperiode.godkjentAv ?? førstePeriode.godkjentAv}
                            skjæringstidspunkt={førstePeriode.vilkår!.dagerIgjen.skjæringstidspunkt}
                        />
                    </AgurkErrorBoundary>
                </>
            )}
            {vilkårVurdertAutomatisk && vilkårVurdertAutomatisk.length > 0 && (
                <>
                    <Separator />
                    <AgurkErrorBoundary sidenavn="VurdertAutomatisk">
                        <VurdertAutomatisk vilkår={vilkårVurdertAutomatisk} saksbehandler={vedtaksperiode.godkjentAv} />
                    </AgurkErrorBoundary>
                </>
            )}
            {vilkårVurdertIInfotrygd && vilkårVurdertIInfotrygd.length > 0 && (
                <>
                    <Separator />
                    <AgurkErrorBoundary sidenavn="VurdertIInfotrygd">
                        <VurdertIInfotrygd vilkår={vilkårVurdertIInfotrygd} />
                    </AgurkErrorBoundary>
                </>
            )}
        </AgurkErrorBoundary>
    );
};
