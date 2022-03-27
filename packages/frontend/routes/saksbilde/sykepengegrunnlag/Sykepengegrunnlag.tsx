import styled from '@emotion/styled';
import React from 'react';

import { AgurkErrorBoundary } from '@components/AgurkErrorBoundary';
import { useOrganisasjonsnummer, useVilkårsgrunnlaghistorikk, useVurderingForSkjæringstidspunkt } from '@state/person';
import { useMaybeAktivPeriode } from '@state/tidslinje';
import { Refusjon } from '@io/graphql';

import { BehandletSykepengegrunnlag } from './BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './SykepengegrunnlagFraInfotrygd';
import { UbehandletSykepengegrunnlag } from './UbehandletSykepengegrunnlag';

import styles from './Sykepengegrunnlag.module.css';
import classNames from 'classnames';

interface SykepengegrunnlagProps extends React.HTMLAttributes<HTMLElement> {
    vilkårsgrunnlaghistorikkId: UUID;
    skjæringstidspunkt: DateString;
    refusjon?: Refusjon | null;
}

export const Sykepengegrunnlag: React.VFC<SykepengegrunnlagProps> = ({
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
                        <UbehandletSykepengegrunnlag
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
