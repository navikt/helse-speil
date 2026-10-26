import {
    JaNei,
    LikestiltYtelseSchema,
    girIkkeOppfylt,
    girOppfylt,
    likestiltYtelseSkjema,
    tilLikestiltYtelseRequest,
} from '@form-schemas/likestiltYtelseSkjema';
import { Journalpostvalg } from '@form-schemas/opptjeningSkjema';
import { ApiLikestiltYtelse } from '@io/rest/generated/vilkarsproving.schemas';

describe('likestiltYtelseSkjema', () => {
    it('godtar nei på sammenlagt uten flere svar', () => {
        expect(likestiltYtelseSkjema.safeParse(skjema({ sammenlagtMinst4Uker: JaNei.NEI })).success).toBe(true);
    });

    it('krever minst én ytelse ved ja på sammenlagt', () => {
        expect(feilstier(skjema({ ytelser: [] }))).toEqual(['ytelser']);
    });

    it('krever svar om AAP når foreldrepenger er valgt', () => {
        expect(feilstier(skjema({ ytelser: [ApiLikestiltYtelse.FORELDREPENGER] }))).toEqual([
            'foreldrepengerOpptjentPåAap',
        ]);
    });

    it('krever svar om yrkesaktivitet når foreldrepengene er opptjent på AAP', () => {
        expect(
            feilstier(skjema({ ytelser: [ApiLikestiltYtelse.FORELDREPENGER], foreldrepengerOpptjentPåAap: JaNei.JA })),
        ).toEqual(['yrkesaktivMinst4UkerFørUttak']);
    });

    it('validerer ikke svar på spørsmål som ikke vises', () => {
        expect(feilstier(skjema({ sammenlagtMinst4Uker: JaNei.NEI, ytelser: [] }))).toEqual([]);
        expect(feilstier(skjema({ ytelser: [ApiLikestiltYtelse.SYKEPENGER] }))).toEqual([]);
    });

    it('krever begrunnelse', () => {
        expect(feilstier(skjema({ fritekstbegrunnelse: '' }))).toEqual(['fritekstbegrunnelse']);
    });
});

