import { mapPerson } from '../../client/mapping/person';
import { umappetArbeidsgiver } from './arbeidsgiver';
import { PersoninfoFraSparkel } from '../../types';
import { umappetUtbetalinger } from './SpesialistUtbetaling';

export const umappetPerson = (arbeidsgivere = [umappetArbeidsgiver()], utbetalinger = umappetUtbetalinger()) => ({
    aktørId: '1211109876233',
    fødselsnummer: '01019000123',
    personinfo: { fornavn: 'Kringle', mellomnavn: null, etternavn: 'Krangel', fødselsdato: null, kjønn: null },
    utbetalinger: utbetalinger,
    arbeidsgivere: arbeidsgivere,
    enhet: { id: '', navn: '' },
    tildeltTil: null,
    arbeidsforhold: [],
});

export const mappetPerson = (
    arbeidsgivere = [umappetArbeidsgiver()],
    utbetalinger = umappetUtbetalinger(),
    personinfoFraSparkel?: PersoninfoFraSparkel
) => mapPerson(umappetPerson(arbeidsgivere, utbetalinger), personinfoFraSparkel).person;

export const personinfoFraSparkel = ({ kjønn = 'Mannebjørn', fødselsdato = '1956-12-12', fnr = '01019000123' }) => ({
    kjønn,
    fødselsdato,
    fnr,
});
