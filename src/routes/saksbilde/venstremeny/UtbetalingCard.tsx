import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import {
    ApiSimulering,
    ApiUtbetaling,
    ApiUtbetalingstatus,
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
} from '@io/rest/generated/spesialist.schemas';
import { Forsikring } from '@saksbilde/venstremeny/Forsikring';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';
import { isSelvstendigNaering } from '@utils/typeguards';

import { BeløpTilUtbetaling } from './BeløpTilUtbetaling';
import { CardTitle } from './CardTitle';

import styles from './UtbetalingCard.module.css';

interface UtbetalingCardProps {
    vilkårsgrunnlag?: ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2 | null;
    antallUtbetalingsdager: number;
    utbetaling: ApiUtbetaling;
    arbeidsgiversimulering?: ApiSimulering | null;
    personsimulering?: ApiSimulering | null;
    periodePersonNettoBeløp: number;
    periodeArbeidsgiverNettoBeløp: number;
    gammeltTotalbeløp?: number;
    inntektsforhold: Inntektsforhold;
}

const UtbetalingCardBeregnet = ({
    vilkårsgrunnlag,
    antallUtbetalingsdager,
    utbetaling,
    arbeidsgiversimulering,
    personsimulering,
    periodePersonNettoBeløp,
    periodeArbeidsgiverNettoBeløp,
    gammeltTotalbeløp,
    inntektsforhold,
}: UtbetalingCardProps): ReactElement => {
    return (
        <section className={styles.Card}>
            <CardTitle>UTBETALINGSINFORMASJON</CardTitle>
            <div className={styles.Grid}>
                <BodyShort>Sykepengegrunnlag</BodyShort>
                <BodyShort>{somPenger(vilkårsgrunnlag?.sykepengegrunnlag)}</BodyShort>
                {isSelvstendigNaering(inntektsforhold) && (
                    <Forsikring
                        forsikringsvurderingId={
                            (vilkårsgrunnlag as ApiVilkårsgrunnlagSpleisV2)?.forsikringsvurderingId ?? null
                        }
                    />
                )}
                <BodyShort>Utbetalingsdager</BodyShort>
                <BodyShort>{antallUtbetalingsdager}</BodyShort>
            </div>
            {gammeltTotalbeløp !== undefined && (
                <Differansevisning
                    gammeltTotalbeløp={gammeltTotalbeløp}
                    differanse={periodePersonNettoBeløp + periodeArbeidsgiverNettoBeløp - gammeltTotalbeløp}
                />
            )}
            <BeløpTilUtbetaling
                utbetaling={utbetaling}
                arbeidsgiversimulering={arbeidsgiversimulering}
                personsimulering={personsimulering}
                periodePersonNettoBeløp={periodePersonNettoBeløp}
                periodeArbeidsgiverNettoBeløp={periodeArbeidsgiverNettoBeløp}
                inntektsforhold={inntektsforhold}
            />
            {!arbeidsgiversimulering && !personsimulering && utbetaling.status !== ApiUtbetalingstatus.ANNULLERT && (
                <BodyShort className={styles.ErrorMessage}>Mangler simulering</BodyShort>
            )}
        </section>
    );
};

interface DifferansevisningProps {
    gammeltTotalbeløp: number;
    differanse: number;
}

const Differansevisning = ({ gammeltTotalbeløp, differanse }: DifferansevisningProps): ReactElement => (
    <div className={styles.Grid}>
        <BodyShort>Forrige beløp for perioden</BodyShort>
        <BodyShort>{somPenger(gammeltTotalbeløp)}</BodyShort>
        <BodyShort>Differanse</BodyShort>
        <BodyShort className={cn(differanse < 0 && styles.NegativePenger)}>{somPenger(differanse)}</BodyShort>
    </div>
);

const UtbetalingCardSkeleton = (): ReactElement => (
    <section className={cn(styles.Skeleton, styles.Card)}>
        <LoadingShimmer style={{ width: 100 }} />
        <LoadingShimmer />
        <LoadingShimmer />
    </section>
);

export const UtbetalingCard = {
    Beregnet: UtbetalingCardBeregnet,
    Skeleton: UtbetalingCardSkeleton,
};
