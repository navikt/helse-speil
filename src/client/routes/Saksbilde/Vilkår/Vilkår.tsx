import React, { useContext } from 'react';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { tilKategoriserteVilkår } from './tilKategoriserteVilkår';
import { MedPersonOgVedtaksperiode, PersonContext } from '../../../context/PersonContext';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { OppfylteVilkår } from './vilkårsgrupper/OppfylteVilkår';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { VurdertAvSaksbehandler } from './vilkårsgrupper/VurdertAvSaksbehandler';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertAutomatisk } from './vilkårsgrupper/VurdertAutomatisk';
import styled from '@emotion/styled';
import { førsteVedtaksperiode } from '../../../mapping/selectors';
import { Flex } from '../../../components/Flex';
import { Vilkårdata } from '../../../mapping/vilkår';
import { Strek } from './Vilkår.styles';

const Container = styled.div`
    margin-top: 2rem;
`;

const Separator = styled(Strek)`
    margin: 2rem 0;
`;

const harVilkår = (vilkår?: Vilkårdata[]) => vilkår && vilkår.length > 0;

export const Vilkår = () => {
    const { aktivVedtaksperiode: vedtaksperiode, personTilBehandling } = useContext(PersonContext);
    if (!vedtaksperiode || personTilBehandling === undefined) return null;

    const {
        oppfylteVilkår,
        ikkeVurderteVilkår,
        ikkeOppfylteVilkår,
        vilkårVurdertAvSaksbehandler,
        vilkårVurdertAutomatisk,
        vilkårVurdertIInfotrygd,
        vilkårVurdertFørstePeriode,
    } = tilKategoriserteVilkår(vedtaksperiode);

    const førstePeriode = førsteVedtaksperiode(vedtaksperiode, personTilBehandling!);

    const harBehandledeVilkår =
        harVilkår(ikkeVurderteVilkår) || harVilkår(ikkeOppfylteVilkår) || harVilkår(oppfylteVilkår);

    const harAlleredeVurderteVilkår =
        harVilkår(vilkårVurdertFørstePeriode) ||
        harVilkår(vilkårVurdertIInfotrygd) ||
        harVilkår(vilkårVurdertAvSaksbehandler) ||
        harVilkår(vilkårVurdertAutomatisk);

    return (
        <AgurkErrorBoundary sidenavn="Vilkår">
            <Container className="vilkår">
                {harBehandledeVilkår && (
                    <Flex>
                        {harVilkår(ikkeVurderteVilkår) && <IkkeVurderteVilkår vilkår={ikkeVurderteVilkår!} />}
                        {harVilkår(ikkeOppfylteVilkår) && <IkkeOppfylteVilkår vilkår={ikkeOppfylteVilkår!} />}
                        {harVilkår(oppfylteVilkår) && <OppfylteVilkår vilkår={oppfylteVilkår!} />}
                    </Flex>
                )}
                {harBehandledeVilkår && harAlleredeVurderteVilkår && <Separator />}
                {harAlleredeVurderteVilkår && (
                    <Flex>
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
                    </Flex>
                )}
            </Container>
        </AgurkErrorBoundary>
    );
};
