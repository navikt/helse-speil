import React from 'react';

import { BodyShort, HStack, Spacer } from '@navikt/ds-react';

import { Arbeidsgivernavn, erSelvstendigNæringsdrivende } from '@components/Arbeidsgivernavn';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SelvstendigNæringsdrivendeIkon } from '@components/ikoner/SelvstendigNæringsdrivendeIkon';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Maybe, Personinfo, Simulering, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { capitalizeName, somPenger } from '@utils/locale';

import { OpenSimuleringButton } from './utbetaling/simulering/OpenSimuleringButton';

import styles from './BeløpTilUtbetaling.module.css';

type BeløpTilUtbetalingProps = {
    utbetaling: Utbetaling;
    arbeidsgiverIdentifikator: string;
    arbeidsgiverNavn: string;
    personinfo: Personinfo;
    arbeidsgiversimulering?: Maybe<Simulering>;
    personsimulering?: Maybe<Simulering>;
    periodePersonNettoBeløp: number;
    periodeArbeidsgiverNettoBeløp: number;
};

export const BeløpTilUtbetaling = ({
    utbetaling,
    arbeidsgiverIdentifikator,
    arbeidsgiverNavn,
    personinfo,
    personsimulering,
    arbeidsgiversimulering,
    periodePersonNettoBeløp,
    periodeArbeidsgiverNettoBeløp,
}: BeløpTilUtbetalingProps) => (
    <div className={styles.TilUtbetaling}>
        <HStack align="center" gap="4" className={styles.Row}>
            <BodyShort weight="semibold">
                {utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt for perioden' : 'Beløp for perioden'}
            </BodyShort>
            <Spacer />
            <BodyShort weight="semibold">
                {somPenger(periodePersonNettoBeløp + periodeArbeidsgiverNettoBeløp)}
            </BodyShort>
        </HStack>
        <HStack align="center" gap="4" className={styles.Row}>
            {erSelvstendigNæringsdrivende(arbeidsgiverIdentifikator) ? (
                <SelvstendigNæringsdrivendeIkon />
            ) : (
                <Arbeidsgiverikon />
            )}
            <Arbeidsgivernavn identifikator={arbeidsgiverIdentifikator} navn={arbeidsgiverNavn} maxWidth="200px" />
            <Spacer />
            <BodyShort>{somPenger(periodeArbeidsgiverNettoBeløp)}</BodyShort>
        </HStack>
        {arbeidsgiversimulering && isSimulering(arbeidsgiversimulering) && (
            <OpenSimuleringButton
                simulering={arbeidsgiversimulering}
                utbetaling={utbetaling}
                className={styles.SimuleringButton}
            />
        )}
        <HStack align="center" gap="4" className={styles.Row}>
            <SykmeldtikonMedTooltip />
            <AnonymizableTextWithEllipsis>{capitalizeName(getFormattedName(personinfo))}</AnonymizableTextWithEllipsis>
            <Spacer />
            <BodyShort>{somPenger(periodePersonNettoBeløp)}</BodyShort>
        </HStack>
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
