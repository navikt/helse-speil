import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { LoadingShimmer } from '@components/LoadingShimmer';
import {
    Maybe,
    Personinfo,
    Simulering,
    Utbetaling,
    Utbetalingstatus,
    VilkarsgrunnlagInfotrygdV2,
    VilkarsgrunnlagSpleisV2,
} from '@io/graphql';
import { Forsikring } from '@saksbilde/venstremeny/Forsikring';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';
import { isSelvstendigNaering } from '@utils/typeguards';

import { BeløpTilUtbetaling } from './BeløpTilUtbetaling';
import { CardTitle } from './CardTitle';

import styles from './UtbetalingCard.module.css';

interface UtbetalingCardProps {
    vilkårsgrunnlag?: Maybe<VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2>;
    antallUtbetalingsdager: number;
    utbetaling: Utbetaling;
    personinfo: Personinfo;
    arbeidsgiversimulering?: Simulering | null;
    personsimulering?: Simulering | null;
    periodePersonNettoBeløp: number;
    periodeArbeidsgiverNettoBeløp: number;
    gammeltTotalbeløp?: number;
    inntektsforhold: Inntektsforhold;
    erJordbruker: boolean;
    behandlingId: string;
}

const UtbetalingCardBeregnet = ({
    vilkårsgrunnlag,
    antallUtbetalingsdager,
    utbetaling,
    personinfo,
    arbeidsgiversimulering,
    personsimulering,
    periodePersonNettoBeløp,
    periodeArbeidsgiverNettoBeløp,
    gammeltTotalbeløp,
    inntektsforhold,
    erJordbruker,
    behandlingId,
}: UtbetalingCardProps): ReactElement => {
    const forsikringHardkodet = `${erJordbruker ? 100 : 80} % fra 17. dag`;
    return (
        <section className={styles.Card}>
            <CardTitle>UTBETALINGSINFORMASJON</CardTitle>
            <div className={styles.Grid}>
                <BodyShort>Sykepengegrunnlag</BodyShort>
                <BodyShort>{somPenger(vilkårsgrunnlag?.sykepengegrunnlag)}</BodyShort>
                {isSelvstendigNaering(inntektsforhold) &&
                    (erUtvikling ? (
                        <Forsikring behandlingId={behandlingId} forsikringHardkodet={forsikringHardkodet} />
                    ) : (
                        <>
                            <BodyShort>Dekning</BodyShort>
                            <BodyShort>{forsikringHardkodet}</BodyShort>
                        </>
                    ))}
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
                personinfo={personinfo}
                arbeidsgiversimulering={arbeidsgiversimulering}
                personsimulering={personsimulering}
                periodePersonNettoBeløp={periodePersonNettoBeløp}
                periodeArbeidsgiverNettoBeløp={periodeArbeidsgiverNettoBeløp}
                inntektsforhold={inntektsforhold}
            />
            {!arbeidsgiversimulering && !personsimulering && utbetaling.status !== Utbetalingstatus.Annullert && (
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
