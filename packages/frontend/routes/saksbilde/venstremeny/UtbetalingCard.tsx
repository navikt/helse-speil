import { BeløpTilUtbetaling } from './BeløpTilUtbetaling';
import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { Maybe, Personinfo, Simulering, Utbetaling, Vilkarsgrunnlag } from '@io/graphql';
import { somPenger } from '@utils/locale';

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
}

const UtbetalingCardBeregnet = ({
    vilkårsgrunnlag,
    antallUtbetalingsdager,
    utbetaling,
    arbeidsgiver,
    personinfo,
    arbeidsgiversimulering,
    personsimulering,
}: UtbetalingCardProps) => {
    return (
        <section className={styles.Card}>
            <CardTitle>TIL UTBETALING</CardTitle>
            <div className={styles.Grid}>
                <BodyShort>Sykepengegrunnlag</BodyShort>
                <BodyShort>{somPenger(vilkårsgrunnlag?.sykepengegrunnlag)}</BodyShort>
                <BodyShort>Utbetalingsdager</BodyShort>
                <BodyShort>{antallUtbetalingsdager}</BodyShort>
            </div>
            <BeløpTilUtbetaling
                utbetaling={utbetaling}
                arbeidsgiver={arbeidsgiver}
                personinfo={personinfo}
                arbeidsgiversimulering={arbeidsgiversimulering}
                personsimulering={personsimulering}
            />
            {!arbeidsgiversimulering && !personsimulering && (
                <BodyShort className={styles.ErrorMessage}>Mangler simulering</BodyShort>
            )}
        </section>
    );
};

const UtbetalingCardSkeleton: React.FC = () => {
    return (
        <section className={classNames(styles.Skeleton, styles.Card)}>
            <LoadingShimmer style={{ width: 100 }} />
            <LoadingShimmer />
            <LoadingShimmer />
        </section>
    );
};

export const UtbetalingCard = {
    Beregnet: UtbetalingCardBeregnet,
    Skeleton: UtbetalingCardSkeleton,
};
