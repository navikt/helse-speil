import React from 'react';

import { Arbeidsgiver, Dag, Utbetalingsdagtype } from '@io/graphql';
import { getRequiredVilkårsgrunnlag } from '@state/selectors/person';

import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { Utbetaling } from './utbetaling/Utbetaling';

import styles from './Venstremeny.module.css';

const getNumberOfDaysWithType = (timeline: Array<Dag>, type: Utbetalingsdagtype): number => {
    return timeline.filter((it) => it.utbetalingsdagtype === type).length;
};

interface VenstremenyBeregnetPeriodeProps {
    activePeriod: FetchedBeregnetPeriode;
    currentPerson: FetchedPerson;
    currentArbeidsgiver: Arbeidsgiver;
    readOnly: boolean;
}

export const VenstremenyBeregnetPeriode: React.FC<VenstremenyBeregnetPeriodeProps> = ({
    activePeriod,
    currentPerson,
    currentArbeidsgiver,
    readOnly,
}) => {
    const månedsbeløp = getRequiredVilkårsgrunnlag(currentPerson, activePeriod.vilkarsgrunnlagId)?.inntekter.find(
        (it) => it.arbeidsgiver === currentArbeidsgiver.organisasjonsnummer
    )?.omregnetArsinntekt?.manedsbelop;

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Beregnet periode={activePeriod} arbeidsgiver={currentArbeidsgiver} månedsbeløp={månedsbeløp} />
            <UtbetalingCard.Beregnet
                vilkårsgrunnlagId={activePeriod.vilkarsgrunnlagId}
                antallUtbetalingsdager={getNumberOfDaysWithType(activePeriod.tidslinje, Utbetalingsdagtype.Navdag)}
                utbetaling={activePeriod.utbetaling}
                arbeidsgiver={currentArbeidsgiver.navn}
                personinfo={currentPerson.personinfo}
                harRefusjon={!!activePeriod.refusjon}
                arbeidsgiversimulering={activePeriod.utbetaling.arbeidsgiversimulering}
                personsimulering={activePeriod.utbetaling.personsimulering}
            />
            {!readOnly && <Utbetaling activePeriod={activePeriod} currentPerson={currentPerson} />}
        </section>
    );
};
