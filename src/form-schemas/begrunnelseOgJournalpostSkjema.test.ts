import z from 'zod/v4';

import {
    BegrunnelseOgJournalpostSchema,
    Journalpostvalg,
    begrunnelseOgJournalpostFelter,
    journalpostIderTilRequest,
    sjekkJournalpost,
} from '@form-schemas/begrunnelseOgJournalpostSkjema';

const skjemaMedJournalpost = z.object(begrunnelseOgJournalpostFelter).check(sjekkJournalpost);

describe('begrunnelseOgJournalpostSkjema', () => {
    it('godtar at saken er godt nok opplyst i Speil uten journalpost-ID', () => {
        expect(feil(skjema())).toEqual([]);
    });

    it('godtar journalpost-ID med 1 til 11 siffer', () => {
        expect(feil(medJournalpostIder('1'))).toEqual([]);
        expect(feil(medJournalpostIder('12345678901'))).toEqual([]);
    });

    it('avviser journalpost-ID med andre tegn enn tall', () => {
        expect(feil(medJournalpostIder('JP-123'))).toEqual([
            { sti: 'journalpostIder.0.verdi', melding: 'Dokument-ID må være 1 til 11 siffer' },
        ]);
    });

    it('avviser journalpost-ID som er lengre enn 11 siffer', () => {
        expect(feil(medJournalpostIder('123456789012'))).toEqual([
            { sti: 'journalpostIder.0.verdi', melding: 'Dokument-ID må være 1 til 11 siffer' },
        ]);
    });

    it('krever valg av om journalpost-ID skal legges til', () => {
        expect(feil(skjema({ journalpostvalg: undefined }))).toEqual([
            { sti: 'journalpostvalg', melding: 'Velg om du vil legge til journalpost-ID' },
        ]);
    });

    it('krever journalpost-ID når saksbehandler har valgt å legge den til', () => {
        expect(feil(medJournalpostIder(''))).toEqual([
            { sti: 'journalpostIder.0.verdi', melding: 'Fyll inn journalpost-ID' },
        ]);
    });
});

describe('journalpostIderTilRequest', () => {
    it('sender utfylte journalpost-IDer når saksbehandler har valgt å legge dem til', () => {
        expect(journalpostIderTilRequest(medJournalpostIder('123', '', '456'))).toEqual(['123', '456']);
    });

    it('sender ingen journalpost-IDer når saken er godt nok opplyst i Speil', () => {
        expect(
            journalpostIderTilRequest({
                journalpostvalg: Journalpostvalg.OPPLYST_I_SPEIL,
                journalpostIder: [{ verdi: '123' }],
            }),
        ).toEqual([]);
    });
});

function skjema(overrides: Partial<BegrunnelseOgJournalpostSchema> = {}): BegrunnelseOgJournalpostSchema {
    return {
        fritekstbegrunnelse: 'Begrunnelse',
        journalpostvalg: Journalpostvalg.OPPLYST_I_SPEIL,
        journalpostIder: [{ verdi: '' }],
        ...overrides,
    };
}

function medJournalpostIder(...verdier: string[]): BegrunnelseOgJournalpostSchema {
    return skjema({
        journalpostvalg: Journalpostvalg.LEGG_TIL_JOURNALPOST,
        journalpostIder: verdier.map((verdi) => ({ verdi })),
    });
}

function feil(verdi: BegrunnelseOgJournalpostSchema): { sti: string; melding: string }[] {
    const resultat = skjemaMedJournalpost.safeParse(verdi);
    return resultat.success
        ? []
        : resultat.error.issues.map((issue) => ({ sti: issue.path.join('.'), melding: issue.message }));
}
