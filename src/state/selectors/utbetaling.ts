import { ApiUtbetaling } from '@io/rest/generated/spesialist.schemas';
import { DateString } from '@typer/shared';

export const isGodkjent = (utbetaling: ApiUtbetaling): boolean => {
    return utbetaling.vurdering?.godkjent ?? false;
};

export const getRequiredTimestamp = (utbetaling: ApiUtbetaling): DateString => {
    return (
        utbetaling.vurdering?.tidsstempel ??
        (() => {
            throw Error('Utbetaling mangler tidsstempel');
        })()
    );
};

export const isRevurdering = (utbetaling: ApiUtbetaling): boolean => {
    return utbetaling.type === 'REVURDERING';
};
