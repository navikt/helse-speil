import classNames from 'classnames';
import React from 'react';

import { Bag, People } from '@navikt/ds-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Maybe, Personinfo, Simulering, Utbetaling, Utbetalingstatus, Vilkarsgrunnlag } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { CardTitle } from './CardTitle';
import { OpenSimuleringButton } from './utbetaling/simulering/OpenSimuleringButton';

import styles from './UtbetalingCard.module.css';

const isSimulering = (simulering?: Maybe<Simulering>): simulering is Simulering => {
    return Array.isArray(simulering?.perioder);
};

const getFormattedName = (personinfo: Personinfo): string => {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
};

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
            <div className={styles.TilUtbetaling}>
                <div className={styles.Row}>
                    <Bold>
                        {utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt beløp' : 'Beløp til utbetaling'}
                    </Bold>
                    <Bold className={styles.Total}>
                        {somPenger(utbetaling.arbeidsgiverNettoBelop + utbetaling.personNettoBelop)}
                    </Bold>
                </div>
                <div className={styles.Row}>
                    <Tooltip content="Arbeidsgiver">
                        <Bag title="Arbeidsgiver" />
                    </Tooltip>
                    <AnonymizableTextWithEllipsis>{arbeidsgiver}</AnonymizableTextWithEllipsis>
                    <BodyShort>{somPenger(utbetaling.arbeidsgiverNettoBelop)}</BodyShort>
                </div>
                {isSimulering(arbeidsgiversimulering) && (
                    <OpenSimuleringButton
                        simulering={arbeidsgiversimulering}
                        utbetaling={utbetaling}
                        className={styles.SimuleringButton}
                    />
                )}
                <div className={styles.Row}>
                    <Tooltip content="Sykmeldt">
                        <People title="Sykmeldt" />
                    </Tooltip>
                    <AnonymizableTextWithEllipsis>{getFormattedName(personinfo)}</AnonymizableTextWithEllipsis>
                    <BodyShort>{somPenger(utbetaling.personNettoBelop)}</BodyShort>
                </div>
                {isSimulering(personsimulering) && (
                    <OpenSimuleringButton
                        simulering={personsimulering}
                        utbetaling={utbetaling}
                        className={styles.SimuleringButton}
                    />
                )}
            </div>
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
