import { ReactElement } from 'react';

import { Alert, BodyShort, ErrorMessage } from '@navikt/ds-react';

import { useTotalbeløp } from '@hooks/useTotalbeløp';
import {
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
import { Inntektsforhold, finnForrigeEllerNyesteGenerasjon } from '@state/arbeidsgiver';
import { getVilkårsgrunnlag } from '@state/utils';
import { PeriodState } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';
import { isArbeidsgiver, isSelvstendigNaering } from '@utils/typeguards';

import { VarselObject } from '../varsler/Saksbildevarsler';
import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { Utbetaling } from './utbetaling/Utbetaling';

import styles from './Venstremeny.module.css';

interface VenstremenyBeregnetPeriodeProps {
    activePeriod: BeregnetPeriodeFragment;
    currentPerson: PersonFragment;
    inntektsforhold: Inntektsforhold;
}

const finnUtbetaleTilgang = ({ handlinger }: BeregnetPeriodeFragment): Handling =>
    handlinger.find((handling) => handling.type === Periodehandling.Utbetale) as Handling;

export const VenstremenyBeregnetPeriode = ({
    activePeriod,
    currentPerson,
    inntektsforhold,
}: VenstremenyBeregnetPeriodeProps): ReactElement => {
    const vilkårsgrunnlag = getVilkårsgrunnlag(currentPerson, activePeriod.vilkarsgrunnlagId);
    const månedsbeløp = vilkårsgrunnlag?.inntekter.find(
        (it) => isArbeidsgiver(inntektsforhold) && it.arbeidsgiver === inntektsforhold.organisasjonsnummer,
    )?.omregnetArsinntekt?.manedsbelop;

    const { personTotalbeløp, arbeidsgiverTotalbeløp } = useTotalbeløp(
        isSelvstendigNaering(inntektsforhold),
        activePeriod.tidslinje,
    );

    const forrigeGenerasjonPeriode: Maybe<Periode> | undefined = finnForrigeEllerNyesteGenerasjon(
        activePeriod,
        inntektsforhold,
    )?.perioder.find((periode) => periode.vedtaksperiodeId === activePeriod.vedtaksperiodeId);

    const { totalbeløp: gammeltTotalbeløp } = useTotalbeløp(
        isSelvstendigNaering(inntektsforhold),
        forrigeGenerasjonPeriode?.tidslinje,
    );
    const utbetaleTilgang = finnUtbetaleTilgang(activePeriod);
    const periodState = getPeriodState(activePeriod);
    const utbetalingsvarsler: VarselObject[] = [utbetaling(periodState), tilstandinfo(periodState)].filter(
        (it) => it,
    ) as VarselObject[];

    const organisasjonsnummer = isArbeidsgiver(inntektsforhold) ? inntektsforhold.organisasjonsnummer : 'SELVSTENDIG';
    const arbeidsgiverNavn = isArbeidsgiver(inntektsforhold) ? inntektsforhold.navn : 'SELVSTENDIG';
    return (
        <section className={styles.Venstremeny}>
            <PeriodeCard.Beregnet
                periode={activePeriod}
                arbeidsforhold={isArbeidsgiver(inntektsforhold) ? inntektsforhold.arbeidsforhold : []}
                månedsbeløp={månedsbeløp}
                inntektsforhold={inntektsforhold}
            />
            <UtbetalingCard.Beregnet
                vilkårsgrunnlag={vilkårsgrunnlag}
                antallUtbetalingsdager={getNumberOfDaysWithType(activePeriod.tidslinje, Utbetalingsdagtype.Navdag)}
                utbetaling={activePeriod.utbetaling}
                personinfo={currentPerson.personinfo}
                arbeidsgiversimulering={activePeriod.utbetaling.arbeidsgiversimulering}
                personsimulering={activePeriod.utbetaling.personsimulering}
                periodeArbeidsgiverNettoBeløp={arbeidsgiverTotalbeløp}
                periodePersonNettoBeløp={personTotalbeløp}
                gammeltTotalbeløp={forrigeGenerasjonPeriode ? gammeltTotalbeløp : undefined}
                inntektsforhold={inntektsforhold}
            />
            {activePeriod.periodetilstand === Periodetilstand.TilGodkjenning && !utbetaleTilgang.tillatt ? (
                <ErrorMessage>Du har ikke tilgang til å behandle denne oppgaven</ErrorMessage>
            ) : (
                <>
                    <HarVurderbareVarsler person={currentPerson} />
                    <HarBeslutteroppgaver person={currentPerson} />
                    <Utbetaling
                        period={activePeriod}
                        person={currentPerson}
                        organisasjonsnummer={organisasjonsnummer}
                        arbeidsgiverNavn={arbeidsgiverNavn}
                    />
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
