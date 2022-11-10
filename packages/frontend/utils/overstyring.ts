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

const ikkeBeregnetError = (): OverstyringValidation => ({
    value: false,
    reason: 'Perioden er ikke beregnet og kan ikke endres',
    technical: 'Uberegnet periode',
});

const forkastetError = (): OverstyringValidation => ({
    value: false,
    technical: 'Forkastet periode',
});

const flereArbeidsgivereError = (): OverstyringValidation => ({
    value: false,
    reason: 'Vi støtter ikke overstyring ved flere arbeidsgivere',
    technical: 'Flere arbeidsgivere',
});

const feilTilstandError = (): OverstyringValidation => ({
    value: false,
    technical: 'Perioden er i feil tilstand',
});

const revurdereUtbetaltPeriodeError = (): OverstyringValidation => ({
    value: false,
    technical: 'Revurdering av utbetalt periode',
});

const revurdereTidligereSykefraværError = (): OverstyringValidation => ({
    value: false,
    reason: 'Vi støtter ikke revurdering av tidligere sykefraværstilfelle',
    technical: 'Revurdering av tidligere sykefravær',
});

const manglerPersonError = (): OverstyringValidation => ({
    value: false,
    technical: 'Person mangler',
});

const manglerArbeidsgiverError = (): OverstyringValidation => ({
    value: false,
    technical: 'Arbeidsgiver mangler eller periode er i tidligere generasjon',
});

const ikkeGodkjentError = (): OverstyringValidation => ({
    value: false,
    reason: 'Vi støtter ikke revurdering av perioder som ikke er godkjente',
    technical: 'Er ikke godkjent',
});

const overlappendeRevurderingerError = (): OverstyringValidation => ({
    value: false,
    reason: 'Vi støtter ikke revurdering av perioder som har overlappende perioder som revurderes',
    technical: 'Har overlappende revurderinger',
});

const feilSkjæringstidspunktError = (): OverstyringValidation => ({
    value: false,
    reason: 'Vi støtter ikke revurdering av perioder med et tidligere skjæringstidspunkt',
    technical: 'Feil skjæringstidspunkt',
});

export const kanOverstyres = (periode?: Maybe<ActivePeriod>): OverstyringValidation => {
    if (!isBeregnetPeriode(periode)) {
        return ikkeBeregnetError();
    }

    if (periode.inntektstype === Inntektstype.Flerearbeidsgivere) {
        return flereArbeidsgivereError();
    }

    if (!['tilGodkjenning', 'avslag', 'ingenUtbetaling', 'utbetalingFeilet'].includes(getPeriodState(periode))) {
        return feilTilstandError();
    }

    return validationSuccess();
};

export const kanRevurderes = (person?: Maybe<FetchedPerson>, periode?: Maybe<ActivePeriod>): OverstyringValidation => {
    if (!defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled) {
        return revurdereUtbetaltPeriodeError();
    }

    if (!defaultUtbetalingToggles.overstyreTidligereSykefraværstilfelle) {
        return revurdereTidligereSykefraværError();
    }

    if (!isPerson(person)) {
        return manglerPersonError();
    }

    if (!isBeregnetPeriode(periode)) {
        return ikkeBeregnetError();
    }

    if (isForkastet(periode)) {
        return forkastetError();
    }

    if (!isGodkjent(periode)) {
        return ikkeGodkjentError();
    }

    const overlappendePerioder = getOverlappendePerioder(person, periode);
    const ingenOverlappendePerioderRevurderes = overlappendePerioder.some(isGodkjent)
        ? overlappendePerioder.every((periode) => getPeriodState(periode) !== 'revurderes')
        : true;

    if (!ingenOverlappendePerioderRevurderes) {
        return overlappendeRevurderingerError();
    }

    const arbeidsgiver = getArbeidsgiverWithPeriod(person, periode);

    if (!arbeidsgiver) {
        return manglerArbeidsgiverError();
    }

    const sisteSkjæringstidspunkt = arbeidsgiver.generasjoner[0].perioder
        .filter(isBeregnetPeriode)
        .sort(
            (a, b) => new Date(b.skjaeringstidspunkt).getTime() - new Date(a.skjaeringstidspunkt).getTime()
        )[0].skjaeringstidspunkt;
    const erSisteSkjæringstidspunkt = dayjs(sisteSkjæringstidspunkt).isSame(periode.skjaeringstidspunkt, 'day');

    if (!erSisteSkjæringstidspunkt) {
        return feilSkjæringstidspunktError();
    }

    return { value: true };
};
