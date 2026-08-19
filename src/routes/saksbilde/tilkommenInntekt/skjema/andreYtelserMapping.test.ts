import { AndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import { tilGraderteAndreYtelserRequest } from '@saksbilde/tilkommenInntekt/skjema/andreYtelserMapping';

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

        expect(request.andreYtelseType).toBe('PLEIEPENGER');
    });

    it('mapper Opplæringspenger til OPPLARINGSPENGER uten Æ', () => {
        const request = tilGraderteAndreYtelserRequest(etSkjema({ ytelse: 'Opplæringspenger' }), '12345678910');

        expect(request.andreYtelseType).toBe('OPPLARINGSPENGER');
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
