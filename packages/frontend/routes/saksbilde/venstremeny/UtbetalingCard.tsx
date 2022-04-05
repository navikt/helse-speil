import React, { useState } from 'react';
import { BodyShort } from '@navikt/ds-react';
import { Bag, People } from '@navikt/ds-icons';

import { somPenger } from '@utils/locale';
import { useVilkårsgrunnlag } from '@state/person';
import { Maybe, Personinfo, Simulering, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { LinkButton } from '@components/LinkButton';
import { Bold } from '@components/Bold';

import { SimuleringsinfoModal } from './utbetaling/SimuleringsinfoModal';
import { CardTitle } from './CardTitle';

import styles from './UtbetalingCard.module.css';

const getFormattedName = (personinfo: Personinfo): string => {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
};

interface UtbetalingCardProps {
    skjæringstidspunkt: DateString;
    vilkårsgrunnlaghistorikkId: UUID;
    antallUtbetalingsdager: number;
    organisasjonsnummer: string;
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
    arbeidsgiversimulering?: Maybe<Simulering>;
    personsimulering?: Maybe<Simulering>;
}

export const UtbetalingCard = ({
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
                {arbeidsgiversimulering?.perioder !== null && (
                    <LinkButton
                        className={styles.SimuleringButton}
                        onClick={() => setSimulering(arbeidsgiversimulering)}
                    >
                        Simulering
                    </LinkButton>
                )}
                <div className={styles.Row}>
                    <People data-tip="Sykmeldt" title="Arbeidstaker" />
                    <AnonymizableTextWithEllipsis>{getFormattedName(personinfo)}</AnonymizableTextWithEllipsis>
                    <BodyShort>{somPenger(utbetaling.personNettoBelop)}</BodyShort>
                </div>
                {personsimulering?.perioder !== null && (
                    <LinkButton className={styles.SimuleringButton} onClick={() => setSimulering(personsimulering)}>
                        Simulering
                    </LinkButton>
                )}
            </div>
            {simulering && <SimuleringsinfoModal simulering={simulering} lukkModal={() => setSimulering(null)} />}
            {!arbeidsgiversimulering && !personsimulering && (
                <BodyShort className={styles.ErrorMessage}>Mangler simulering</BodyShort>
            )}
        </section>
    );
};
