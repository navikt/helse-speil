import React from 'react';

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

export const getErrorMessage = (tilstand: Tidslinjetilstand) => {
    const errorMessage = getErrorMessageForTidslinjetilstand(tilstand);
    return (error: Error) => {
        return errorMessage ? errorMessage : <Varsel type={Varseltype.Feil}>{error.message}</Varsel>;
    };
};

export const getErrorMessageForTidslinjetilstand = (tilstand: Tidslinjetilstand) => {
    switch (tilstand) {
        case 'venter':
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Dette skyldes at perioden ikke er klar til
                    behandling.
                </Varsel>
            );
        case 'kunFerie':
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun ferie.
                </Varsel>
            );
        case 'kunPermisjon':
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun permisjon.
                </Varsel>
            );
        case 'ingenUtbetaling':
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden har ingen utbetaling.
                </Varsel>
            );
        case 'venterPåKiling':
            return <Varsel type={Varseltype.Info}>Ikke klar til behandling - avventer system.</Varsel>;
        case 'ukjent':
            return <Varsel type={Varseltype.Feil}>Kunne ikke lese informasjon om sakens tilstand.</Varsel>;
        default:
            return undefined;
    }
};
