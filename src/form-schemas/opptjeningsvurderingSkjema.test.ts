import { Journalpostvalg } from '@form-schemas/begrunnelseOgJournalpostSkjema';
import {
    JaNei,
    OpptjeningsvurderingSchema,
    girIkkeOppfylt,
    girOppfylt,
    opptjeningsvurderingSkjema,
    tilOpptjeningsvurderingRequest,
} from '@form-schemas/opptjeningsvurderingSkjema';
import { ApiOpptjeningsaktivitet } from '@io/rest/generated/vilkarsproving.schemas';

describe('opptjeningsvurderingSkjema', () => {
    it('godtar nei på minst 4 uker uten flere svar', () => {
        expect(opptjeningsvurderingSkjema.safeParse(skjema({ minst4Uker: JaNei.NEI })).success).toBe(true);
    });

    it('krever minst én aktivitet ved ja på minst 4 uker', () => {
        expect(feilstier(skjema({ opptjeningsaktiviteter: [] }))).toEqual(['opptjeningsaktiviteter']);
    });

    it('krever svar om AAP når foreldrepenger er valgt', () => {
        expect(feilstier(skjema({ opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER] }))).toEqual([
            'foreldrepengerOpptjentPåAap',
        ]);
    });

    it('krever svar om yrkesaktivitet når foreldrepengene er opptjent på AAP', () => {
        expect(
            feilstier(
                skjema({
                    opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                    foreldrepengerOpptjentPåAap: JaNei.JA,
                }),
            ),
        ).toEqual(['yrkesaktivMinst4UkerFørUttak']);
    });

    it('validerer ikke svar på spørsmål som ikke vises', () => {
        expect(feilstier(skjema({ minst4Uker: JaNei.NEI, opptjeningsaktiviteter: [] }))).toEqual([]);
        expect(feilstier(skjema({ opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.SYKEPENGER] }))).toEqual([]);
    });

    it('krever begrunnelse', () => {
        expect(feilstier(skjema({ fritekstbegrunnelse: '' }))).toEqual(['fritekstbegrunnelse']);
    });

    it('krever valg av journalpost sammen med de andre feilene i skjemaet', () => {
        expect(feilstier(skjema({ journalpostvalg: undefined, opptjeningsaktiviteter: [] }))).toEqual([
            'opptjeningsaktiviteter',
            'journalpostvalg',
        ]);
    });
});

describe('girIkkeOppfylt', () => {
    it('er ikke oppfylt ved nei på minst 4 uker', () => {
        expect(girIkkeOppfylt({ minst4Uker: JaNei.NEI })).toBe(true);
    });

    it('er ikke oppfylt når foreldrepenger er opptjent på AAP uten yrkesaktivitet før uttak', () => {
        expect(
            girIkkeOppfylt({
                minst4Uker: JaNei.JA,
                opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
                yrkesaktivMinst4UkerFørUttak: JaNei.NEI,
            }),
        ).toBe(true);
    });

    it('ser bort fra svar om yrkesaktivitet når foreldrepenger ikke lenger er valgt', () => {
        expect(
            girIkkeOppfylt({
                minst4Uker: JaNei.JA,
                opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.SYKEPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
                yrkesaktivMinst4UkerFørUttak: JaNei.NEI,
            }),
        ).toBe(false);
    });

    it('er ikke avgjort før minst 4 uker er besvart', () => {
        expect(girIkkeOppfylt({})).toBe(false);
    });
});

