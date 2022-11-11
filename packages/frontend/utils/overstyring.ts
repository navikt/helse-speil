import dayjs from 'dayjs';

import { Inntektstype, Maybe } from '@io/graphql';
import { getArbeidsgiverWithPeriod } from '@state/selectors/arbeidsgiver';
import { getOverlappendePerioder, isForkastet, isGodkjent } from '@state/selectors/period';
import { defaultUtbetalingToggles } from '@utils/featureToggles';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isPerson } from '@utils/typeguards';

type OverstyringValidationSuccess = {
    value: true;
};

type OverstyringValidationError = {
    value: false;
    reason?: string;
    technical: string;
};

type OverstyringValidation = OverstyringValidationSuccess | OverstyringValidationError;

const validationSuccess = (): OverstyringValidation => ({ value: true });

const feilTilstandError = (): OverstyringValidation => ({
    value: false,
    technical: 'Perioden er i feil tilstand',
});

const validatePeriode = (periode?: Maybe<ActivePeriod>): periode is FetchedBeregnetPeriode => {
    if (!isBeregnetPeriode(periode)) {
        throw {
            value: false,
            reason: 'Perioden er ikke beregnet og kan ikke endres',
            technical: 'Uberegnet periode',
        };
    }

    return true;
};

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
        throw feilTilstandError();
    }
};

export const kanOverstyres = (periode?: Maybe<ActivePeriod>): OverstyringValidation => {
    try {
        if (validatePeriode(periode)) {
            validateInntektstype(periode);
            validateTilstand(periode);
        }
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return validationSuccess();
};

const validateOverstyreUtbetaltPeriodeEnabled = (): void => {
    if (!defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled) {
        throw {
            value: false,
            technical: 'Revurdering av utbetalt periode',
        };
    }
};

const validateOverstyreTidligereSykefravær = (): void => {
    if (!defaultUtbetalingToggles.overstyreTidligereSykefraværstilfelle) {
        throw {
            value: false,
            reason: 'Vi støtter ikke revurdering av tidligere sykefraværstilfelle',
            technical: 'Revurdering av tidligere sykefravær',
        };
    }
};

const validateFeatureToggles = (): void => {
    validateOverstyreUtbetaltPeriodeEnabled();
    validateOverstyreTidligereSykefravær();
};

const validatePerson = (person?: Maybe<FetchedPerson>): person is FetchedPerson => {
    if (!isPerson(person)) {
        throw {
            value: false,
            technical: 'Person mangler',
        };
    }

    return true;
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

const validateArbeidsgiver = (person: FetchedPerson, periode: FetchedBeregnetPeriode): void => {
    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode);

    if (!arbeidsgiver) {
        throw {
            value: false,
            technical: 'Arbeidsgiver mangler eller periode er i tidligere generasjon',
        };
    }

    const sisteSkjæringstidspunkt = arbeidsgiver.generasjoner[0].perioder
        .filter(isBeregnetPeriode)
        .sort(
            (a, b) => new Date(b.skjaeringstidspunkt).getTime() - new Date(a.skjaeringstidspunkt).getTime()
        )[0].skjaeringstidspunkt;
    const erSisteSkjæringstidspunkt = dayjs(sisteSkjæringstidspunkt).isSame(periode.skjaeringstidspunkt, 'day');

    if (!erSisteSkjæringstidspunkt) {
        throw {
            value: false,
            reason: 'Vi støtter ikke revurdering av perioder med et tidligere skjæringstidspunkt',
            technical: 'Feil skjæringstidspunkt',
        };
    }
};

export const kanRevurderes = (person?: Maybe<FetchedPerson>, periode?: Maybe<ActivePeriod>): OverstyringValidation => {
    try {
        validateFeatureToggles();
        if (validatePerson(person) && validatePeriode(periode)) {
            validateIkkeForkastet(periode);
            validateGodkjent(periode);
            validateIngenOverlappendeRevurderinger(person, periode);
            validateArbeidsgiver(person, periode);
        }
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
    person?: Maybe<FetchedPerson>,
    periode?: Maybe<ActivePeriod>
): OverstyringValidation => {
    try {
        validateOverstyreUtbetaltPeriodeEnabled();
        if (validatePerson(person) && validatePeriode(periode)) {
            validateRevurderes(periode);
            validateArbeidsgiver(person, periode);
            validateOverlappendePerioderErTilRevurdering(person, periode);
        }
    } catch (error) {
        return error as OverstyringValidationError;
    }

    return { value: true };
};
