import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Maybe, Personinfo, Simulering, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { capitalize, capitalizeArbeidsgiver, somPenger } from '@utils/locale';

import { OpenSimuleringButton } from './utbetaling/simulering/OpenSimuleringButton';

import styles from './BeløpTilUtbetaling.module.css';

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
            <BodyShort weight="semibold">
                {utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt for perioden' : 'Beløp for perioden'}
            </BodyShort>
            <BodyShort weight="semibold">
                {somPenger(periodePersonNettoBeløp + periodeArbeidsgiverNettoBeløp)}
            </BodyShort>
        </div>
        <div className={styles.Row}>
            <ArbeidsgiverikonMedTooltip />
            <AnonymizableTextWithEllipsis>{capitalizeArbeidsgiver(arbeidsgiver)}</AnonymizableTextWithEllipsis>
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
            <SykmeldtikonMedTooltip />
            <AnonymizableTextWithEllipsis>{capitalize(getFormattedName(personinfo))}</AnonymizableTextWithEllipsis>
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

const getFormattedName = (personinfo: Personinfo): string => {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
};

const isSimulering = (simulering?: Maybe<Simulering>): simulering is Simulering => {
    return Array.isArray(simulering?.perioder);
};
