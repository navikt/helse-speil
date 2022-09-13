import dayjs from 'dayjs';
import React from 'react';
import { Alert } from '@navikt/ds-react';

import { Maybe, Vilkarsgrunnlag, Vurdering } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { getVilkårsgrunnlag } from '@state/selectors/person';

import { kategoriserteInngangsvilkår } from './kategoriserteInngangsvilkår';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertISpleis } from './vilkårsgrupper/VurdertISpleis';
import { OppfylteVilkår } from './vilkårsgrupper/OppfylteVilkår';
import { Yrkeskadeinfo } from './vilkårsgrupper/Yrkesskadeinfo';
import { Vilkårdata } from 'mapping/vilkår';

import styles from './Inngangsvilkår.module.css';

const harVilkår = (vilkår?: Array<Vilkårdata>): vilkår is Array<Vilkårdata> =>
    vilkår !== undefined && vilkår !== null && vilkår.length > 0;

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
                    {harVilkår(vilkårVurdertISpleis) && vurdering && (
                        <VurdertISpleis
                            vilkår={vilkårVurdertISpleis}
                            ident={vurdering.ident}
                            skjæringstidspunkt={vilkårsgrunnlag.skjaeringstidspunkt}
                            automatiskBehandlet={vurdering.automatisk}
                            erForlengelse={dayjs(periodeFom).isAfter(vilkårsgrunnlag.skjaeringstidspunkt)}
                        />
                    )}
                    {harVilkår(vilkårVurdertIInfotrygd) && <VurdertIInfotrygd vilkår={vilkårVurdertIInfotrygd} />}
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
            activePeriod.tom,
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
    return (
        <Alert variant="error" size="small">
            Noe gikk galt. Kan ikke vise inngangsvilkår for denne perioden.
        </Alert>
    );
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
