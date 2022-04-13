import React, { useState } from 'react';
import { BodyShort } from '@navikt/ds-react';
import { Bag, People } from '@navikt/ds-icons';

import { somPenger } from '@utils/locale';
import { useVilkårsgrunnlag } from '@state/person';
import { Maybe, Personinfo, Simulering, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Bold } from '@components/Bold';

import { CardTitle } from './CardTitle';
import { ShowSimuleringButton } from './utbetaling/SimuleringsinfoPopup';

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
    fødselsnummer: string;
    skjæringstidspunkt: DateString;
    vilkårsgrunnlaghistorikkId: string;
    antallUtbetalingsdager: number;
    organisasjonsnummer: string;
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
    arbeidsgiversimulering?: Maybe<Simulering>;
    personsimulering?: Maybe<Simulering>;
}

export const UtbetalingCard = ({
    fødselsnummer,
    skjæringstidspunkt,
    vilkårsgrunnlaghistorikkId,
    antallUtbetalingsdager,
    organisasjonsnummer,
    utbetaling,
    arbeidsgiver,
    personinfo,
    arbeidsgiversimulering,
    personsimulering,
}: UtbetalingCardProps) => {
    const [simulering, setSimulering] = useState<Simulering | null>();

    const vilkårsgrunnlaghistorikk = useVilkårsgrunnlag(vilkårsgrunnlaghistorikkId, skjæringstidspunkt);

    return (
        <section>
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
                    <Bag data-tip="Arbeidsgiver" title="Arbeidsgiver" />
                    <AnonymizableTextWithEllipsis>{arbeidsgiver}</AnonymizableTextWithEllipsis>
                    <BodyShort>{somPenger(utbetaling.arbeidsgiverNettoBelop)}</BodyShort>
                </div>
                {isSimulering(arbeidsgiversimulering) && (
                    <ShowSimuleringButton
                        data={arbeidsgiversimulering}
                        utbetaling={utbetaling}
                        personinfo={personinfo}
                        fødselsnummer={fødselsnummer}
                        className={styles.SimuleringButton}
                    />
                )}
                <div className={styles.Row}>
                    <People data-tip="Sykmeldt" title="Arbeidstaker" />
                    <AnonymizableTextWithEllipsis>{getFormattedName(personinfo)}</AnonymizableTextWithEllipsis>
                    <BodyShort>{somPenger(utbetaling.personNettoBelop)}</BodyShort>
                </div>
                {isSimulering(personsimulering) && (
                    <ShowSimuleringButton
                        data={personsimulering}
                        utbetaling={utbetaling}
                        personinfo={personinfo}
                        fødselsnummer={fødselsnummer}
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
