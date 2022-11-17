import dayjs from 'dayjs';

import { Arbeidsgiver, Inntektstype } from '@io/graphql';
import { getArbeidsgiverWithPeriod } from '@state/selectors/arbeidsgiver';
import { getOverlappendePerioder, isForkastet, isGodkjent } from '@state/selectors/period';
import { defaultUtbetalingToggles } from '@utils/featureToggles';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode } from '@utils/typeguards';

type OverstyringValidationSuccess = {
    value: true;
};

type OverstyringValidationError = {
    value: false;
    reason?: string;
    technical: string;
};

type OverstyringValidation = OverstyringValidationSuccess | OverstyringValidationError;

const validateInntektstype = (periode: FetchedBeregnetPeriode): void => {
    if (periode.inntektstype === Inntektstype.Flerearbeidsgivere) {
        throw {
            value: false,
            reason: 'Vi støtter ikke overstyring ved flere arbeidsgivere',
            technical: 'Flere arbeidsgivere',
        };
    }
};

const validateTilstand = (periode: FetchedBeregnetPeriode): void => {
    if (!['tilGodkjenning', 'avslag', 'ingenUtbetaling', 'utbetalingFeilet'].includes(getPeriodState(periode))) {
        throw {
            value: false,
            technical: 'Perioden er i feil tilstand',
        };
    }
};

const validateBeslutter = (periode: FetchedBeregnetPeriode): void => {
    if (periode.oppgave?.erBeslutter) {
        throw {
            value: false,
            technical: 'Perioden har en beslutteroppgave',
        };
    }
};

export const kanOverstyres = (periode: FetchedBeregnetPeriode): OverstyringValidation => {
    try {
        validateBeslutter(periode);
        validateInntektstype(periode);
        validateTilstand(periode);
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return { value: true };
};

const validateOverstyreUtbetaltPeriodeEnabled = (): void => {
    if (!defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled) {
        throw {
            value: false,
            technical: 'Revurdering av utbetalt periode',
        };
    }
};

const validateOverstyreTidligereSykefraværstilfelle = (
    person: FetchedPerson,
    periode: FetchedBeregnetPeriode
): void => {
    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode)!;
    if (periodeTilhørerSisteSykefraværstilfelle(arbeidsgiver, periode!)) return;
    if (!defaultUtbetalingToggles.overstyreTidligereSykefraværstilfelle) {
        throw {
            value: false,
            reason: 'Vi støtter ikke revurdering av tidligere sykefraværstilfelle',
            technical: 'Revurdering av tidligere sykefravær',
        };
    }
};

const validateFeatureToggles = (person: FetchedPerson, periode: FetchedBeregnetPeriode): void => {
    validateOverstyreUtbetaltPeriodeEnabled();
    validateOverstyreTidligereSykefraværstilfelle(person, periode);
};

const validateIkkeForkastet = (periode: FetchedBeregnetPeriode): void => {
    if (isForkastet(periode)) {
        throw {
            value: false,
            technical: 'Forkastet periode',
        };
    }
};

const validateGodkjent = (periode: FetchedBeregnetPeriode): void => {
    if (!isGodkjent(periode)) {
        throw {
            value: false,
            reason: 'Vi støtter ikke revurdering av perioder som ikke er godkjente',
            technical: 'Er ikke godkjent',
        };
    }
};

const validateIngenOverlappendeRevurderinger = (person: FetchedPerson, periode: FetchedBeregnetPeriode): void => {
    const overlappendePerioder = getOverlappendePerioder(person, periode);
    const ingenOverlappendePerioderRevurderes = overlappendePerioder.some(isGodkjent)
        ? overlappendePerioder.every((periode) => getPeriodState(periode) !== 'revurderes')
        : true;

    if (!ingenOverlappendePerioderRevurderes) {
        throw {
            value: false,
            reason: 'Vi støtter ikke revurdering av perioder som har overlappende perioder som revurderes',
            technical: 'Har overlappende revurderinger',
        };
    }
};

const periodeTilhørerSisteSykefraværstilfelle = (arbeidsgiver: Arbeidsgiver, periode: FetchedBeregnetPeriode) => {
    const sisteSkjæringstidspunkt = arbeidsgiver.generasjoner[0].perioder
        .filter(isBeregnetPeriode)
        .sort(
            (a, b) => new Date(b.skjaeringstidspunkt).getTime() - new Date(a.skjaeringstidspunkt).getTime()
        )[0].skjaeringstidspunkt;
    return dayjs(sisteSkjæringstidspunkt).isSame(periode.skjaeringstidspunkt, 'day');
};

const validatePeriodeTilhørerNyesteGenerasjon = (person: FetchedPerson, periode: FetchedBeregnetPeriode): void => {
    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode);

    if (!arbeidsgiver) {
        throw {
            value: false,
            technical: 'Arbeidsgiver mangler eller periode er i tidligere generasjon',
        };
    }
};

const validateArbeidsgiver = (person: FetchedPerson, periode: FetchedBeregnetPeriode): void => {
    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode)!;

    const gjelderSisteSykefraværstilfelle = periodeTilhørerSisteSykefraværstilfelle(arbeidsgiver, periode);

    if (!gjelderSisteSykefraværstilfelle) {
        throw {
            value: false,
            reason: 'Vi støtter ikke revurdering av perioder med et tidligere skjæringstidspunkt',
            technical: 'Feil skjæringstidspunkt',
        };
    }
};

export const kanRevurderes = (person: FetchedPerson, periode: FetchedBeregnetPeriode): OverstyringValidation => {
    try {
        validatePeriodeTilhørerNyesteGenerasjon(person, periode);
        validateFeatureToggles(person, periode);
        validateBeslutter(periode);
        validateIkkeForkastet(periode);
        validateGodkjent(periode);
        validateIngenOverlappendeRevurderinger(person, periode);
        validateArbeidsgiver(person, periode);
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return { value: true };
};

const validateRevurderes = (periode: FetchedBeregnetPeriode): void => {
    if (getPeriodState(periode) !== 'revurderes') {
        throw {
            value: false,
            technical: 'Kan ikke overstyre revurdering om perioden ikke er til revurdering',
        };
    }
};

const validateOverlappendePerioderErTilRevurdering = (person: FetchedPerson, periode: FetchedBeregnetPeriode): void => {
    const tilstander = getOverlappendePerioder(person, periode).map(getPeriodState);

    const noenPerioderErTilRevurdering = tilstander.some((tilstand) => tilstand === 'revurderes');
    const allePerioderErTilRevurdering = tilstander.every((tilstand) => tilstand === 'revurderes');
    if (noenPerioderErTilRevurdering && !allePerioderErTilRevurdering) {
        throw {
            value: false,
            technical: 'Ikke alle overlappende perioder er til revurdering',
        };
    }
};

export const kanOverstyreRevurdering = (
    person: FetchedPerson,
    periode: FetchedBeregnetPeriode
): OverstyringValidation => {
    try {
        validateOverstyreUtbetaltPeriodeEnabled();
        validateBeslutter(periode);
        validateRevurderes(periode);
        validatePeriodeTilhørerNyesteGenerasjon(person, periode);
        validateArbeidsgiver(person, periode);
        validateOverlappendePerioderErTilRevurdering(person, periode);
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return { value: true };
};
