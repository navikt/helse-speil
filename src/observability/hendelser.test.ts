import { Events } from '@navikt/analytics-types';

import { merkKildeForNestePerson, sporHendelse, sporValideringsfeil, startPersonbesøk } from '@observability/hendelser';
import { leggPåInnblikkPerson } from '@observability/innblikk';

const track = vi.fn((_navn: string, _data?: Record<string, unknown>) => Promise.resolve());

function sporedeHendelser() {
    return track.mock.calls.map(([navn, data]) => ({ navn, data: data ?? {} }));
}

describe('hendelser', () => {
    beforeEach(() => {
        window.localStorage.clear();
        track.mockClear();
        window.sporing = { track };
    });

    afterEach(() => {
        delete window.sporing;
    });

    it('sender hendelsen til sporing med properties', () => {
        sporHendelse({ name: Events.SKJEMA_APNET, properties: { skjemanavn: 'skjønnsfastsetting' } });

        expect(sporedeHendelser()).toEqual([{ navn: 'skjema åpnet', data: { skjemanavn: 'skjønnsfastsetting' } }]);
    });

    it('gjør ingenting når sporingsskriptet ikke er lastet', () => {
        delete window.sporing;

        expect(() => sporHendelse({ name: 'sendt i retur', properties: {} })).not.toThrow();
    });

    it('sporer valideringsfeil med sorterte feltnavn', () => {
        sporValideringsfeil('skjønnsfastsetting', { type: {}, begrunnelseFritekst: {} });

        expect(sporedeHendelser()).toEqual([
            {
                navn: 'skjema validering feilet',
                data: { skjemanavn: 'skjønnsfastsetting', feltMedFeil: 'begrunnelseFritekst,type' },
            },
        ]);
    });

    it('sporer åpning og avslutning av personbesøk med kilde og utfall for samme person', () => {
        merkKildeForNestePerson('oppgaveliste');
        const avslutt = startPersonbesøk('person-a');
        sporHendelse({ name: 'sendt til godkjenning', properties: { harIndividuellBegrunnelse: false } });
        avslutt();

        const [åpnet, , forlatt] = sporedeHendelser();
        expect(åpnet).toEqual({ navn: 'person åpnet', data: { kilde: 'oppgaveliste', person: expect.any(String) } });
        expect(forlatt).toEqual({
            navn: 'person forlatt',
            data: { utfall: 'sendt til godkjenning', person: åpnet!.data.person },
        });
    });

    it('bruker direkte som kilde og uten handling som utfall når ingenting er merket', () => {
        const avslutt = startPersonbesøk('person-a');
        avslutt();

        expect(sporedeHendelser().map(({ data }) => data.kilde ?? data.utfall)).toEqual(['direkte', 'uten handling']);
    });

    it('nullstiller kilde og utfall mellom personbesøk', () => {
        merkKildeForNestePerson('personsøk');
        const avsluttFørste = startPersonbesøk('person-a');
        sporHendelse({ name: 'lagt på vent', properties: {} });
        avsluttFørste();
        track.mockClear();

        startPersonbesøk('person-b')();

        expect(sporedeHendelser().map(({ data }) => data.kilde ?? data.utfall)).toEqual(['direkte', 'uten handling']);
    });

    it('sporer avslutning bare én gang selv om siden også lukkes', () => {
        const avslutt = startPersonbesøk('person-a');
        window.dispatchEvent(new Event('pagehide'));
        avslutt();

        expect(sporedeHendelser().filter(({ navn }) => navn === 'person forlatt')).toHaveLength(1);
    });

    it('lar innblikk-hooken beholde en eksplisitt satt person', () => {
        window.history.pushState({}, '', '/person/person-b/dagoversikt');

        const payload = leggPåInnblikkPerson('event', { name: 'person forlatt', data: { person: 'eksplisitt' } });

        expect(payload.data?.person).toBe('eksplisitt');
    });
});
