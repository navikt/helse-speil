import { Journalpostvalg } from '@form-schemas/begrunnelseOgJournalpostSkjema';
import {
    OppholdskravSchema,
    aktuelleSpørsmål,
    girIkkeOppfylt,
    girOppfylt,
    oppholdskravSkjema,
    tilOppholdskravRequest,
} from '@form-schemas/oppholdskravSkjema';
import { JaNei } from '@form-schemas/opptjeningsvurderingSkjema';
import { ApiUnntakAndreLedd } from '@io/rest/generated/avslagsdager/avslagsdager.schemas';

describe('oppholdskravSkjema', () => {
    it('godtar opphold i godkjent område uten flere svar', () => {
        expect(feilstier(skjema({ unntakAndreLedd: undefined, godkjentOppholdInntilFireUker: undefined }))).toEqual([]);
    });

    it('krever minst én dag', () => {
        expect(feilstier(skjema({ dager: [] }))).toEqual(['dager']);
    });

    it('krever svar på begge spørsmålene i første ledd', () => {
        expect(feilstier(skjema({ eøsBorger: undefined, oppholdIGodkjentOmråde: undefined }))).toEqual([
            'eøsBorger',
            'oppholdIGodkjentOmråde',
        ]);
    });

    it('krever svar på unntak i andre ledd når første ledd ikke er oppfylt', () => {
        expect(feilstier(skjema({ oppholdIGodkjentOmråde: JaNei.NEI }))).toEqual(['unntakAndreLedd']);
    });

    it('krever svar på godkjent opphold når ingen av unntakene gjelder', () => {
        expect(
            feilstier(skjema({ oppholdIGodkjentOmråde: JaNei.NEI, unntakAndreLedd: ApiUnntakAndreLedd.INGEN })),
        ).toEqual(['godkjentOppholdInntilFireUker']);
    });

    it('validerer ikke svar på spørsmål som ikke vises', () => {
        expect(
            feilstier(
                skjema({
                    oppholdIGodkjentOmråde: JaNei.NEI,
                    unntakAndreLedd: ApiUnntakAndreLedd.INNLAGT_I_HELSEINSTITUSJON,
                    godkjentOppholdInntilFireUker: undefined,
                }),
            ),
        ).toEqual([]);
    });

    it('godtar ikke en begrunnelse med bare mellomrom', () => {
        expect(feilstier(skjema({ fritekstbegrunnelse: '   ' }))).toEqual(['fritekstbegrunnelse']);
    });

    it('krever begrunnelse og valg av journalpost sammen med de andre feilene', () => {
        expect(
            feilstier(
                skjema({ oppholdIGodkjentOmråde: JaNei.NEI, fritekstbegrunnelse: '', journalpostvalg: undefined }),
            ),
        ).toEqual(['fritekstbegrunnelse', 'unntakAndreLedd', 'journalpostvalg']);
    });
});

describe('aktuelleSpørsmål', () => {
    it('viser bare første ledd før det er besvart', () => {
        expect(aktuelleSpørsmål({})).toEqual({ unntakAndreLedd: false, godkjentOppholdInntilFireUker: false });
    });

    it('viser andre ledd når første ledd ikke er oppfylt', () => {
        expect(aktuelleSpørsmål({ oppholdIGodkjentOmråde: JaNei.NEI })).toEqual({
            unntakAndreLedd: true,
            godkjentOppholdInntilFireUker: false,
        });
    });

    it('viser godkjent opphold når ingen av unntakene gjelder', () => {
        expect(
            aktuelleSpørsmål({ oppholdIGodkjentOmråde: JaNei.NEI, unntakAndreLedd: ApiUnntakAndreLedd.INGEN }),
        ).toEqual({ unntakAndreLedd: true, godkjentOppholdInntilFireUker: true });
    });

    it('skjuler andre ledd igjen når første ledd endres til oppfylt', () => {
        expect(
            aktuelleSpørsmål({ oppholdIGodkjentOmråde: JaNei.JA, unntakAndreLedd: ApiUnntakAndreLedd.INGEN }),
        ).toEqual({ unntakAndreLedd: false, godkjentOppholdInntilFireUker: false });
    });
});