describe('girIkkeOppfylt', () => {
    it('er ikke oppfylt ved nei på sammenlagt', () => {
        expect(girIkkeOppfylt({ sammenlagtMinst4Uker: JaNei.NEI })).toBe(true);
    });

    it('er ikke oppfylt når foreldrepenger er opptjent på AAP uten yrkesaktivitet før uttak', () => {
        expect(
            girIkkeOppfylt({
                sammenlagtMinst4Uker: JaNei.JA,
                ytelser: [ApiLikestiltYtelse.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
                yrkesaktivMinst4UkerFørUttak: JaNei.NEI,
            }),
        ).toBe(true);
    });

    it('ser bort fra svar om yrkesaktivitet når foreldrepenger ikke lenger er valgt', () => {
        expect(
            girIkkeOppfylt({
                sammenlagtMinst4Uker: JaNei.JA,
                ytelser: [ApiLikestiltYtelse.SYKEPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
                yrkesaktivMinst4UkerFørUttak: JaNei.NEI,
            }),
        ).toBe(false);
    });

    it('er ikke avgjort før sammenlagt er besvart', () => {
        expect(girIkkeOppfylt({})).toBe(false);
    });
});

describe('girOppfylt', () => {
    it('er oppfylt med likestilt ytelse som ikke er foreldrepenger', () => {
        expect(girOppfylt({ sammenlagtMinst4Uker: JaNei.JA, ytelser: [ApiLikestiltYtelse.SYKEPENGER] })).toBe(true);
    });

    it('er oppfylt når foreldrepengene ikke er opptjent på AAP', () => {
        expect(
            girOppfylt({
                sammenlagtMinst4Uker: JaNei.JA,
                ytelser: [ApiLikestiltYtelse.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.NEI,
            }),
        ).toBe(true);
    });

    it('er oppfylt når foreldrepengene er opptjent på AAP og søkeren var yrkesaktiv før uttak', () => {
        expect(
            girOppfylt({
                sammenlagtMinst4Uker: JaNei.JA,
                ytelser: [ApiLikestiltYtelse.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
                yrkesaktivMinst4UkerFørUttak: JaNei.JA,
            }),
        ).toBe(true);
    });

    it('er ikke oppfylt når svarene gir ikke oppfylt', () => {
        expect(girOppfylt({ sammenlagtMinst4Uker: JaNei.NEI })).toBe(false);
        expect(
            girOppfylt({
                sammenlagtMinst4Uker: JaNei.JA,
                ytelser: [ApiLikestiltYtelse.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
                yrkesaktivMinst4UkerFørUttak: JaNei.NEI,
            }),
        ).toBe(false);
    });

    it('er ikke avgjort før alle aktuelle spørsmål er besvart', () => {
        expect(girOppfylt({})).toBe(false);
        expect(girOppfylt({ sammenlagtMinst4Uker: JaNei.JA, ytelser: [] })).toBe(false);
        expect(girOppfylt({ sammenlagtMinst4Uker: JaNei.JA, ytelser: [ApiLikestiltYtelse.FORELDREPENGER] })).toBe(
            false,
        );
        expect(
            girOppfylt({
                sammenlagtMinst4Uker: JaNei.JA,
                ytelser: [ApiLikestiltYtelse.FORELDREPENGER],
                foreldrepengerOpptjentPåAap: JaNei.JA,
            }),
        ).toBe(false);
    });
});

describe('tilLikestiltYtelseRequest', () => {
    it('sender null for spørsmål som ikke er aktuelle', () => {
        expect(
            tilLikestiltYtelseRequest(
                skjema({
                    ytelser: [ApiLikestiltYtelse.SYKEPENGER],
                    foreldrepengerOpptjentPåAap: JaNei.JA,
                    yrkesaktivMinst4UkerFørUttak: JaNei.JA,
                }),
                '2024-01-01',
            ),
        ).toEqual({
            skjæringstidspunkt: '2024-01-01',
            sammenlagtMinst4Uker: true,
            ytelser: [ApiLikestiltYtelse.SYKEPENGER],
            foreldrepengerOpptjentPåAap: null,
            yrkesaktivMinst4UkerFørUttak: null,
            fritekstbegrunnelse: 'Begrunnelse',
            journalpostId: [],
        });
    });

    it('sender ingen ytelser ved nei på sammenlagt', () => {
        expect(
            tilLikestiltYtelseRequest(
                skjema({ sammenlagtMinst4Uker: JaNei.NEI, ytelser: [ApiLikestiltYtelse.DAGPENGER] }),
                '2024-01-01',
            ).ytelser,
        ).toEqual([]);
    });

    it('sender alle svarene når foreldrepengene er opptjent på AAP', () => {
        expect(
            tilLikestiltYtelseRequest(
                skjema({
                    ytelser: [ApiLikestiltYtelse.FORELDREPENGER],
                    foreldrepengerOpptjentPåAap: JaNei.JA,
                    yrkesaktivMinst4UkerFørUttak: JaNei.JA,
                }),
                '2024-01-01',
            ),
        ).toMatchObject({ foreldrepengerOpptjentPåAap: true, yrkesaktivMinst4UkerFørUttak: true });
    });

    it('sender ikke yrkesaktivitet når foreldrepengene ikke er opptjent på AAP', () => {
        expect(
            tilLikestiltYtelseRequest(
                skjema({
                    ytelser: [ApiLikestiltYtelse.FORELDREPENGER],
                    foreldrepengerOpptjentPåAap: JaNei.NEI,
                    yrkesaktivMinst4UkerFørUttak: JaNei.JA,
                }),
                '2024-01-01',
            ),
        ).toMatchObject({ foreldrepengerOpptjentPåAap: false, yrkesaktivMinst4UkerFørUttak: null });
    });
});

function skjema(overrides: Partial<LikestiltYtelseSchema> = {}): LikestiltYtelseSchema {
    return {
        sammenlagtMinst4Uker: JaNei.JA,
        ytelser: [ApiLikestiltYtelse.SYKEPENGER],
        fritekstbegrunnelse: 'Begrunnelse',
        journalpostvalg: Journalpostvalg.OPPLYST_I_SPEIL,
        journalpostIder: [{ verdi: '' }],
        ...overrides,
    };
}

function feilstier(verdi: LikestiltYtelseSchema): string[] {
    const resultat = likestiltYtelseSkjema.safeParse(verdi);
    return resultat.success ? [] : resultat.error.issues.map((issue) => issue.path.join('.'));
}
