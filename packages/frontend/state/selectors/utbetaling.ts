import { Utbetaling } from '@io/graphql';

export const isGodkjent = (utbetaling: Utbetaling): boolean => {
    return utbetaling.vurdering?.godkjent ?? false;
};

export const getRequiredTimestamp = (utbetaling: Utbetaling): DateString => {
    return (
        utbetaling.vurdering?.tidsstempel ??
        (() => {
            throw Error('Utbetaling mangler tidsstempel');
        })()
    );
};

export const isRevurdering = (utbetaling: Utbetaling): boolean => {
    return utbetaling.type === 'REVURDERING';
};
