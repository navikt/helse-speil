import { SparsomAktivitet } from '@io/rest/sparsom';

import { hendelserForVedtaksperiode } from './hendelsegruppering';

const vedtaksperiodeId = 'en-vedtaksperiode-id';

function enAktivitet(overrides: Partial<SparsomAktivitet>): SparsomAktivitet {
    return {
        id: 1,
        tidsstempel: '2026-02-01T10:00:00',
        nivå: 'INFO',
        tekst: 'En aktivitet',
        kontekster: {},
        ...overrides,
    };
}

describe('hendelserForVedtaksperiode', () => {
    it('grupperer aktiviteter på meldingsreferanse og markerer hvilke som gjelder vedtaksperioden', () => {
        const hendelser = hendelserForVedtaksperiode(
            [
                enAktivitet({
                    id: 2,
                    tidsstempel: '2026-02-01T10:00:02',
                    nivå: 'VARSEL',
                    kontekster: { Søknad: { meldingsreferanseId: 'søknad' } },
                }),
                enAktivitet({
                    id: 1,
                    tidsstempel: '2026-02-01T10:00:01',
                    kontekster: { Søknad: { meldingsreferanseId: 'søknad' }, Vedtaksperiode: { vedtaksperiodeId } },
                }),
            ],
            vedtaksperiodeId,
        );

        expect(hendelser).toHaveLength(1);
        const [søknad] = hendelser;
        expect(søknad).toMatchObject({
            meldingsreferanseId: 'søknad',
            type: 'Søknad',
            opprettet: '2026-02-01T10:00:01',
            harVarsel: true,
            harFeil: false,
        });
        expect(søknad!.aktiviteter.map((it) => [it.id, it.gjelderVedtaksperioden])).toEqual([
            [1, true],
            [2, false],
        ]);
    });

    it('utelater hendelser som ikke gjelder vedtaksperioden', () => {
        const hendelser = hendelserForVedtaksperiode(
            [
                enAktivitet({
                    kontekster: {
                        Søknad: { meldingsreferanseId: 'søknad' },
                        Vedtaksperiode: { vedtaksperiodeId: 'en-annen-vedtaksperiode' },
                    },
                }),
            ],
            vedtaksperiodeId,
        );

        expect(hendelser).toEqual([]);
    });

    it('utelater hendelser der vedtaksperioden bare forsøkes gjenopptatt', () => {
        const hendelser = hendelserForVedtaksperiode(
            [
                enAktivitet({
                    tekst: 'Forsøker å gjenoppta behandling',
                    kontekster: {
                        Påminnelse: { meldingsreferanseId: 'påminnelse' },
                        Vedtaksperiode: { vedtaksperiodeId },
                    },
                }),
            ],
            vedtaksperiodeId,
        );

        expect(hendelser).toEqual([]);
    });

    it('markerer funksjonelle og logiske feil som feil', () => {
        const hendelser = hendelserForVedtaksperiode(
            [
                enAktivitet({
                    nivå: 'LOGISK_FEIL',
                    kontekster: {
                        Inntektsmelding: { meldingsreferanseId: 'im' },
                        Vedtaksperiode: { vedtaksperiodeId },
                    },
                }),
            ],
            vedtaksperiodeId,
        );

        expect(hendelser[0]?.harFeil).toBe(true);
    });
});
