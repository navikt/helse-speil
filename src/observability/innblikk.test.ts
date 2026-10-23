import { leggPåInnblikkPerson } from '@observability/innblikk';

const gåTil = (path: string) => window.history.pushState({}, '', path);

const person = (type: string = 'event') =>
    leggPåInnblikkPerson(type, { name: 'klikk', data: { fane: 'Notat' } }).data?.person;

describe('leggPåInnblikkPerson', () => {
    beforeEach(() => {
        window.localStorage.clear();
        gåTil('/');
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('legger ikke på person utenfor personsider', () => {
        expect(person()).toBeUndefined();
    });

    it('beholder eksisterende eventdata og legger på et id som overlever personvernfilteret', () => {
        gåTil('/person/0d5a9c6e-2b4f-4c1e-9a6d-3f2e1b0c9d8a/dagoversikt');

        const payload = leggPåInnblikkPerson('event', { name: 'klikk', data: { fane: 'Notat' } });

        expect(payload.data?.fane).toBe('Notat');
        expect(payload.data?.person).toMatch(/^[a-z]{16}$/);
    });

    it('gir samme id for samme personPseudoId og ulike id-er for ulike personer', () => {
        gåTil('/person/person-a/dagoversikt');
        const personA = person();
        gåTil('/person/person-b/dagoversikt');
        const personB = person();
        gåTil('/');
        person();
        gåTil('/person/person-a/inngangsvilkår');

        expect(person()).toBe(personA);
        expect(personB).not.toBe(personA);
    });

    it('glemmer personer som ikke er brukt på sju dager', () => {
        vi.useFakeTimers();
        gåTil('/person/person-a/dagoversikt');
        const første = person();

        vi.advanceTimersByTime(7 * 24 * 60 * 60 * 1000);

        expect(person()).not.toBe(første);
    });

    it('endrer ikke identify-kall', () => {
        gåTil('/person/person-a/dagoversikt');
        expect(person('identify')).toBeUndefined();
    });
});
