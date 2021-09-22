import styled from '@emotion/styled';
import React from 'react';

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

const ErrorVarsel = styled(Varsel)`
    grid-column-start: venstremeny;
    grid-column-end: høyremeny;
`;

export const getErrorMessage = (tilstand: Tidslinjetilstand) => {
    const errorMessage = getErrorMessageForTidslinjetilstand(tilstand);
    return (error: Error) => {
        return errorMessage ? errorMessage : <ErrorVarsel type={Varseltype.Feil}>{error.message}</ErrorVarsel>;
    };
};

export const getErrorMessageForTidslinjetilstand = (tilstand: Tidslinjetilstand) => {
    switch (tilstand) {
        case 'venter':
            return (
                <ErrorVarsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Dette skyldes at perioden ikke er klar til
                    behandling.
                </ErrorVarsel>
            );
        case 'kunFerie':
            return (
                <ErrorVarsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun ferie.
                </ErrorVarsel>
            );
        case 'kunPermisjon':
            return (
                <ErrorVarsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun permisjon.
                </ErrorVarsel>
            );
        case 'ingenUtbetaling':
            return (
                <ErrorVarsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden har ingen utbetaling.
                </ErrorVarsel>
            );
        case 'venterPåKiling':
            return <ErrorVarsel type={Varseltype.Info}>Ikke klar til behandling - avventer system.</ErrorVarsel>;
        case 'ukjent':
            return <ErrorVarsel type={Varseltype.Feil}>Kunne ikke lese informasjon om sakens tilstand.</ErrorVarsel>;
        default:
            return undefined;
    }
};
