import styled from '@emotion/styled';
import React from 'react';

import { Varsel } from '@components/Varsel';

const ErrorVarsel = styled(Varsel)`
    grid-column-start: venstremeny;
    grid-column-end: høyremeny;
`;

export const getErrorMessage = (tilstand: Tidslinjetilstand) => {
    const errorMessage = getErrorMessageForTidslinjetilstand(tilstand);
    return (error: Error) => {
        return errorMessage ? errorMessage : <ErrorVarsel variant="feil">{error.message}</ErrorVarsel>;
    };
};

export const getErrorMessageForTidslinjetilstand = (tilstand: Tidslinjetilstand) => {
    switch (tilstand) {
        case 'venter':
            return (
                <ErrorVarsel variant="info">
                    Kunne ikke vise informasjon om vedtaksperioden. Dette skyldes at perioden ikke er klar til
                    behandling.
                </ErrorVarsel>
            );
        case 'kunFerie':
            return (
                <ErrorVarsel variant="info">
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun ferie.
                </ErrorVarsel>
            );
        case 'kunPermisjon':
            return (
                <ErrorVarsel variant="info">
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun permisjon.
                </ErrorVarsel>
            );
        case 'ingenUtbetaling':
            return (
                <ErrorVarsel variant="info">
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden har ingen utbetaling.
                </ErrorVarsel>
            );
        case 'venterPåKiling':
            return <ErrorVarsel variant="info">Ikke klar til behandling - avventer system.</ErrorVarsel>;
        case 'ukjent':
            return <ErrorVarsel variant="feil">Kunne ikke lese informasjon om sakens tilstand.</ErrorVarsel>;
        default:
            return undefined;
    }
};
