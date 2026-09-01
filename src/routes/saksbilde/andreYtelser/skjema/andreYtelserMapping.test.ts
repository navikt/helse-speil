import { AndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import { ApiGraderteAndreYtelserType } from '@io/rest/generated/spesialist.schemas';
import {
    tilAndreYtelserSkjemaverdier,
    tilEndreGraderteAndreYtelserRequest,
    tilGjenopprettGraderteAndreYtelserRequest,
    tilGraderteAndreYtelserRequest,
} from '@saksbilde/andreYtelser/skjema/andreYtelserMapping';

const etSkjema = (overstyringer: Partial<AndreYtelserSchema> = {}): AndreYtelserSchema =>
    ({
        ytelse: 'Pleiepenger',
        perioder: [{ fom: '01.01.2020', tom: '03.01.2020', grad: 50 }],
        notat: 'Et notat',
        ...overstyringer,
    }) as AndreYtelserSchema;

describe('tilGraderteAndreYtelserRequest', () => {
    it('mapper ytelse-label til API-enum', () => {
        const request = tilGraderteAndreYtelserRequest(etSkjema({ ytelse: 'Pleiepenger' }), '12345678910');

        expect(request.andreYtelserType).toBe('PLEIEPENGER');
    });

    it('mapper Opplæringspenger til OPPLARINGSPENGER uten Æ', () => {
        const request = tilGraderteAndreYtelserRequest(etSkjema({ ytelse: 'Opplæringspenger' }), '12345678910');

        expect(request.andreYtelserType).toBe('OPPLARINGSPENGER');
    });

    it('konverterer norske datoer til ISO-format', () => {
        const request = tilGraderteAndreYtelserRequest(
            etSkjema({ perioder: [{ fom: '01.01.2020', tom: '03.01.2020', grad: 50 }] }),
            '12345678910',
        );

        expect(request.perioder).toEqual([{ fom: '2020-01-01', tom: '2020-01-03', grad: 50 }]);
    });

    it('sender med fødselsnummer og notat til beslutter', () => {
        const request = tilGraderteAndreYtelserRequest(etSkjema({ notat: 'Et notat' }), '12345678910');

        expect(request.fodselsnummer).toBe('12345678910');
        expect(request.notatTilBeslutter).toBe('Et notat');
    });
});

describe('tilEndreGraderteAndreYtelserRequest', () => {
    it('sender med id-en som skal endres', () => {
        const request = tilEndreGraderteAndreYtelserRequest(etSkjema(), 'en-id');

        expect(request.graderteAndreYtelserId).toBe('en-id');
        expect(request.andreYtelserType).toBe('PLEIEPENGER');
        expect(request.perioder).toEqual([{ fom: '2020-01-01', tom: '2020-01-03', grad: 50 }]);
        expect(request.notatTilBeslutter).toBe('Et notat');
    });
});

describe('tilGjenopprettGraderteAndreYtelserRequest', () => {
    it('sender med perioder, ytelsestype og notat', () => {
        const request = tilGjenopprettGraderteAndreYtelserRequest(etSkjema());

        expect(request.andreYtelserType).toBe('PLEIEPENGER');
        expect(request.perioder).toEqual([{ fom: '2020-01-01', tom: '2020-01-03', grad: 50 }]);
        expect(request.notatTilBeslutter).toBe('Et notat');
    });
});

describe('tilAndreYtelserSkjemaverdier', () => {
    it('konverterer API-verdier til norske skjemaverdier', () => {
        const skjemaverdier = tilAndreYtelserSkjemaverdier({
            andreYtelserId: 'en-id',
            andreYtelserType: ApiGraderteAndreYtelserType.OPPLARINGSPENGER,
            perioder: [{ fom: '2020-01-01', tom: '2020-01-03', grad: 50 }],
            fjernet: true,
        });

        expect(skjemaverdier.ytelse).toBe('Opplæringspenger');
        expect(skjemaverdier.perioder).toEqual([{ fom: '01.01.2020', tom: '03.01.2020', grad: 50 }]);
    });

    it('lar notat til beslutter stå tomt', () => {
        const skjemaverdier = tilAndreYtelserSkjemaverdier({
            andreYtelserId: 'en-id',
            andreYtelserType: ApiGraderteAndreYtelserType.PLEIEPENGER,
            perioder: [],
            fjernet: true,
        });

        expect(skjemaverdier.notat).toBe('');
    });
});
