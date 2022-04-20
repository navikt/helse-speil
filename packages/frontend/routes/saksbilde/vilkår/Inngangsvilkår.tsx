import dayjs from 'dayjs';
import React from 'react';

import { Vilkårdata } from '../../../mapping/vilkår';

import { Maybe, Vilkarsgrunnlag, Vurdering } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useActivePeriod } from '@state/periode';
import { getVilkårsgrunnlag } from '@state/selectors/person';
import { useCurrentPerson } from '@state/person';
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
    periodeFom: DateString;
    vilkårsgrunnlag: Vilkarsgrunnlag;
    fødselsdato: DateString;
    vurdering?: Maybe<Vurdering>;
}

export const InngangsvilkårWithContent = ({
    periodeFom,
    vilkårsgrunnlag,
    fødselsdato,
    vurdering,
}: InngangsvilkårWithContentProps) => {
    const alderVedSkjæringstidspunkt = dayjs(vilkårsgrunnlag.skjaeringstidspunkt).diff(fødselsdato, 'year');

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
                            skjæringstidspunkt={vilkårsgrunnlag.skjaeringstidspunkt}
                            automatiskBehandlet={vurdering.automatisk}
                            erForlengelse={dayjs(periodeFom).isAfter(vilkårsgrunnlag.skjaeringstidspunkt)}
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
        const vilkårsgrunnlag = getVilkårsgrunnlag(
            person,
            activePeriod.vilkarsgrunnlaghistorikkId,
            activePeriod.skjaeringstidspunkt,
        );
        return (
            <InngangsvilkårWithContent
                vurdering={activePeriod.utbetaling.vurdering}
                periodeFom={activePeriod.fom}
                vilkårsgrunnlag={vilkårsgrunnlag}
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

export default Inngangsvilkår;
