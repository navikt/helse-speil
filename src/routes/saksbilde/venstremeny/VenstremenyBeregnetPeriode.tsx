import { ReactElement } from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { useTotalbeløp } from '@hooks/useTotalbeløp';
import {
    ApiBeregnetPeriode,
    ApiDag,
    ApiPeriode,
    ApiSaksbildePerson,
    ApiUtbetalingsdagtype,
} from '@io/rest/generated/spesialist.schemas';
import { HarBeslutteroppgaver } from '@saksbilde/venstremeny/HarBeslutteroppgaver';
import { HarVurderbareVarsler } from '@saksbilde/venstremeny/HarVurderbareVarsler';
import {
    Inntektsforhold,
    finnForrigeEllerNyesteBehandling,
    tilReferanse,
} from '@state/inntektsforhold/inntektsforhold';
import { useAktivOppgaveForPeriode } from '@state/oppgave';
import { getVilkårsgrunnlag } from '@state/utils';
import { PeriodState } from '@typer/shared';
import { getPeriodStateMedOppgave } from '@utils/mapping';
import { isArbeidsgiver, isSelvstendigNaering } from '@utils/typeguards';

import { VarselObject } from '../varsler/Saksbildevarsler';
import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { Utbetaling } from './utbetaling/Utbetaling';

import styles from './Venstremeny.module.css';

interface VenstremenyBeregnetPeriodeProps {
    activePeriod: ApiBeregnetPeriode;
    currentPerson: ApiSaksbildePerson;
    inntektsforhold: Inntektsforhold;
}

export const VenstremenyBeregnetPeriode = ({
    activePeriod,
    currentPerson,
    inntektsforhold,
}: VenstremenyBeregnetPeriodeProps): ReactElement => {
    const vilkårsgrunnlag = getVilkårsgrunnlag(currentPerson, activePeriod.vilkarsgrunnlagId);

    const { personTotalbeløp, arbeidsgiverTotalbeløp } = useTotalbeløp(
        isSelvstendigNaering(inntektsforhold),
        activePeriod.tidslinje,
    );

    const forrigeBehandlingPeriode: ApiPeriode | null | undefined = finnForrigeEllerNyesteBehandling(
        activePeriod,
        inntektsforhold,
    )?.perioder.find((periode) => periode.vedtaksperiodeId === activePeriod.vedtaksperiodeId);

    const { totalbeløp: gammeltTotalbeløp } = useTotalbeløp(
        isSelvstendigNaering(inntektsforhold),
        forrigeBehandlingPeriode?.tidslinje,
    );
    const harAktivOppgave = useAktivOppgaveForPeriode(activePeriod) !== null;
    const periodState = getPeriodStateMedOppgave(activePeriod, harAktivOppgave);
    const utbetalingsvarsler: VarselObject[] = [utbetaling(periodState), tilstandinfo(periodState)].filter(
        (it) => it,
    ) as VarselObject[];

    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Beregnet
                periode={activePeriod}
                arbeidsforhold={isArbeidsgiver(inntektsforhold) ? inntektsforhold.arbeidsforhold : []}
                inntektsforhold={inntektsforhold}
                dødsdato={currentPerson.dodsdato ?? undefined}
            />
            <UtbetalingCard.Beregnet
                vilkårsgrunnlag={vilkårsgrunnlag}
                antallUtbetalingsdager={getNumberOfDaysWithType(activePeriod.tidslinje, ApiUtbetalingsdagtype.NAVDAG)}
                utbetaling={activePeriod.utbetaling}
                arbeidsgiversimulering={activePeriod.utbetaling.arbeidsgiversimulering}
                personsimulering={activePeriod.utbetaling.personsimulering}
                periodeArbeidsgiverNettoBeløp={arbeidsgiverTotalbeløp}
                periodePersonNettoBeløp={personTotalbeløp}
                gammeltTotalbeløp={forrigeBehandlingPeriode ? gammeltTotalbeløp : undefined}
                inntektsforhold={inntektsforhold}
            />
            <HarVurderbareVarsler person={currentPerson} />
            <HarBeslutteroppgaver person={currentPerson} />
            <Utbetaling
                period={activePeriod}
                person={currentPerson}
                inntektsforholdReferanse={tilReferanse(inntektsforhold)}
            />
            {utbetalingsvarsler.map(({ grad, melding }, index) => (
                <Alert variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Alert>
            ))}
        </section>
    );
};

const getNumberOfDaysWithType = (timeline: ApiDag[], type: ApiUtbetalingsdagtype): number =>
    timeline.filter((it) => it.utbetalingsdagtype === type).length;

const utbetaling = (state: PeriodState): VarselObject | null =>
    ['tilUtbetaling', 'utbetalt', 'revurdert'].includes(state)
        ? { grad: 'info', melding: 'Utbetalingen er sendt til oppdragssystemet.' }
        : ['tilUtbetalingAutomatisk', 'utbetaltAutomatisk'].includes(state)
          ? { grad: 'info', melding: 'Perioden er automatisk godkjent' }
          : null;

const tilstandinfo = (state: PeriodState): VarselObject | null => {
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
