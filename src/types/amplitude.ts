export namespace Amplitude {
    export type LogEvent =
        | 'oppgave godkjent'
        | 'oppgave forkastet'
        | 'totrinnsoppgave returnert'
        | 'totrinnsoppgave attestert'
        | 'totrinnsoppgave til godkjenning'
        | 'annullert';

    export type Periodetype = 'FORLENGELSE' | 'FORSTEGANGSBEHANDLING' | 'INFOTRYGDFORLENGELSE' | 'OVERGANG_FRA_IT';

    export type EventProperties = {
        varighet: number; // Tid i sekunder fra oppgaven ble åpnet til den ble godkjent/forkastet
        begrunnelser?: Array<string>;
    };

    export type EventPropertiesBeregnetPeriode = EventProperties & {
        warnings: Array<string>;
        antallWarnings: number;
        inntektstype?: string;
        mottaker?: string;
        oppgavetype?: string;
        periodetype?: string;
        egenskaper?: Array<string>;
    };
}
