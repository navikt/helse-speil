import React, { useState } from 'react';
import classNames from 'classnames';

import {
    Inntektskilde as GraphQLInntektskilde,
    Maybe,
    OmregnetArsinntekt,
    Periodetilstand,
    Person,
    Utbetalingstatus,
} from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useEndringerForPeriode, useUtbetalingForSkjæringstidspunkt } from '@state/arbeidsgiver';
import { defaultOverstyrToggles } from '@utils/featureToggles';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';
import { kildeForkortelse } from '@utils/inntektskilde';
import { Flex } from '@components/Flex';
import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';

import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { EndringsloggButton } from './EndringsloggButton';
import { OverstyrArbeidsforholdUtenSykdom } from '../OverstyrArbeidsforholdUtenSykdom';

import styles from './Inntekt.module.css';

const maybePeriodeTilGodkjenning = (person: Person, skjæringstidspunkt: DateString): Maybe<BeregnetPeriode> => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0]?.perioder)
            .filter(isBeregnetPeriode)
            .find((it) => it.tilstand === Periodetilstand.Oppgaver && it.skjaeringstidspunkt === skjæringstidspunkt) ??
        null
    );
};

const harIngenUtbetaltePerioderFor = (person: Person, skjæringstidspunkt: DateString): boolean => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0]?.perioder)
            .filter(isBeregnetPeriode)
            .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
            .every((it) => it.tilstand === Periodetilstand.Oppgaver || it.tilstand === Periodetilstand.Venter) ?? false
    );
};

const useArbeidsforholdKanOverstyres = (organisasjonsnummer: string): boolean => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();

    if (!isGhostPeriode(activePeriod) || !person) {
        return false;
    }

    const periodeTilGodkjenning = maybePeriodeTilGodkjenning(person, activePeriod.skjaeringstidspunkt);

    const harIngenUtbetaltePerioder = harIngenUtbetaltePerioderFor(person, activePeriod.skjaeringstidspunkt);

    return (
        defaultOverstyrToggles.overstyrArbeidsforholdUtenSykefraværEnabled &&
        activePeriod.organisasjonsnummer === organisasjonsnummer &&
        harIngenUtbetaltePerioder &&
        periodeTilGodkjenning !== undefined
    );
};

const useOrganisasjonsnummerTilPeriodenSomErTilGodkjenning = (): Maybe<string> => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();

    if (!isGhostPeriode(activePeriod) || !person) {
        return null;
    }

    return (
        person.arbeidsgivere.find((it) =>
            it.generasjoner[0]?.perioder
                .filter(isBeregnetPeriode)
                .some((it) => it.tilstand === Periodetilstand.Oppgaver),
        )?.organisasjonsnummer ?? null
    );
};

interface InntektGhostPeriodeProps {
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    erDeaktivert?: Maybe<boolean>;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
}

export const InntektGhostPeriode = ({
    organisasjonsnummer,
    skjæringstidspunkt,
    erDeaktivert,
    omregnetÅrsinntekt,
}: InntektGhostPeriodeProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    const erRevurdering = useUtbetalingForSkjæringstidspunkt(skjæringstidspunkt)?.status === Utbetalingstatus.Utbetalt;
    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(organisasjonsnummer);
    const organisasjonsnummerForPeriodeTilGodkjenning = useOrganisasjonsnummerTilPeriodenSomErTilGodkjenning();
    const { arbeidsforholdendringer } = useEndringerForPeriode(organisasjonsnummer);

    return (
        <div className={classNames(styles.Inntekt, editing && styles.editing, erDeaktivert && styles.deaktivert)}>
            {erDeaktivert && <div className={styles.Deaktivertpille}>Brukes ikke i beregningen</div>}
            <div className={classNames(styles.Header, editing && styles.editing)}>
                <Flex alignItems="center">
                    <Bold>Beregnet månedsinntekt</Bold>
                    {endret || omregnetÅrsinntekt?.kilde === GraphQLInntektskilde.Saksbehandler ? (
                        <EndringsloggButton endringer={arbeidsforholdendringer} />
                    ) : (
                        <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
            </div>
            <div className={styles.InntektContainer}>
                <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} />
            </div>
            {arbeidsforholdKanOverstyres && organisasjonsnummerForPeriodeTilGodkjenning && (
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={organisasjonsnummer}
                    organisasjonsnummerPeriodeTilGodkjenning={organisasjonsnummerForPeriodeTilGodkjenning}
                    skjæringstidspunkt={skjæringstidspunkt}
                    arbeidsforholdErDeaktivert={erDeaktivert}
                />
            )}
        </div>
    );
};
