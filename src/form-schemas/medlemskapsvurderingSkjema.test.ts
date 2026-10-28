import { Journalpostvalg } from '@form-schemas/begrunnelseOgJournalpostSkjema';
import { medlemskapsvurderingSkjema, tilMedlemskapsvurderingRequest } from '@form-schemas/medlemskapsvurderingSkjema';
import { ApiManuellMedlemskapsstatus } from '@io/rest/generated/medlemskap/medlemskap.schemas';

describe('medlemskapsvurderingSkjema', () => {
    const gyldig = {
        status: ApiManuellMedlemskapsstatus.NEI,
        fritekstbegrunnelse: 'Bor i utlandet',
        journalpostvalg: Journalpostvalg.LEGG_TIL_JOURNALPOST,
        journalpostIder: [{ verdi: '123' }, { verdi: '' }],
    };

    it('godtar ja eller nei med begrunnelse og journalpost', () => {
        expect(medlemskapsvurderingSkjema.safeParse(gyldig).success).toBe(true);
    });

    it('krever svar og begrunnelse', () => {
        const resultat = medlemskapsvurderingSkjema.safeParse({
            fritekstbegrunnelse: '',
            journalpostIder: [{ verdi: '' }],
        });
        expect(resultat.success).toBe(false);
        expect(resultat.error?.issues.map((issue) => issue.path.join('.')).sort()).toEqual([
            'fritekstbegrunnelse',
            'status',
        ]);
    });

    it('krever journalpostvalg', () => {
        const resultat = medlemskapsvurderingSkjema.safeParse({ ...gyldig, journalpostvalg: undefined });
        expect(resultat.error?.issues.map((issue) => issue.path.join('.'))).toEqual(['journalpostvalg']);
    });

    it('lager request uten tomme journalpost-ID-er', () => {
        expect(tilMedlemskapsvurderingRequest(medlemskapsvurderingSkjema.parse(gyldig), '2024-01-01')).toEqual({
            skjæringstidspunkt: '2024-01-01',
            status: ApiManuellMedlemskapsstatus.NEI,
            fritekstbegrunnelse: 'Bor i utlandet',
            journalpostId: ['123'],
        });
    });
});
