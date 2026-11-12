import { Journalpostvalg } from '@form-schemas/begrunnelseOgJournalpostSkjema';
import {
    GrunnForIkkeOppfylt,
    GrunnForOppfylt,
    OppholdskravSchema,
    oppholdskravSkjema,
    tilOppholdskravRequest,
} from '@form-schemas/oppholdskravSkjema';
import { JaNei } from '@form-schemas/opptjeningsvurderingSkjema';
import { ApiUnntakAndreLedd } from '@io/rest/generated/avslagsdager/avslagsdager.schemas';

describe('oppholdskravSkjema', () => {
    it('godtar et oppfylt krav med grunn', () => {
        expect(feilstier(skjema())).toEqual([]);
    });

    it('godtar et krav som ikke er oppfylt med grunn', () => {
        expect(
            feilstier(
                skjema({
                    oppfyllerOppholdskravet: JaNei.NEI,
                    grunnForOppfylt: undefined,
                    grunnForIkkeOppfylt: GrunnForIkkeOppfylt.SØKNAD_AVSLÅTT,
                }),
            ),
        ).toEqual([]);
    });

    it('krever minst én dag', () => {
        expect(feilstier(skjema({ dager: [] }))).toEqual(['dager']);
    });

    it('krever svar på om personen er EØS-borger og om kravet er oppfylt', () => {
        expect(
            feilstier(skjema({ eøsBorger: undefined, oppfyllerOppholdskravet: undefined, grunnForOppfylt: undefined })),
        ).toEqual(['eøsBorger', 'oppfyllerOppholdskravet']);
    });

    it('krever grunn når kravet er oppfylt', () => {
        expect(feilstier(skjema({ grunnForOppfylt: undefined }))).toEqual(['grunnForOppfylt']);
    });

    it('krever grunn når kravet ikke er oppfylt', () => {
        expect(feilstier(skjema({ oppfyllerOppholdskravet: JaNei.NEI, grunnForOppfylt: undefined }))).toEqual([
            'grunnForIkkeOppfylt',
        ]);
    });

    it('validerer ikke grunnen for utfallet som ikke er valgt', () => {
        expect(
            feilstier(
                skjema({
                    oppfyllerOppholdskravet: JaNei.NEI,
                    grunnForOppfylt: GrunnForOppfylt.MEDLEM,
                    grunnForIkkeOppfylt: GrunnForIkkeOppfylt.IKKE_SØKT,
                }),
            ),
        ).toEqual([]);
    });

    it('godtar ikke en begrunnelse med bare mellomrom', () => {
        expect(feilstier(skjema({ fritekstbegrunnelse: '   ' }))).toEqual(['fritekstbegrunnelse']);
    });

    it('krever begrunnelse og valg av journalpost sammen med de andre feilene', () => {
        expect(
            feilstier(skjema({ grunnForOppfylt: undefined, fritekstbegrunnelse: '', journalpostvalg: undefined })),
        ).toEqual(['fritekstbegrunnelse', 'grunnForOppfylt', 'journalpostvalg']);
    });
});

describe('tilOppholdskravRequest', () => {
    const { MEDLEM_ETTER_2_5_2_6_2_8, INNLAGT_I_HELSEINSTITUSJON, INGEN } = ApiUnntakAndreLedd;

    test.each([
        [GrunnForOppfylt.OPPHOLD_I_GODKJENT_OMRÅDE, true, null, null],
        [GrunnForOppfylt.MEDLEM, false, MEDLEM_ETTER_2_5_2_6_2_8, null],
        [GrunnForOppfylt.HELSEINSTITUSJON, false, INNLAGT_I_HELSEINSTITUSJON, null],
        [GrunnForOppfylt.INNVILGET_SØKNAD, false, INGEN, true],
        [GrunnForOppfylt.YRKESSKADE, false, INGEN, true],
    ])(
        'oppfylt med %s gir opphold %s, unntak %s og fire uker %s',
        (grunn, oppholdIGodkjentOmråde, unntakAndreLedd, godkjentOppholdInntilFireUker) => {
            expect(tilOppholdskravRequest(skjema({ grunnForOppfylt: grunn }), 'behandling-1')).toMatchObject({
                oppholdIGodkjentOmråde,
                unntakAndreLedd,
                godkjentOppholdInntilFireUker,
            });
        },
    );

    test.each([GrunnForIkkeOppfylt.SØKNAD_AVSLÅTT, GrunnForIkkeOppfylt.IKKE_SØKT])(
        'ikke oppfylt med %s gir ingen unntak og ikke godkjent opphold',
        (grunn) => {
            expect(
                tilOppholdskravRequest(
                    skjema({ oppfyllerOppholdskravet: JaNei.NEI, grunnForIkkeOppfylt: grunn }),
                    'behandling-1',
                ),
            ).toMatchObject({
                oppholdIGodkjentOmråde: false,
                unntakAndreLedd: INGEN,
                godkjentOppholdInntilFireUker: false,
            });
        },
    );

    it('sender resten av skjemaet', () => {
        expect(
            tilOppholdskravRequest(
                skjema({
                    eøsBorger: JaNei.NEI,
                    journalpostvalg: Journalpostvalg.LEGG_TIL_JOURNALPOST,
                    journalpostIder: [{ verdi: '123' }, { verdi: '' }],
                }),
                'behandling-1',
            ),
        ).toEqual({
            behandlingId: 'behandling-1',
            dager: ['2024-07-15', '2024-07-16'],
            eøsBorger: false,
            oppholdIGodkjentOmråde: true,
            unntakAndreLedd: null,
            godkjentOppholdInntilFireUker: null,
            fritekstbegrunnelse: 'Begrunnelse',
            journalpostId: ['123'],
        });
    });

    it('bruker grunnen for utfallet som er valgt', () => {
        expect(
            tilOppholdskravRequest(
                skjema({
                    oppfyllerOppholdskravet: JaNei.NEI,
                    grunnForOppfylt: GrunnForOppfylt.OPPHOLD_I_GODKJENT_OMRÅDE,
                    grunnForIkkeOppfylt: GrunnForIkkeOppfylt.IKKE_SØKT,
                }),
                'behandling-1',
            ),
        ).toMatchObject({ oppholdIGodkjentOmråde: false, godkjentOppholdInntilFireUker: false });
    });
});

function skjema(overrides: Partial<OppholdskravSchema> = {}): OppholdskravSchema {
    return {
        dager: ['2024-07-15', '2024-07-16'],
        eøsBorger: JaNei.JA,
        oppfyllerOppholdskravet: JaNei.JA,
        grunnForOppfylt: GrunnForOppfylt.OPPHOLD_I_GODKJENT_OMRÅDE,
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
