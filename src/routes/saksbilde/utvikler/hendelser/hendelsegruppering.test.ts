import { SparsomAktivitet } from '@io/rest/sparsom';

import { grupperIHendelser } from './hendelsegruppering';

const vedtaksperiodeId = 'en-vedtaksperiode-id';

function enAktivitet(overrides: Partial<SparsomAktivitet>): SparsomAktivitet {
    return {
        id: '1',
        tidsstempel: '2026-02-01T10:00:00',
        nivå: 'INFO',
        tekst: 'En aktivitet',
        kontekster: {},
        ...overrides,
    };
}

describe('grupperIHendelser', () => {
    it('grupperer aktiviteter på meldingsreferanse i tidsrekkefølge', () => {
        const hendelser = grupperIHendelser([
            enAktivitet({
                id: '2',
                tidsstempel: '2026-02-01T10:00:02',
                nivå: 'VARSEL',
                kontekster: { Søknad: { meldingsreferanseId: 'søknad' }, Vedtaksperiode: { vedtaksperiodeId } },
            }),
            enAktivitet({
                id: '1',
                tidsstempel: '2026-02-01T10:00:01',
                kontekster: { Søknad: { meldingsreferanseId: 'søknad' }, Vedtaksperiode: { vedtaksperiodeId } },
            }),
        ]);

        expect(hendelser).toHaveLength(1);
        const [søknad] = hendelser;
        expect(søknad).toMatchObject({
            meldingsreferanseId: 'søknad',
            type: 'Søknad',
            opprettet: '2026-02-01T10:00:01',
            harVarsel: true,
            harFeil: false,
        });
        expect(søknad!.aktiviteter.map((it) => it.id)).toEqual(['1', '2']);
    });

    it('utelater hendelser der vedtaksperioden bare forsøkes gjenopptatt', () => {
        const hendelser = grupperIHendelser([
            enAktivitet({
                tekst: 'Forsøker å gjenoppta behandling',
                kontekster: {
                    Påminnelse: { meldingsreferanseId: 'påminnelse' },
                    Vedtaksperiode: { vedtaksperiodeId },
                },
            }),
        ]);

        expect(hendelser).toEqual([]);
    });

    it('markerer funksjonelle og logiske feil som feil', () => {
        const hendelser = grupperIHendelser([
            enAktivitet({
                nivå: 'LOGISK_FEIL',
                kontekster: {
                    Inntektsmelding: { meldingsreferanseId: 'im' },
                    Vedtaksperiode: { vedtaksperiodeId },
                },
            }),
        ]);

        expect(hendelser[0]?.harFeil).toBe(true);
    });
});
