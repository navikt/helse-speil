import React from 'react';

import { AgurkErrorBoundary } from '@components/AgurkErrorBoundary';
import { useOrganisasjonsnummer, useVilkårsgrunnlaghistorikk, useVurderingForSkjæringstidspunkt } from '@state/person';
import { useMaybeAktivPeriode } from '@state/tidslinje';
import { BeregnetPeriode, Refusjon, Vilkarsgrunnlagtype } from '@io/graphql';

import { BehandletSykepengegrunnlag } from './BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './SykepengegrunnlagFraInfotrygd';
import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

import styles from './Sykepengegrunnlag.module.css';
import classNames from 'classnames';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periodState';
import { useVilkårsgrunnlag } from '@state/personState';

interface SykepengegrunnlagProps extends React.HTMLAttributes<HTMLElement> {
    vilkårsgrunnlaghistorikkId: UUID;
    skjæringstidspunkt: DateString;
    refusjon?: Refusjon | null;
}

export const SykepengegrunnlagWithContent: React.VFC<SykepengegrunnlagProps> = ({
    vilkårsgrunnlaghistorikkId,
    skjæringstidspunkt,
    refusjon,
    className,
    ...elementProps
}) => {
    const organisasjonsnummer = useOrganisasjonsnummer();
    const vilkårsgrunnlag = useVilkårsgrunnlaghistorikk(skjæringstidspunkt, vilkårsgrunnlaghistorikkId);
    const aktivPeriode = useMaybeAktivPeriode()!;
    const unique =
        aktivPeriode.tilstand === 'utenSykefravær' ? undefined : (aktivPeriode as TidslinjeperiodeMedSykefravær).unique;
    const vurdering = useVurderingForSkjæringstidspunkt(unique, aktivPeriode.skjæringstidspunkt!);

    return (
        <section className={classNames(styles.Sykepengegrunnlag, className)}>
            <AgurkErrorBoundary>
                {vilkårsgrunnlag?.vilkårsgrunnlagtype === 'SPLEIS' ? (
                    vurdering ? (
                        <BehandletSykepengegrunnlag
                            vurdering={vurdering}
                            vilkårsgrunnlag={vilkårsgrunnlag as ExternalSpleisVilkårsgrunnlag}
                            organisasjonsnummer={organisasjonsnummer}
                            refusjon={refusjon}
                        />
                    ) : (
                        <SykepengegrunnlagFraSpleis
                            vilkårsgrunnlag={vilkårsgrunnlag as ExternalSpleisVilkårsgrunnlag}
                            organisasjonsnummer={organisasjonsnummer}
                            refusjon={refusjon}
                        />
                    )
                ) : (
                    <SykepengegrunnlagFraInfogtrygd
                        vilkårsgrunnlag={vilkårsgrunnlag as ExternalInfotrygdVilkårsgrunnlag}
                        organisasjonsnummer={organisasjonsnummer}
                    />
                )}
            </AgurkErrorBoundary>
        </section>
    );
};

const SykepengegrunnlagContainer = () => {
    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(
        (activePeriod as BeregnetPeriode).vilkarsgrunnlaghistorikkId,
        (activePeriod as BeregnetPeriode).skjaeringstidspunkt
    );

    if (vilkårsgrunnlag?.vilkarsgrunnlagtype === Vilkarsgrunnlagtype.Spleis) {
        return (
            <BehandletSykepengegrunnlag
                //vurdering={vurdering}
                vilkårsgrunnlag={vilkårsgrunnlag as ExternalSpleisVilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                refusjon={refusjon}
            />
        );
    } else {
        <SykepengegrunnlagFraInfogtrygd
            vilkårsgrunnlag={vilkårsgrunnlag as ExternalInfotrygdVilkårsgrunnlag}
            organisasjonsnummer={organisasjonsnummer}
        />;
    }

    return null;
};

const SykepengegrunnlagSkeleton = () => {
    return <div />;
};

const SykepengegrunnlagError = () => {
    return <div />;
};

export const Sykepengegrunnlag = () => {
    return (
        <React.Suspense fallback={<SykepengegrunnlagSkeleton />}>
            <ErrorBoundary fallback={<SykepengegrunnlagError />}>
                <SykepengegrunnlagContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
