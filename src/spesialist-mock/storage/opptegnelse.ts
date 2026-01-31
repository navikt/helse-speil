import { ApiOpptegnelse, ApiOpptegnelseType } from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

interface MockApiOpptegnelse extends ApiOpptegnelse {
    fødselsnummer: string;
}

export class OpptegnelseMock {
    private static opptegnelser: MockApiOpptegnelse[] = [
        {
            fødselsnummer: '12345678910',
            sekvensnummer: 1,
            type: ApiOpptegnelseType.UTBETALING_ANNULLERING_OK,
        },
        {
            fødselsnummer: '06028620819',
            sekvensnummer: 2,
            type: ApiOpptegnelseType.PERSONDATA_OPPDATERT,
        },
        {
            fødselsnummer: '06028620819',
            sekvensnummer: 3,
            type: ApiOpptegnelseType.NY_SAKSBEHANDLEROPPGAVE,
        },
    ];

    static pushOpptegnelse(fødselsnummer: string, type: ApiOpptegnelseType) {
        this.opptegnelser.push({
            fødselsnummer: fødselsnummer,
            sekvensnummer: this.sisteSekvensnummer() + 1,
            type: type,
        });
    }

    static sisteSekvensnummer(): number {
        return this.opptegnelser.map((it) => it.sekvensnummer).reduce((acc, curr) => (acc > curr ? acc : curr), 0);
    }

    static hentOpptegnelserEtter(etterSekvensnummer: number, pseudoId: string): ApiOpptegnelse[] {
        return this.opptegnelser
            .filter(
                (opptegnelse) =>
                    PersonMock.findFødselsnummer(pseudoId) === opptegnelse.fødselsnummer &&
                    opptegnelse.sekvensnummer > etterSekvensnummer,
            )
            .map((mockOpptegnelse) => ({
                sekvensnummer: mockOpptegnelse.sekvensnummer,
                type: mockOpptegnelse.type,
            }));
    }
}
