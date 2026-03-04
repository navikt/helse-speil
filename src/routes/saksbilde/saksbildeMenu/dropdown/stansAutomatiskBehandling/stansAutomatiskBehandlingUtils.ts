import type { ErrorType } from '@app/axios/orval-mutator';
import type { ApiHttpProblemDetailsApiPatchStansErrorCode } from '@io/rest/generated/spesialist.schemas';
import { ToastObject } from '@state/toasts';
import { generateId } from '@utils/generateId';

export const opphevStansAutomatiskBehandlingToast: ToastObject = {
    key: generateId(),
    message: 'Stans av automatisk behandling opphevet',
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
    message: 'Veileder stans opphevet',
    variant: 'success',
    timeToLiveMs: 5000,
};

export const somAutomatiskStansBackendfeil = (
    error: ErrorType<ApiHttpProblemDetailsApiPatchStansErrorCode>,
): string => {
    const problemDetailsCode = error.response?.data?.code;
    if (!problemDetailsCode) return 'Feil ved oppretting av stans. Kontakt utviklerteamet.';

    switch (problemDetailsCode) {
        case 'PERSON_PSEUDO_ID_IKKE_FUNNET':
            return 'Det skjedde en feil, hent personen på nytt og prøv igjen, kontakt utviklerteamet om feilen fortsetter.';
        case 'KAN_IKKE_OPPRETTE_VEILEDER_STANS':
            return 'Speil har sendt en ugyldig veilederstans, kontakt utviklerteamet.';
        case 'REQUEST_MANGLER_STANSTYPE':
            return 'Speil har sendt en ugyldig stans, kontakt utviklerteamet.';
        case 'MANGLER_TILGANG_TIL_PERSON':
            return 'Du har ikke tilgang til å gjøre endringer på denne personen.';
    }
};
