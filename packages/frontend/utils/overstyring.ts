import { getArbeidsgiverWithPeriod } from '@state/selectors/arbeidsgiver';
import { getOverlappendePerioder, isForkastet, isGodkjent } from '@state/selectors/period';
import { defaultUtbetalingToggles } from '@utils/featureToggles';
import { getPeriodState } from '@utils/mapping';

type OverstyringValidationSuccess = {
    value: true;
};

type OverstyringValidationError = {
    value: false;
    reason?: string;
    technical: string;
};

type OverstyringValidation = OverstyringValidationSuccess | OverstyringValidationError;

const validateTilstand = (periode: FetchedBeregnetPeriode): void => {
    if (!['tilGodkjenning', 'avslag', 'ingenUtbetaling', 'utbetalingFeilet'].includes(getPeriodState(periode))) {
        throw {
            value: false,
            technical: 'Perioden er i feil tilstand',
        };
    }
};

const validateBeslutter = (periode: FetchedBeregnetPeriode): void => {
    if (periode.totrinnsvurdering?.erBeslutteroppgave) {
        throw {
            value: false,
            technical: 'Perioden har en beslutteroppgave',
        };
    }
};

export const kanOverstyres = (periode: FetchedBeregnetPeriode): OverstyringValidation => {
    try {
        validateBeslutter(periode);
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

const validateFeatureToggles = (): void => {
    validateOverstyreUtbetaltPeriodeEnabled();
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

const validatePeriodeTilhørerNyesteGenerasjon = (person: FetchedPerson, periode: FetchedBeregnetPeriode): void => {
    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode);

    if (!arbeidsgiver) {
        throw {
            value: false,
            technical: 'Arbeidsgiver mangler eller periode er i tidligere generasjon',
        };
    }
};

export const kanRevurderes = (person: FetchedPerson, periode: FetchedBeregnetPeriode): OverstyringValidation => {
    try {
        validatePeriodeTilhørerNyesteGenerasjon(person, periode);
        validateFeatureToggles();
        validateBeslutter(periode);
        validateIkkeForkastet(periode);
        validateGodkjent(periode);
        validateIngenOverlappendeRevurderinger(person, periode);
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
    periode: FetchedBeregnetPeriode,
): OverstyringValidation => {
    try {
        validateOverstyreUtbetaltPeriodeEnabled();
        validateBeslutter(periode);
        validateRevurderes(periode);
        validatePeriodeTilhørerNyesteGenerasjon(person, periode);
        validateOverlappendePerioderErTilRevurdering(person, periode);
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return { value: true };
};
