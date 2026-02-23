import { ApiServerSentEvent, ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

interface MockApiServerSentEvent extends ApiServerSentEvent {
    fødselsnummer: string;
}

export class ServerSentEventsMock {
    private static events: MockApiServerSentEvent[] = [
        {
            fødselsnummer: '12345678910',
            event: ApiServerSentEventEvent.UTBETALING_ANNULLERING_OK,
            data: null,
        },
        {
            fødselsnummer: '06028620819',
            event: ApiServerSentEventEvent.PERSONDATA_OPPDATERT,
            data: null,
        },
        {
            fødselsnummer: '06028620819',
            event: ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
            data: null,
        },
    ];

    static pushEvent(fødselsnummer: string, event: ApiServerSentEventEvent) {
        this.events.push({
            fødselsnummer: fødselsnummer,
            event: event,
            data: null,
        });
    }
    static hentEventsFor(pseudoId: string): ApiServerSentEvent[] {
        return this.events
            .filter((event) => PersonMock.findFødselsnummerForPersonPseudoId(pseudoId) === event.fødselsnummer)
            .map((event) => ({
                event: event.event,
                data: event.data,
            }));
    }
}