describe('girOppfylt', () => {
    it('er oppfylt med bare arbeid', () => {
        expect(girOppfylt({ minst4Uker: JaNei.JA, opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.ARBEID] })).toBe(
            true,
        );
    });

    it('er oppfylt med arbeid og likestilt ytelse', () => {
        expect(
            girOppfylt({
                minst4Uker: JaNei.JA,
                opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.ARBEID, ApiOpptjeningsaktivitet.DAGPENGER],
            }),
        ).toBe(true);
    });

    it('er oppfylt med likestilt ytelse som ikke er foreldrepenger', () => {
        expect(girOppfylt({ minst4Uker: JaNei.JA, opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.SYKEPENGER] })).toBe(
            true,
        );
    });

    it('er oppfylt når foreldrepengene ikke er opptjent på AAP', () => {
        expect(
            girOppfylt({
                minst4Uker: JaNei.JA,
                opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.NEI,
            }),
        ).toBe(true);
    });

    it('er oppfylt når foreldrepengene er opptjent på AAP og søkeren var yrkesaktiv før uttak', () => {
        expect(
            girOppfylt({
                minst4Uker: JaNei.JA,
                opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
                yrkesaktivMinst4UkerFørUttak: JaNei.JA,
            }),
        ).toBe(true);
    });

    it('er ikke oppfylt når svarene gir ikke oppfylt', () => {
        expect(girOppfylt({ minst4Uker: JaNei.NEI })).toBe(false);
        expect(
            girOppfylt({
                minst4Uker: JaNei.JA,
                opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
                yrkesaktivMinst4UkerFørUttak: JaNei.NEI,
            }),
        ).toBe(false);
    });

    it('er ikke avgjort før alle aktuelle spørsmål er besvart', () => {
        expect(girOppfylt({})).toBe(false);
        expect(girOppfylt({ minst4Uker: JaNei.JA, opptjeningsaktiviteter: [] })).toBe(false);
        expect(
            girOppfylt({ minst4Uker: JaNei.JA, opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER] }),
        ).toBe(false);
        expect(
            girOppfylt({
                minst4Uker: JaNei.JA,
                opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
            }),
        ).toBe(false);
    });
});

describe('tilOpptjeningsvurderingRequest', () => {
    it('sender arbeid som opptjeningsaktivitet', () => {
        expect(
            tilOpptjeningsvurderingRequest(
                skjema({ opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.ARBEID] }),
                '2024-01-01',
            ),
        ).toMatchObject({
            minst4Uker: true,
            opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.ARBEID],
            foreldrepengerOpptjentPåAap: null,
            yrkesaktivMinst4UkerFørUttak: null,
        });
    });

    it('sender null for spørsmål som ikke er aktuelle', () => {
        expect(
            tilOpptjeningsvurderingRequest(
                skjema({
                    opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.SYKEPENGER],
                    foreldrepengerOpptjentPåAap: JaNei.JA,
                    yrkesaktivMinst4UkerFørUttak: JaNei.JA,
                }),
                '2024-01-01',
            ),
        ).toEqual({
            skjæringstidspunkt: '2024-01-01',
            minst4Uker: true,
            opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.SYKEPENGER],
            foreldrepengerOpptjentPåAap: null,
            yrkesaktivMinst4UkerFørUttak: null,
            fritekstbegrunnelse: 'Begrunnelse',
            journalpostId: [],
        });
    });

    it('sender ingen opptjeningsaktiviteter ved nei på minst 4 uker', () => {
        expect(
            tilOpptjeningsvurderingRequest(
                skjema({ minst4Uker: JaNei.NEI, opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.DAGPENGER] }),
                '2024-01-01',
            ).opptjeningsaktiviteter,
        ).toEqual([]);
    });

    it('sender alle svarene når foreldrepengene er opptjent på AAP', () => {
        expect(
            tilOpptjeningsvurderingRequest(
                skjema({
                    opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                    foreldrepengerOpptjentPåAap: JaNei.JA,
                    yrkesaktivMinst4UkerFørUttak: JaNei.JA,
                }),
                '2024-01-01',
            ),
        ).toMatchObject({ foreldrepengerOpptjentPåAap: true, yrkesaktivMinst4UkerFørUttak: true });
    });

    it('sender ikke yrkesaktivitet når foreldrepengene ikke er opptjent på AAP', () => {
        expect(
            tilOpptjeningsvurderingRequest(
                skjema({
                    opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.FORELDREPENGER],
                    foreldrepengerOpptjentPåAap: JaNei.NEI,
                    yrkesaktivMinst4UkerFørUttak: JaNei.JA,
                }),
                '2024-01-01',
            ),
        ).toMatchObject({ foreldrepengerOpptjentPåAap: false, yrkesaktivMinst4UkerFørUttak: null });
    });
});

function skjema(overrides: Partial<OpptjeningsvurderingSchema> = {}): OpptjeningsvurderingSchema {
    return {
        minst4Uker: JaNei.JA,
        opptjeningsaktiviteter: [ApiOpptjeningsaktivitet.SYKEPENGER],
        fritekstbegrunnelse: 'Begrunnelse',
        journalpostvalg: Journalpostvalg.OPPLYST_I_SPEIL,
        journalpostIder: [{ verdi: '' }],
        ...overrides,
    };
}

function feilstier(verdi: OpptjeningsvurderingSchema): string[] {
    const resultat = opptjeningsvurderingSkjema.safeParse(verdi);
    return resultat.success ? [] : resultat.error.issues.map((issue) => issue.path.join('.'));
}
