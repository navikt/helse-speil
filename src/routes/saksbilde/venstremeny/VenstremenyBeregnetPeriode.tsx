import { ReactElement } from 'react';

import { Alert, BodyShort, ErrorMessage } from '@navikt/ds-react';

import { useForrigeGenerasjonPeriode } from '@hooks/useForrigeGenerasjonPeriode';
import { useTotalbeløp } from '@hooks/useTotalbeløp';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Dag,
    Handling,
    Maybe,
    Periode,
    Periodehandling,
    Periodetilstand,
    PersonFragment,
    Utbetalingsdagtype,
} from '@io/graphql';
import { HarBeslutteroppgaver } from '@saksbilde/venstremeny/HarBeslutteroppgaver';
import { HarVurderbareVarsler } from '@saksbilde/venstremeny/HarVurderbareVarsler';
import { getVilkårsgrunnlag } from '@state/utils';
import { PeriodState } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';

import { VarselObject } from '../varsler/Saksbildevarsler';
import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { Utbetaling } from './utbetaling/Utbetaling';

import styles from './Venstremeny.module.css';

interface VenstremenyBeregnetPeriodeProps {
    activePeriod: BeregnetPeriodeFragment;
    currentPerson: PersonFragment;
    currentArbeidsgiver: ArbeidsgiverFragment;
}

const finnUtbetaleTilgang = ({ handlinger }: BeregnetPeriodeFragment): Handling =>
    handlinger.find((handling) => handling.type === Periodehandling.Utbetale) as Handling;

export const VenstremenyBeregnetPeriode = ({
    activePeriod,
    currentPerson,
    currentArbeidsgiver,
}: VenstremenyBeregnetPeriodeProps): ReactElement => {
    const vilkårsgrunnlag = getVilkårsgrunnlag(currentPerson, activePeriod.vilkarsgrunnlagId);
    const månedsbeløp = vilkårsgrunnlag?.inntekter.find(
        (it) => it.arbeidsgiver === currentArbeidsgiver.organisasjonsnummer,
    )?.omregnetArsinntekt?.manedsbelop;

    const { personTotalbeløp, arbeidsgiverTotalbeløp } = useTotalbeløp(activePeriod.tidslinje);

    const forrigeGenerasjonPeriode: Maybe<Periode> | undefined = useForrigeGenerasjonPeriode(
        currentArbeidsgiver,
        activePeriod,
        currentPerson,
    );

    const { totalbeløp: gammeltTotalbeløp } = useTotalbeløp(forrigeGenerasjonPeriode?.tidslinje);
    const utbetaleTilgang = finnUtbetaleTilgang(activePeriod);
    const periodState = getPeriodState(activePeriod);
    const utbetalingsvarsler: VarselObject[] = [utbetaling(periodState), tilstandinfo(periodState)].filter(
        (it) => it,
    ) as VarselObject[];

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Beregnet periode={activePeriod} arbeidsgiver={currentArbeidsgiver} månedsbeløp={månedsbeløp} />
            <UtbetalingCard.Beregnet
                vilkårsgrunnlag={vilkårsgrunnlag}
                antallUtbetalingsdager={getNumberOfDaysWithType(activePeriod.tidslinje, Utbetalingsdagtype.Navdag)}
                utbetaling={activePeriod.utbetaling}
                arbeidsgiverIdentifikator={currentArbeidsgiver.organisasjonsnummer}
                arbeidsgiverNavn={currentArbeidsgiver.navn}
                personinfo={currentPerson.personinfo}
                arbeidsgiversimulering={activePeriod.utbetaling.arbeidsgiversimulering}
                personsimulering={activePeriod.utbetaling.personsimulering}
                periodeArbeidsgiverNettoBeløp={arbeidsgiverTotalbeløp}
                periodePersonNettoBeløp={personTotalbeløp}
                gammeltTotalbeløp={forrigeGenerasjonPeriode ? gammeltTotalbeløp : undefined}
            />
            {activePeriod.periodetilstand === Periodetilstand.TilGodkjenning && !utbetaleTilgang.tillatt ? (
                <ErrorMessage>Du har ikke tilgang til å behandle denne oppgaven</ErrorMessage>
            ) : (
                <>
                    <HarVurderbareVarsler person={currentPerson} />
                    <HarBeslutteroppgaver person={currentPerson} />
                    <Utbetaling period={activePeriod} person={currentPerson} arbeidsgiver={currentArbeidsgiver} />
                </>
            )}
            {utbetalingsvarsler.map(({ grad, melding }, index) => (
                <Alert variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Alert>
            ))}
        </section>
    );
};

const getNumberOfDaysWithType = (timeline: Array<Dag>, type: Utbetalingsdagtype): number =>
    timeline.filter((it) => it.utbetalingsdagtype === type).length;

const utbetaling = (state: PeriodState): Maybe<VarselObject> =>
    ['tilUtbetaling', 'utbetalt', 'revurdert'].includes(state)
        ? { grad: 'info', melding: 'Utbetalingen er sendt til oppdragsystemet.' }
        : ['tilUtbetalingAutomatisk', 'utbetaltAutomatisk'].includes(state)
          ? { grad: 'info', melding: 'Perioden er automatisk godkjent' }
          : null;

const tilstandinfo = (state: PeriodState): Maybe<VarselObject> => {
    switch (state) {
        case 'kunFerie':
        case 'kunPermisjon':
        case 'revurdertIngenUtbetaling':
        case 'ingenUtbetaling':
            return { grad: 'info', melding: 'Perioden er godkjent, ingen utbetaling.' };
        case 'annullert':
            return { grad: 'info', melding: 'Utbetalingen er annullert.' };
        case 'tilAnnullering':
            return { grad: 'info', melding: 'Annullering venter.' };
        default:
            return null;
    }
};
