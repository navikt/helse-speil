import dayjs from 'dayjs';
import React from 'react';

import { Vilkårdata } from '../../../mapping/vilkår';

import { Maybe, Vurdering } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useActivePeriod } from '@state/periodState';
import { useCurrentPerson, useVilkårsgrunnlag } from '@state/personState';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Varsel } from '@components/Varsel';

import { kategoriserteInngangsvilkår } from './kategoriserteInngangsvilkår';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { OppfylteVilkår } from './vilkårsgrupper/OppfylteVilkår';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertISpleis } from './vilkårsgrupper/VurdertISpleis';
import { Yrkeskadeinfo } from './vilkårsgrupper/Yrkesskadeinfo';

import styles from './Inngangsvilkår.module.css';

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
        <div className={styles.Inngangsvilkår}>
            {harBehandledeVilkår && (
                <div className={styles.Flex}>
                    {harVilkår(ikkeVurderteVilkår) && <IkkeVurderteVilkår vilkår={ikkeVurderteVilkår!} />}
                    {harVilkår(ikkeOppfylteVilkår) && <IkkeOppfylteVilkår vilkår={ikkeOppfylteVilkår!} />}
                    {harVilkår(oppfylteVilkår) && <OppfylteVilkår vilkår={oppfylteVilkår!} />}
                </div>
            )}
            {harAlleredeVurderteVilkår && (
                <div className={styles.VurderteVilkår}>
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
                    <div className={styles.Yrkesskadeinfo}>
                        <Yrkeskadeinfo />
                    </div>
                </div>
            )}
        </div>
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
