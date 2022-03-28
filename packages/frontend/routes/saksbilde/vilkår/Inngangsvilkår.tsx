import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { Vilkårdata } from '../../../mapping/vilkår';

import { AgurkErrorBoundary } from '@components/AgurkErrorBoundary';
import { Flex, FlexColumn } from '@components/Flex';

import { kategoriserteInngangsvilkår } from './kategoriserteInngangsvilkår';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { OppfylteVilkår } from './vilkårsgrupper/OppfylteVilkår';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertISpleis } from './vilkårsgrupper/VurdertISpleis';
import { Yrkeskadeinfo } from './vilkårsgrupper/Yrkesskadeinfo';
import { useActivePeriod } from '@state/periodState';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Varsel } from '@components/Varsel';
import { isBeregnetPeriode } from '@utils/typeguards';
import { Maybe, Vurdering } from '@io/graphql';
import { useCurrentPerson, useVilkårsgrunnlag } from '@state/personState';

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

interface InngangsvilkårWithContentProps {
    vurdering?: Maybe<Vurdering>;
    periodeFom: DateString;
    skjæringstidspunkt: DateString;
    vilkårsgrunnlagHistorikkId: UUID;
    fødselsdato: DateString;
}

export const InngangsvilkårWithContent = ({
    vurdering,
    periodeFom,
    skjæringstidspunkt,
    vilkårsgrunnlagHistorikkId,
    fødselsdato,
}: InngangsvilkårWithContentProps) => {
    const vilkårsgrunnlag = useVilkårsgrunnlag(vilkårsgrunnlagHistorikkId, skjæringstidspunkt);

    if (!vilkårsgrunnlag) {
        throw Error('Mangler vilkårsgrunnlag.');
    }

    const alderVedSkjæringstidspunkt = dayjs(skjæringstidspunkt).diff(fødselsdato, 'year');

    const { oppfylteVilkår, ikkeVurderteVilkår, ikkeOppfylteVilkår, vilkårVurdertIInfotrygd, vilkårVurdertISpleis } =
        kategoriserteInngangsvilkår(vilkårsgrunnlag, alderVedSkjæringstidspunkt, vurdering);

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
                        {vilkårVurdertISpleis && vurdering && (
                            <VurdertISpleis
                                vilkår={vilkårVurdertISpleis}
                                ident={vurdering.ident}
                                skjæringstidspunkt={skjæringstidspunkt}
                                automatiskBehandlet={vurdering.automatisk}
                                erForlengelse={dayjs(periodeFom).isAfter(skjæringstidspunkt)}
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

const InngangsvilkårContainer = () => {
    const activePeriod = useActivePeriod();
    const person = useCurrentPerson();

    if (!activePeriod || !person?.personinfo.fodselsdato) {
        return null;
    } else if (isBeregnetPeriode(activePeriod)) {
        return (
            <InngangsvilkårWithContent
                vurdering={activePeriod.utbetaling.vurdering}
                periodeFom={activePeriod.fom}
                skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                vilkårsgrunnlagHistorikkId={activePeriod.vilkarsgrunnlaghistorikkId}
                fødselsdato={person.personinfo.fodselsdato}
            />
        );
    } else {
        return null;
    }
};

const InngangsvilkårSkeleton = () => {
    return <div />;
};

const InngangsvilkårError = () => {
    return <Varsel variant="feil">Noe gikk galt. Kan ikke vise inngangsvilkår for denne perioden.</Varsel>;
};

export const Inngangsvilkår = () => {
    return (
        <React.Suspense fallback={<InngangsvilkårSkeleton />}>
            <ErrorBoundary fallback={<InngangsvilkårError />}>
                <InngangsvilkårContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
