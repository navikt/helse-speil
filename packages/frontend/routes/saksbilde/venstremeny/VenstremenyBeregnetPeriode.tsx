import React, { useMemo } from 'react';

import { useForrigeGenerasjonPeriode } from '@hooks/useForrigeGenerasjonPeriode';
import { Arbeidsgiver, Dag, Periode, Utbetalingsdagtype } from '@io/graphql';
import { getRequiredVilkårsgrunnlag, getVilkårsgrunnlag } from '@state/selectors/person';

import {
    getDagerMedUtbetaling,
    getTotalArbeidsgiverbeløp,
    getTotalPersonbeløp,
} from '../utbetaling/utbetalingstabell/TotalRow';
import { useTabelldagerMap } from '../utbetaling/utbetalingstabell/useTabelldagerMap';
import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { Utbetaling } from './utbetaling/Utbetaling';

import styles from './Venstremeny.module.css';

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

    const vilkårsgrunnlag = getVilkårsgrunnlag(currentPerson, activePeriod.vilkarsgrunnlagId);

    const dager = useTabelldagerMap({ tidslinje: activePeriod.tidslinje });
    const utbetalingsdager = getDagerMedUtbetaling(useMemo(() => Array.from(dager.values()), [dager]));

    const forrigeGenerasjonPeriode: Maybe<Periode> | undefined = useForrigeGenerasjonPeriode();

    const gamleDager = useTabelldagerMap({ tidslinje: forrigeGenerasjonPeriode?.tidslinje ?? [] });
    const gamleUtbetalingsdager = getDagerMedUtbetaling(useMemo(() => Array.from(gamleDager.values()), [gamleDager]));

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Beregnet periode={activePeriod} arbeidsgiver={currentArbeidsgiver} månedsbeløp={månedsbeløp} />
            <UtbetalingCard.Beregnet
                vilkårsgrunnlag={vilkårsgrunnlag}
                antallUtbetalingsdager={getNumberOfDaysWithType(activePeriod.tidslinje, Utbetalingsdagtype.Navdag)}
                utbetaling={activePeriod.utbetaling}
                arbeidsgiver={currentArbeidsgiver.navn}
                personinfo={currentPerson.personinfo}
                arbeidsgiversimulering={activePeriod.utbetaling.arbeidsgiversimulering}
                personsimulering={activePeriod.utbetaling.personsimulering}
                periodeArbeidsgiverNettoBeløp={getTotalArbeidsgiverbeløp(utbetalingsdager)}
                periodePersonNettoBeløp={getTotalPersonbeløp(utbetalingsdager)}
                gammeltTotalbeløp={getTotalbeløp(gamleUtbetalingsdager)}
            />
            {!readOnly && (
                <Utbetaling period={activePeriod} person={currentPerson} arbeidsgiver={currentArbeidsgiver.navn} />
            )}
        </section>
    );
};

const getTotalbeløp = (gamleUtbetalingsdager: Array<UtbetalingstabellDag>) =>
    gamleUtbetalingsdager.length > 0
        ? gamleUtbetalingsdager.reduce((total, dag) => total + (dag.personbeløp ?? 0) + (dag.arbeidsgiverbeløp ?? 0), 0)
        : undefined;

const getNumberOfDaysWithType = (timeline: Array<Dag>, type: Utbetalingsdagtype): number =>
    timeline.filter((it) => it.utbetalingsdagtype === type).length;