describe('utfall', () => {
    const { JA, NEI } = JaNei;
    const { MEDLEM_ETTER_2_5_2_6_2_8, INNLAGT_I_HELSEINSTITUSJON, INGEN } = ApiUnntakAndreLedd;

    // Samme grener som vilkårsvurderinger() og samletUtfall() i Oppholdskravvurdering i sp-avslagsdager
    test.each([
        ['første ledd oppfylt', { eøsBorger: JA, oppholdIGodkjentOmråde: JA }],
        ['første ledd oppfylt for en som ikke er EØS-borger', { eøsBorger: NEI, oppholdIGodkjentOmråde: JA }],
        [
            'unntak for medlem',
            { eøsBorger: JA, oppholdIGodkjentOmråde: NEI, unntakAndreLedd: MEDLEM_ETTER_2_5_2_6_2_8 },
        ],
        [
            'unntak for innlagt',
            { eøsBorger: NEI, oppholdIGodkjentOmråde: NEI, unntakAndreLedd: INNLAGT_I_HELSEINSTITUSJON },
        ],
        [
            'godkjent opphold i inntil fire uker',
            { eøsBorger: JA, oppholdIGodkjentOmråde: NEI, unntakAndreLedd: INGEN, godkjentOppholdInntilFireUker: JA },
        ],
    ])('gir oppfylt ved %s', (_, svar) => {
        expect(girOppfylt(svar)).toBe(true);
        expect(girIkkeOppfylt(svar)).toBe(false);
    });

    test('gir ikke oppfylt når ingen av grunnlagene er oppfylt', () => {
        const svar = {
            eøsBorger: JA,
            oppholdIGodkjentOmråde: NEI,
            unntakAndreLedd: INGEN,
            godkjentOppholdInntilFireUker: NEI,
        };

        expect(girIkkeOppfylt(svar)).toBe(true);
        expect(girOppfylt(svar)).toBe(false);
    });

    test.each([
        ['ingen svar', {}],
        ['EØS-borger ikke besvart', { oppholdIGodkjentOmråde: JA }],
        ['opphold ikke besvart', { eøsBorger: JA }],
        ['unntak ikke besvart', { eøsBorger: JA, oppholdIGodkjentOmråde: NEI }],
        ['fire uker ikke besvart', { eøsBorger: JA, oppholdIGodkjentOmråde: NEI, unntakAndreLedd: INGEN }],
    ])('gir verken oppfylt eller ikke oppfylt med %s', (_, svar) => {
        expect(girOppfylt(svar)).toBe(false);
        expect(girIkkeOppfylt(svar)).toBe(false);
    });

    test('ser bort fra svar på spørsmål som ikke er aktuelle', () => {
        const svar = {
            eøsBorger: JA,
            oppholdIGodkjentOmråde: NEI,
            unntakAndreLedd: MEDLEM_ETTER_2_5_2_6_2_8,
            godkjentOppholdInntilFireUker: NEI,
        };

        expect(girOppfylt(svar)).toBe(true);
        expect(girIkkeOppfylt(svar)).toBe(false);
    });
});

describe('tilOppholdskravRequest', () => {
    it('sender alle svarene når alle spørsmålene vises', () => {
        expect(
            tilOppholdskravRequest(
                skjema({
                    eøsBorger: JaNei.NEI,
                    oppholdIGodkjentOmråde: JaNei.NEI,
                    unntakAndreLedd: ApiUnntakAndreLedd.INGEN,
                    godkjentOppholdInntilFireUker: JaNei.NEI,
                    journalpostvalg: Journalpostvalg.LEGG_TIL_JOURNALPOST,
                    journalpostIder: [{ verdi: '123' }, { verdi: '' }],
                }),
                'behandling-1',
            ),
        ).toEqual({
            behandlingId: 'behandling-1',
            dager: ['2024-07-15', '2024-07-16'],
            eøsBorger: false,
            oppholdIGodkjentOmråde: false,
            unntakAndreLedd: ApiUnntakAndreLedd.INGEN,
            godkjentOppholdInntilFireUker: false,
            fritekstbegrunnelse: 'Begrunnelse',
            journalpostId: ['123'],
        });
    });

    it('sender skjulte svar som null', () => {
        expect(
            tilOppholdskravRequest(
                skjema({
                    oppholdIGodkjentOmråde: JaNei.JA,
                    unntakAndreLedd: ApiUnntakAndreLedd.INGEN,
                    godkjentOppholdInntilFireUker: JaNei.JA,
                }),
                'behandling-1',
            ),
        ).toMatchObject({ unntakAndreLedd: null, godkjentOppholdInntilFireUker: null });
    });

    it('sender ikke godkjent opphold når et av unntakene gjelder', () => {
        expect(
            tilOppholdskravRequest(
                skjema({
                    oppholdIGodkjentOmråde: JaNei.NEI,
                    unntakAndreLedd: ApiUnntakAndreLedd.MEDLEM_ETTER_2_5_2_6_2_8,
                    godkjentOppholdInntilFireUker: JaNei.NEI,
                }),
                'behandling-1',
            ),
        ).toMatchObject({
            unntakAndreLedd: ApiUnntakAndreLedd.MEDLEM_ETTER_2_5_2_6_2_8,
            godkjentOppholdInntilFireUker: null,
        });
    });
});

function skjema(overrides: Partial<OppholdskravSchema> = {}): OppholdskravSchema {
    return {
        dager: ['2024-07-15', '2024-07-16'],
        eøsBorger: JaNei.JA,
        oppholdIGodkjentOmråde: JaNei.JA,
        fritekstbegrunnelse: 'Begrunnelse',
        journalpostvalg: Journalpostvalg.OPPLYST_I_SPEIL,
        journalpostIder: [{ verdi: '' }],
        ...overrides,
    } as OppholdskravSchema;
}

function feilstier(verdi: OppholdskravSchema): string[] {
    const resultat = oppholdskravSkjema.safeParse(verdi);
    return resultat.success ? [] : resultat.error.issues.map((issue) => issue.path.join('.'));
}
