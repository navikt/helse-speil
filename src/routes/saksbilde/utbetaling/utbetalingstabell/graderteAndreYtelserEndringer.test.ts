import {
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserEndretDag,
    ApiGraderteAndreYtelserEvent,
    ApiYrkesaktivitetstype,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';

import { endringerForDato } from './graderteAndreYtelserEndringer';

describe('endringerForDato', () => {
    it('gir ingen endringer uten graderte andre ytelser', () => {
        expect(endringerForDato(undefined, '2024-01-01')).toEqual([]);
    });

    it('henter endringene for datoen på tvers av hendelsene', () => {
        const graderteAndreYtelser = enGraderteAndreYtelser([
            enEvent('v1', 'A123456', [enDag('2024-01-01'), enDag('2024-01-02')]),
            enEvent('v2', 'B123456', [enDag('2024-01-02')]),
        ]);

        expect(endringerForDato(graderteAndreYtelser, '2024-01-01').map((it) => it.saksbehandlerIdent)).toEqual([
            'A123456',
        ]);
        expect(endringerForDato(graderteAndreYtelser, '2024-01-02')).toMatchObject([
            { saksbehandlerIdent: 'A123456' },
            {
                saksbehandlerIdent: 'B123456',
                tidspunkt: 'v2-tidspunkt',
                dag: { dato: '2024-01-02' },
            },
        ]);
        expect(endringerForDato(graderteAndreYtelser, '2024-01-03')).toEqual([]);
    });
});

function enGraderteAndreYtelser(events: ApiGraderteAndreYtelserEvent[]): ApiGraderteAndreYtelser {
    return {
        yrkesaktivitet: ApiYrkesaktivitetstype.ARBEIDSTAKER,
        organisasjonsnummer: '123456789',
        versjon: 'v2',
        dager: [],
        events,
    };
}

function enEvent(
    versjon: string,
    ident: string,
    dager: ApiGraderteAndreYtelserEndretDag[],
): ApiGraderteAndreYtelserEvent {
    return {
        versjon,
        tidspunkt: `${versjon}-tidspunkt`,
        utfortAvSaksbehandlerIdent: ident,
        dager,
    };
}

function enDag(dato: string): ApiGraderteAndreYtelserEndretDag {
    return {
        dato,
        andreYtelserGrader: { FORELDREPENGER: 40 },
        sykdomsgrad: 50,
        arbeidsgrad: 10,
        sykdomsgradFørFordeling: 90,
        begrunnelse: 'En begrunnelse',
    };
}
