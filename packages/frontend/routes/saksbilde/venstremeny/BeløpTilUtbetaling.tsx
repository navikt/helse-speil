import React from 'react';

import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Sykmeldtikon } from '@components/ikoner/Sykmeldtikon';
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
    periodePersonNettoBeløp: number;
    periodeArbeidsgiverNettoBeløp: number;
};

export const BeløpTilUtbetaling = ({
    utbetaling,
    arbeidsgiver,
    personinfo,
    personsimulering,
    arbeidsgiversimulering,
    periodePersonNettoBeløp,
    periodeArbeidsgiverNettoBeløp,
}: BeløpTilUtbetalingProps) => (
    <div className={styles.TilUtbetaling}>
        <div className={styles.Row}>
            <Bold>{utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt beløp' : 'Nytt beløp'}</Bold>
            <Bold className={styles.Total}>{somPenger(periodePersonNettoBeløp + periodeArbeidsgiverNettoBeløp)}</Bold>
        </div>
        <div className={styles.Row}>
            <Tooltip content="Arbeidsgiver">
                <div>
                    <Arbeidsgiverikon alt="Arbeidsgiver" />
                </div>
            </Tooltip>
            <AnonymizableTextWithEllipsis>{arbeidsgiver}</AnonymizableTextWithEllipsis>
            <BodyShort>{somPenger(periodeArbeidsgiverNettoBeløp)}</BodyShort>
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
                <div>
                    <Sykmeldtikon alt="Sykmeldt" />
                </div>
            </Tooltip>
            <AnonymizableTextWithEllipsis>{getFormattedName(personinfo)}</AnonymizableTextWithEllipsis>
            <BodyShort>{somPenger(periodePersonNettoBeløp)}</BodyShort>
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
