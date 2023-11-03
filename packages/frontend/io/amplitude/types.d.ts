declare namespace Amplitude {
    type LogEvent =
        | 'oppgave godkjent'
        | 'oppgave forkastet'
        | 'totrinnsoppgave returnert'
        | 'totrinnsoppgave attestert'
        | 'totrinnsoppgave til godkjenning';

    type Periodetype = 'FORLENGELSE' | 'FORSTEGANGSBEHANDLING' | 'INFOTRYGDFORLENGELSE' | 'OVERGANG_FRA_IT';

    type Inntektstype = 'ENARBEIDSGIVER' | 'FLEREARBEIDSGIVERE';

    type EventProperties = {
        varighet: number; // Tid i sekunder fra oppgaven ble åpnet til den ble godkjent/forkastet
        begrunnelser?: Array<string>;
    };

    type EventPropertiesBeregnetPeriode = EventProperties & {
        type: Periodetype;
        inntektskilde: Inntektstype;
        warnings: Array<string>;
        antallWarnings: number;
    };
}
