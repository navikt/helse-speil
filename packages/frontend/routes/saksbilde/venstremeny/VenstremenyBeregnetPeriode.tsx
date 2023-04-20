import React from 'react';

import { ErrorMessage } from '@components/ErrorMessage';
import { useForrigeGenerasjonPeriode } from '@hooks/useForrigeGenerasjonPeriode';
import { useTotalbeløp } from '@hooks/useTotalbeløp';
import { Arbeidsgiver, Dag, Handling, Periode, Periodehandling, Utbetalingsdagtype } from '@io/graphql';
import { getRequiredVilkårsgrunnlag, getVilkårsgrunnlag } from '@state/selectors/person';

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

const finnUtbetaleTilgang = ({ handlinger }: FetchedBeregnetPeriode): Handling =>
    handlinger.find((handling) => handling.type === Periodehandling.Utbetale)!;

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

    const { personTotalbeløp, arbeidsgiverTotalbeløp } = useTotalbeløp(activePeriod.tidslinje);

    const forrigeGenerasjonPeriode: Maybe<Periode> | undefined = useForrigeGenerasjonPeriode();

    const { totalbeløp: gammeltTotalbeløp } = useTotalbeløp(forrigeGenerasjonPeriode?.tidslinje);

    const utbetaleTilgang = finnUtbetaleTilgang(activePeriod);

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
                periodeArbeidsgiverNettoBeløp={arbeidsgiverTotalbeløp}
                periodePersonNettoBeløp={personTotalbeløp}
                gammeltTotalbeløp={forrigeGenerasjonPeriode ? gammeltTotalbeløp : undefined}
            />
            {!utbetaleTilgang.tillatt ? (
                <Feilmelding handling={utbetaleTilgang} />
            ) : (
                !readOnly && (
                    <Utbetaling period={activePeriod} person={currentPerson} arbeidsgiver={currentArbeidsgiver.navn} />
                )
            )}
        </section>
    );
};

type FeilmeldingProps = {
    handling: Handling;
};

const Feilmelding = ({ handling }: FeilmeldingProps) => {
    let errorMessage;
    if (handling.begrunnelse !== 'IkkeTilgangTilRisk')
        errorMessage = 'Dette er en risk-sak. Det kreves egen tilgang for å behandle disse.';
    else errorMessage = 'Du har ikke tilgang til å behandle denne saken';
    return <ErrorMessage>{errorMessage}</ErrorMessage>;
};

const getNumberOfDaysWithType = (timeline: Array<Dag>, type: Utbetalingsdagtype): number =>
    timeline.filter((it) => it.utbetalingsdagtype === type).length;
