import React from 'react';

import { Bag, People } from '@navikt/ds-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Maybe, Personinfo, Simulering, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { OpenSimuleringButton } from './utbetaling/simulering/OpenSimuleringButton';

import styles from './BeløpTilUtbetaling.module.css';

const isSimulering = (simulering?: Maybe<Simulering>): simulering is Simulering => {
    return Array.isArray(simulering?.perioder);
};

const getFormattedName = (personinfo: Personinfo): string => {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
};

type BeløpTilUtbetalingProps = {
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
    arbeidsgiversimulering?: Maybe<Simulering>;
    personsimulering?: Maybe<Simulering>;
};

export const BeløpTilUtbetaling = ({
    utbetaling,
    arbeidsgiver,
    personinfo,
    personsimulering,
    arbeidsgiversimulering,
}: BeløpTilUtbetalingProps) => {
    return (
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
            {arbeidsgiversimulering && isSimulering(arbeidsgiversimulering) && (
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
            {personsimulering && isSimulering(personsimulering) && (
                <OpenSimuleringButton
                    simulering={personsimulering}
                    utbetaling={utbetaling}
                    className={styles.SimuleringButton}
                />
            )}
        </div>
    );
};
