import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { Vilkårdata } from '../../../mapping/vilkår';

import { AgurkErrorBoundary } from '@components/AgurkErrorBoundary';
import { Flex, FlexColumn } from '@components/Flex';
import { useAktivPeriode } from '@state/tidslinje';
import { usePersoninfo, useVilkårsgrunnlaghistorikk, useVurderingForSkjæringstidspunkt } from '@state/person';

import { kategoriserteInngangsvilkår } from './kategoriserteInngangsvilkår';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { OppfylteVilkår } from './vilkårsgrupper/OppfylteVilkår';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertISpleis } from './vilkårsgrupper/VurdertISpleis';
import { Yrkeskadeinfo } from './vilkårsgrupper/Yrkesskadeinfo';
import { useActivePeriod } from '@state/periodState';

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

interface InngangsvilkårProps {
    skjæringstidspunkt: DateString;
    vilkårsgrunnlagHistorikkId: UUID;
}

export const Inngangsvilkår = ({ skjæringstidspunkt, vilkårsgrunnlagHistorikkId }: InngangsvilkårProps) => {
    const aktivPeriode = useAktivPeriode();
    const activePeriod = useActivePeriod();
    const unique =
        aktivPeriode.tilstand === 'utenSykefravær' ? undefined : (aktivPeriode as TidslinjeperiodeMedSykefravær).unique;

    const vurderingForSkjæringstidspunkt = useVurderingForSkjæringstidspunkt(unique, skjæringstidspunkt);
    const vilkårsgrunnlag = useVilkårsgrunnlaghistorikk(skjæringstidspunkt, vilkårsgrunnlagHistorikkId);
    const fødselsdato = usePersoninfo().fødselsdato;
    const alderVedSkjæringstidspunkt = dayjs(skjæringstidspunkt).diff(fødselsdato, 'year');

    if (!vilkårsgrunnlag) {
        throw Error('Mangler vilkårsgrunnlag.');
    }

    const { oppfylteVilkår, ikkeVurderteVilkår, ikkeOppfylteVilkår, vilkårVurdertIInfotrygd, vilkårVurdertISpleis } =
        kategoriserteInngangsvilkår(vilkårsgrunnlag, alderVedSkjæringstidspunkt, vurderingForSkjæringstidspunkt);

    const harBehandledeVilkår =
        harVilkår(ikkeVurderteVilkår) || harVilkår(ikkeOppfylteVilkår) || harVilkår(oppfylteVilkår);

    const harAlleredeVurderteVilkår = harVilkår(vilkårVurdertISpleis) || harVilkår(vilkårVurdertIInfotrygd);

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
                        {vurderingForSkjæringstidspunkt && vilkårVurdertISpleis && (
                            <VurdertISpleis
                                vilkår={vilkårVurdertISpleis}
                                ident={vurderingForSkjæringstidspunkt.ident}
                                skjæringstidspunkt={skjæringstidspunkt}
                                automatiskBehandlet={vurderingForSkjæringstidspunkt.automatisk}
                                erForlengelse={aktivPeriode.fom.isAfter(skjæringstidspunkt)}
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
