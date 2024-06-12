import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { Maybe, Personinfo, Simulering, Utbetaling, Vilkarsgrunnlag } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { BeløpTilUtbetaling } from './BeløpTilUtbetaling';
import { CardTitle } from './CardTitle';

import styles from './UtbetalingCard.module.css';

interface UtbetalingCardProps {
    vilkårsgrunnlag?: Maybe<Vilkarsgrunnlag>;
    antallUtbetalingsdager: number;
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
    arbeidsgiversimulering?: Maybe<Simulering>;
    personsimulering?: Maybe<Simulering>;
    periodePersonNettoBeløp: number;
    periodeArbeidsgiverNettoBeløp: number;
    gammeltTotalbeløp?: number;
}

const UtbetalingCardBeregnet = ({
    vilkårsgrunnlag,
    antallUtbetalingsdager,
    utbetaling,
    arbeidsgiver,
    personinfo,
    arbeidsgiversimulering,
    personsimulering,
    periodePersonNettoBeløp,
    periodeArbeidsgiverNettoBeløp,
    gammeltTotalbeløp,
}: UtbetalingCardProps): ReactElement => (
    <section className={styles.Card}>
        <CardTitle>UTBETALINGSINFORMASJON</CardTitle>
        <div className={styles.Grid}>
            <BodyShort>Sykepengegrunnlag</BodyShort>
            <BodyShort>{somPenger(vilkårsgrunnlag?.sykepengegrunnlag)}</BodyShort>
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
            arbeidsgiver={arbeidsgiver}
            personinfo={personinfo}
            arbeidsgiversimulering={arbeidsgiversimulering}
            personsimulering={personsimulering}
            periodePersonNettoBeløp={periodePersonNettoBeløp}
            periodeArbeidsgiverNettoBeløp={periodeArbeidsgiverNettoBeløp}
        />
        {!arbeidsgiversimulering && !personsimulering && (
            <BodyShort className={styles.ErrorMessage}>Mangler simulering</BodyShort>
        )}
    </section>
);

interface DifferansevisningProps {
    gammeltTotalbeløp: number;
    differanse: number;
}

const Differansevisning = ({ gammeltTotalbeløp, differanse }: DifferansevisningProps): ReactElement => (
    <div className={styles.Grid}>
        <BodyShort>Forrige beløp for perioden</BodyShort>
        <BodyShort>{somPenger(gammeltTotalbeløp)}</BodyShort>
        <BodyShort>Differanse</BodyShort>
        <BodyShort className={classNames({ [styles.NegativePenger]: differanse < 0 })}>
            {somPenger(differanse)}
        </BodyShort>
    </div>
);

const UtbetalingCardSkeleton = (): ReactElement => (
    <section className={classNames(styles.Skeleton, styles.Card)}>
        <LoadingShimmer style={{ width: 100 }} />
        <LoadingShimmer />
        <LoadingShimmer />
    </section>
);

export const UtbetalingCard = {
    Beregnet: UtbetalingCardBeregnet,
    Skeleton: UtbetalingCardSkeleton,
};
