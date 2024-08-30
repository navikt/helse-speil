import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { getArbeidsgiverWithPeriod } from '@state/selectors/arbeidsgiver';
import { getOverlappendePerioder, isForkastet, isGodkjent } from '@state/selectors/period';
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

const validateTilstand = (periode: BeregnetPeriodeFragment): void => {
    if (
        !['tilGodkjenning', 'avslag', 'ingenUtbetaling', 'utbetalingFeilet', 'revurderes', 'venterPåKiling'].includes(
            getPeriodState(periode),
        )
    ) {
        throw {
            value: false,
            technical: 'Perioden er i feil tilstand',
        };
    }
};

const validateBeslutter = (periode: BeregnetPeriodeFragment): void => {
    if (periode.totrinnsvurdering?.erBeslutteroppgave) {
        throw {
            value: false,
            technical: 'Perioden har en beslutteroppgave',
        };
    }
};

export const kanOverstyres = (periode: BeregnetPeriodeFragment): OverstyringValidation => {
    try {
        validateBeslutter(periode);
        validateTilstand(periode);
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return { value: true };
};

const validateIkkeForkastet = (periode: BeregnetPeriodeFragment): void => {
    if (isForkastet(periode)) {
        throw {
            value: false,
            technical: 'Forkastet periode',
        };
    }
};

const validateGodkjent = (periode: BeregnetPeriodeFragment): void => {
    if (!isGodkjent(periode)) {
        throw {
            value: false,
            reason: 'Vi støtter ikke revurdering av perioder som ikke er godkjente',
            technical: 'Er ikke godkjent',
        };
    }
};

const validatePeriodeTilhørerNyesteGenerasjon = (person: PersonFragment, periode: BeregnetPeriodeFragment): void => {
    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode);

    if (!arbeidsgiver) {
        throw {
            value: false,
            technical: 'Arbeidsgiver mangler eller periode er i tidligere generasjon',
        };
    }
};

export const kanRevurderes = (person: PersonFragment, periode: BeregnetPeriodeFragment): OverstyringValidation => {
    try {
        validatePeriodeTilhørerNyesteGenerasjon(person, periode);
        validateBeslutter(periode);
        validateIkkeForkastet(periode);
        validateGodkjent(periode);
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return { value: true };
};

const validateRevurderes = (periode: BeregnetPeriodeFragment): void => {
    if (getPeriodState(periode) !== 'revurderes') {
        throw {
            value: false,
            technical: 'Kan ikke overstyre revurdering om perioden ikke er til revurdering',
        };
    }
};

const validateOverlappendePerioderErTilRevurdering = (
    person: PersonFragment,
    periode: BeregnetPeriodeFragment,
): void => {
    const tilstander = getOverlappendePerioder(person, periode).map((it) => getPeriodState(it));

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
    person: PersonFragment,
    periode: BeregnetPeriodeFragment,
): OverstyringValidation => {
    try {
        validateBeslutter(periode);
        validateRevurderes(periode);
        validatePeriodeTilhørerNyesteGenerasjon(person, periode);
        validateOverlappendePerioderErTilRevurdering(person, periode);
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return { value: true };
};
