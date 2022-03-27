import React from 'react';

import { Arbeidsgiver, BeregnetPeriode, Dag, Person, Utbetalingsdagtype } from '@io/graphql';

import { VilkårCard } from './VilkårCard';
import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { ArbeidsgiverCard } from './ArbeidsgiverCard';

import styles from './Venstremeny.module.css';
import { Utbetaling } from './utbetaling/Utbetaling';

const getNumberOfDaysWithType = (timeline: Array<Dag>, type: Utbetalingsdagtype): number => {
    return timeline.filter((it) => it.utbetalingsdagtype === type).length;
};

interface VenstremenyBeregnetPeriodeProps {
    activePeriod: BeregnetPeriode;
    currentPerson: Person;
    currentArbeidsgiver: Arbeidsgiver;
}

export const VenstremenyBeregnetPeriode: React.VFC<VenstremenyBeregnetPeriodeProps> = ({
    activePeriod,
    currentPerson,
    currentArbeidsgiver,
}) => {
    const månedsbeløp = currentPerson.inntektsgrunnlag
        .find((it) => it.skjaeringstidspunkt === activePeriod.skjaeringstidspunkt)
        ?.inntekter.find((it) => it.arbeidsgiver === currentArbeidsgiver.organisasjonsnummer)
        ?.omregnetArsinntekt?.manedsbelop;

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard activePeriod={activePeriod} />
            <ArbeidsgiverCard
                navn={currentArbeidsgiver.navn}
                organisasjonsnummer={currentArbeidsgiver.organisasjonsnummer}
                arbeidsforhold={currentArbeidsgiver.arbeidsforhold}
                månedsbeløp={månedsbeløp}
            />
            <VilkårCard activePeriod={activePeriod} currentPerson={currentPerson} />
            <UtbetalingCard
                skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                vilkårsgrunnlaghistorikkId={activePeriod.vilkarsgrunnlaghistorikkId}
                antallUtbetalingsdager={getNumberOfDaysWithType(activePeriod.tidslinje, Utbetalingsdagtype.Navdag)}
                organisasjonsnummer={currentArbeidsgiver.organisasjonsnummer}
                utbetaling={activePeriod.utbetaling}
                arbeidsgiver={currentArbeidsgiver.navn}
                personinfo={currentPerson.personinfo}
                arbeidsgiversimulering={activePeriod.utbetaling.arbeidsgiversimulering}
                personsimulering={activePeriod.utbetaling.personsimulering}
            />
            <Utbetaling activePeriod={activePeriod} currentPerson={currentPerson} />
        </section>
    );
};
