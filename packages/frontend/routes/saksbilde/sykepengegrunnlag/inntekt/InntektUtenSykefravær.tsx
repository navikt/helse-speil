import React, { useState } from 'react';
import classNames from 'classnames';

import { Inntektskilde, Maybe, OmregnetArsinntekt, Periodetilstand, Person } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useEndringerForPeriode } from '@state/arbeidsgiver';
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
import { EditableInntekt } from './EditableInntekt';
import { RedigerGhostInntekt } from './RedigerGhostInntekt';

const maybePeriodeTilGodkjenning = (person: Person, skjæringstidspunkt: DateString): Maybe<BeregnetPeriode> => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0]?.perioder)
            .filter(isBeregnetPeriode)
            .find(
                (it) =>
                    it.periodetilstand === Periodetilstand.TilGodkjenning &&
                    it.skjaeringstidspunkt === skjæringstidspunkt,
            ) ?? null
    );
};

const harIngenUtbetaltePerioderFor = (person: Person, skjæringstidspunkt: DateString): boolean => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0]?.perioder)
            .filter(isBeregnetPeriode)
            .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
            .every((it) =>
                [
                    Periodetilstand.TilGodkjenning,
                    Periodetilstand.VenterPaEnAnnenPeriode,
                    Periodetilstand.ForberederGodkjenning,
                    Periodetilstand.ManglerInformasjon,
                ].includes(it.periodetilstand),
            ) ?? false
    );
};

const harIngenPerioderTilBeslutterFor = (person: Person, skjæringstidspunkt: DateString): boolean => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0]?.perioder)
            .filter(isBeregnetPeriode)
            .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
            .every((it) => !it.erBeslutterOppgave) ?? false
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

    const harIngenPerioderTilBeslutter = harIngenPerioderTilBeslutterFor(person, activePeriod.skjaeringstidspunkt);

    return (
        defaultOverstyrToggles.overstyrArbeidsforholdUtenSykefraværEnabled &&
        activePeriod.organisasjonsnummer === organisasjonsnummer &&
        harIngenUtbetaltePerioder &&
        harIngenPerioderTilBeslutter &&
        periodeTilGodkjenning !== undefined
    );
};

const endreInntektUtenSykefraværBegrunnelser = [
    '§ 8-28 (3) b - Arbeidsforhold har vart kortere enn 3 måneder',
    '§ 8-28 (3) c - Varig lønnsendring',
    '§ 8-28 (5) - Innrapportert feil inntekt til A-ordningen',
    '§ 8-28 (6) - Timelønnet arbeidstaker',
    'Annen kilde til endring',
];

const useGhostInntektKanOverstyres = (organisasjonsnummer: string): boolean => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();

    if (!isGhostPeriode(activePeriod) || !person) {
        return false;
    }

    const periodeTilGodkjenning = maybePeriodeTilGodkjenning(person, activePeriod.skjaeringstidspunkt);

    const harIngenUtbetaltePerioder = harIngenUtbetaltePerioderFor(person, activePeriod.skjaeringstidspunkt);

    const harIngenPerioderTilBeslutter = harIngenPerioderTilBeslutterFor(person, activePeriod.skjaeringstidspunkt);

    return (
        defaultOverstyrToggles.overstyrGhostInntektEnabled &&
        activePeriod.organisasjonsnummer === organisasjonsnummer &&
        harIngenUtbetaltePerioder &&
        harIngenPerioderTilBeslutter &&
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
                .some((it) => it.periodetilstand === Periodetilstand.TilGodkjenning),
        )?.organisasjonsnummer ?? null
    );
};

interface InntektUtenSykefraværProps {
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    erDeaktivert?: Maybe<boolean>;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    vilkårsgrunnlagId?: Maybe<string>;
}

export const InntektUtenSykefravær = ({
    organisasjonsnummer,
    skjæringstidspunkt,
    erDeaktivert,
    omregnetÅrsinntekt,
    vilkårsgrunnlagId,
}: InntektUtenSykefraværProps) => {
    const [editingInntekt, setEditingInntekt] = useState(false);
    const [endret, setEndret] = useState(false);

    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(organisasjonsnummer);
    const inntektKanOverstyres = useGhostInntektKanOverstyres(organisasjonsnummer);
    const organisasjonsnummerForPeriodeTilGodkjenning = useOrganisasjonsnummerTilPeriodenSomErTilGodkjenning();
    const { arbeidsforholdendringer } = useEndringerForPeriode(organisasjonsnummer);

    return (
        <div
            className={classNames(styles.Inntekt, editingInntekt && styles.editing, erDeaktivert && styles.deaktivert)}
        >
            <div className={classNames(styles.Header, editingInntekt && styles.editing)}>
                <Flex alignItems="center">
                    <Bold>Beregnet månedsinntekt</Bold>
                    {endret || omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler ? (
                        <EndringsloggButton endringer={arbeidsforholdendringer} />
                    ) : (
                        <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
                {vilkårsgrunnlagId && inntektKanOverstyres && !erDeaktivert && (
                    <RedigerGhostInntekt setEditing={setEditingInntekt} editing={editingInntekt} />
                )}
            </div>
            {editingInntekt ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    close={() => setEditingInntekt(false)}
                    onEndre={setEndret}
                    begrunnelser={endreInntektUtenSykefraværBegrunnelser}
                />
            ) : (
                <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} deaktivert={erDeaktivert} />
            )}
            {!editingInntekt && arbeidsforholdKanOverstyres && organisasjonsnummerForPeriodeTilGodkjenning && (
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
