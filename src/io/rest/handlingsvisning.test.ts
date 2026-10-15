import { handlingsvisningSchema } from '@io/rest/handlingsvisning';

describe('handlingsvisningSchema', () => {
    test('godtar kjente felttyper', () => {
        const visning = {
            felter: [
                { type: 'TEKST', tittel: 'Utfall', tekst: 'Oppfylt' },
                { type: 'LISTE', tittel: 'Journalposter', elementer: ['123'] },
            ],
        };

        expect(handlingsvisningSchema.parse(visning)).toEqual(visning);
    });

    test('hopper over ukjente felttyper', () => {
        const visning = handlingsvisningSchema.parse({
            felter: [
                { type: 'TABELL', tittel: 'Noe nytt', rader: [] },
                { type: 'TEKST', tittel: 'Utfall', tekst: 'Oppfylt' },
            ],
        });

        expect(visning.felter).toEqual([{ type: 'TEKST', tittel: 'Utfall', tekst: 'Oppfylt' }]);
    });

    test('avviser kjente felttyper med feil form', () => {
        const resultat = handlingsvisningSchema.safeParse({ felter: [{ type: 'TEKST', tittel: 'Utfall' }] });

        expect(resultat.success).toBe(false);
    });
});
