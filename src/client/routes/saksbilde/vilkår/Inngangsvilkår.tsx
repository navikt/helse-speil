import styled from '@emotion/styled';
import React from 'react';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Flex, FlexColumn } from '../../../components/Flex';
import { førsteVedtaksperiode } from '../../../mapping/selectors';
import { Vilkårdata } from '../../../mapping/vilkår';

import { kategoriserteInngangsvilkår } from './kategoriserteInngangsvilkår';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { OppfylteVilkår } from './vilkårsgrupper/OppfylteVilkår';
import { VurdertAutomatisk } from './vilkårsgrupper/VurdertAutomatisk';
import { VurdertAvSaksbehandler } from './vilkårsgrupper/VurdertAvSaksbehandler';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { Yrkeskadeinfo } from './vilkårsgrupper/Yrkesskadeinfo';

const Container = styled.div`
    margin-top: 2rem;
    box-sizing: border-box;

    > div:first-of-type > *:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

const VurderteVilkårContainer = styled(FlexColumn)`
    width: max-content;
`;

const YrkesskadeinfoContainer = styled.div`
    position: relative;
    margin-left: 2rem;
    margin-top: 1.5rem;
    padding-top: 2.5rem;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 10px;
        width: calc(100% - 10px);
        height: 1px;
        background: var(--navds-color-gray-20);
    }
`;

const harVilkår = (vilkår?: Vilkårdata[]) => vilkår && vilkår.length > 0;

interface VilkårProps {
    vedtaksperiode?: Vedtaksperiode;
    person?: Person;
}

export const Inngangsvilkår = ({ vedtaksperiode, person }: VilkårProps) => {
    if (!vedtaksperiode || person === undefined) return null;

    const {
        oppfylteVilkår,
        ikkeVurderteVilkår,
        ikkeOppfylteVilkår,
        vilkårVurdertAvSaksbehandler,
        vilkårVurdertAutomatisk,
        vilkårVurdertIInfotrygd,
        vilkårVurdertFørstePeriode,
    } = kategoriserteInngangsvilkår(vedtaksperiode);

    const førstePeriode = førsteVedtaksperiode(vedtaksperiode, person!);

    const harBehandledeVilkår =
        harVilkår(ikkeVurderteVilkår) || harVilkår(ikkeOppfylteVilkår) || harVilkår(oppfylteVilkår);

    const harAlleredeVurderteVilkår =
        harVilkår(vilkårVurdertFørstePeriode) ||
        harVilkår(vilkårVurdertIInfotrygd) ||
        harVilkår(vilkårVurdertAvSaksbehandler) ||
        harVilkår(vilkårVurdertAutomatisk);

    return (
        <AgurkErrorBoundary sidenavn="Inngangsvilkår">
            <Container className="Inngangsvilkår">
                {harBehandledeVilkår && (
                    <Flex>
                        {harVilkår(ikkeVurderteVilkår) && <IkkeVurderteVilkår vilkår={ikkeVurderteVilkår!} />}
                        {harVilkår(ikkeOppfylteVilkår) && <IkkeOppfylteVilkår vilkår={ikkeOppfylteVilkår!} />}
                        {harVilkår(oppfylteVilkår) && <OppfylteVilkår vilkår={oppfylteVilkår!} />}
                    </Flex>
                )}
                {harAlleredeVurderteVilkår && (
                    <VurderteVilkårContainer>
                        {vilkårVurdertAutomatisk && vilkårVurdertAutomatisk.length > 0 && (
                            <VurdertAutomatisk
                                vilkår={vilkårVurdertAutomatisk}
                                saksbehandler={vedtaksperiode.godkjentAv}
                            />
                        )}
                        {vilkårVurdertAvSaksbehandler && vilkårVurdertAvSaksbehandler.length > 0 && (
                            <VurdertAvSaksbehandler
                                vilkår={vilkårVurdertAvSaksbehandler}
                                saksbehandler={vedtaksperiode.godkjentAv}
                            />
                        )}
                        {vilkårVurdertFørstePeriode && vilkårVurdertFørstePeriode.length > 0 && (
                            <VurdertAvSaksbehandler
                                vilkår={vilkårVurdertFørstePeriode}
                                saksbehandler={førstePeriode.godkjentAv}
                                skjæringstidspunkt={førstePeriode.vilkår!.dagerIgjen.skjæringstidspunkt}
                            />
                        )}
                        {vilkårVurdertIInfotrygd && vilkårVurdertIInfotrygd.length > 0 && (
                            <VurdertIInfotrygd vilkår={vilkårVurdertIInfotrygd} />
                        )}
                        <YrkesskadeinfoContainer>
                            <Yrkeskadeinfo />
                        </YrkesskadeinfoContainer>
                    </VurderteVilkårContainer>
                )}
            </Container>
        </AgurkErrorBoundary>
    );
};
