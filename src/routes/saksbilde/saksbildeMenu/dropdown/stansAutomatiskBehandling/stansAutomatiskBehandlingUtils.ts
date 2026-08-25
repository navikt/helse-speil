import type { ErrorType } from '@app/axios/orval-mutator';
import {
    ApiHttpProblemDetailsApiPatchVeilederStansErrorCode,
    ApiHttpProblemDetailsPersonErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { somPersonFeilmelding } from '@io/rest/personFeilmeldinger';
import { ToastObject } from '@state/toasts';
import { generateId } from '@utils/generateId';

export const opphevStansAutomatiskBehandlingToast: ToastObject = {
    key: generateId(),
    message: 'Stans av automatisk behandling er opphevet',
    variant: 'success',
    timeToLiveMs: 5000,
};

export const stansAutomatiskBehandlingToast: ToastObject = {
    key: generateId(),
    message: 'Automatisk behandling stanset',
    variant: 'success',
    timeToLiveMs: 5000,
};

export const opphevStansAutomatiskBehandlingVeilederToast: ToastObject = {
    key: generateId(),
    message: 'Stans fra veileder er opphevet',
    variant: 'success',
    timeToLiveMs: 5000,
};

export const somVeilederBackendfeil = (
    error: ErrorType<ApiHttpProblemDetailsPersonErrorCode | ApiHttpProblemDetailsApiPatchVeilederStansErrorCode>,
): string => {
    const generellFeilmelding = 'Oppheving av stans feilet av ukjent årsak, meld feilen videre';
    const problemDetailsCode = error.response?.data?.code;
    if (!problemDetailsCode) return generellFeilmelding;

    const personFeilmelding = somPersonFeilmelding(problemDetailsCode);
    if (personFeilmelding != null) return personFeilmelding;

    switch (problemDetailsCode) {
        case 'KAN_IKKE_OPPRETTE_VEILEDER_STANS':
            return 'Speil har sendt en ugyldig veilederstans, meld feilen videre';
        default:
            return generellFeilmelding;
    }
};

export const somSaksbehandlerBackendfeil = (error: ErrorType<ApiHttpProblemDetailsPersonErrorCode>): string => {
    const problemDetailsCode = error.response?.data?.code;
    const generellFeilmelding = 'Feil ved oppretting av stans, meld feilen videre';
    if (!problemDetailsCode) return generellFeilmelding;
    return somPersonFeilmelding(problemDetailsCode) ?? generellFeilmelding;
};
