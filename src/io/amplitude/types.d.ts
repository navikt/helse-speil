// TODO: Globale types som bør nukes
declare namespace Amplitude {
    type LogEvent =
        | 'oppgave godkjent'
        | 'oppgave forkastet'
        | 'totrinnsoppgave returnert'
        | 'totrinnsoppgave attestert'
        | 'totrinnsoppgave til godkjenning'
        | 'annullert';

    type Periodetype = 'FORLENGELSE' | 'FORSTEGANGSBEHANDLING' | 'INFOTRYGDFORLENGELSE' | 'OVERGANG_FRA_IT';

    type EventProperties = {
        varighet: number; // Tid i sekunder fra oppgaven ble åpnet til den ble godkjent/forkastet
        begrunnelser?: Array<string>;
    };

    type EventPropertiesBeregnetPeriode = EventProperties & {
        warnings: Array<string>;
        antallWarnings: number;
        inntektstype?: string;
        mottaker?: string;
        oppgavetype?: string;
        periodetype?: string;
        egenskaper?: Array<string>;
    };
}
