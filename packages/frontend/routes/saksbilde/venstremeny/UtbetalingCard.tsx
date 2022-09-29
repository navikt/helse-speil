import React from 'react';
import classNames from 'classnames';
import { BodyShort, Tooltip } from '@navikt/ds-react';
import { Bag, People } from '@navikt/ds-icons';

import { somPenger } from '@utils/locale';
import { useVilkårsgrunnlag } from '@state/person';
import { Maybe, Personinfo, Simulering, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { Bold } from '@components/Bold';

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
    skjæringstidspunkt: DateString;
    vilkårsgrunnlaghistorikkId: string;
    antallUtbetalingsdager: number;
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
    harRefusjon: boolean;
    arbeidsgiversimulering?: Maybe<Simulering>;
    personsimulering?: Maybe<Simulering>;
}

const UtbetalingCardBeregnet = ({
    skjæringstidspunkt,
    vilkårsgrunnlaghistorikkId,
    antallUtbetalingsdager,
    utbetaling,
    arbeidsgiver,
    personinfo,
    harRefusjon,
    arbeidsgiversimulering,
    personsimulering,
}: UtbetalingCardProps) => {
    const vilkårsgrunnlaghistorikk = useVilkårsgrunnlag(vilkårsgrunnlaghistorikkId, skjæringstidspunkt);

    return (
        <section className={styles.Card}>
            <CardTitle>TIL UTBETALING</CardTitle>
            <div className={styles.Grid}>
                <BodyShort>Sykepengegrunnlag</BodyShort>
                <BodyShort>{somPenger(vilkårsgrunnlaghistorikk?.sykepengegrunnlag)}</BodyShort>
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
                        harRefusjon={harRefusjon}
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
                        harRefusjon={harRefusjon}
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
