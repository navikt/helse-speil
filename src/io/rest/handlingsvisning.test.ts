import { handlingsvisningSchema } from '@io/rest/handlingsvisning';

describe('handlingsvisningSchema', () => {
    test('godtar kjente felttyper', () => {
        const visning = {
            felter: [
                { type: 'TEKST', tittel: 'Utfall', tekst: 'Oppfylt' },
                { type: 'LISTE', tittel: 'Journalposter', elementer: ['123'] },
                {
                    type: 'ENDRINGER',
                    tittel: 'Dager endret',
                    grupper: [
                        {
                            rader: [
                                { navn: 'Dato', fra: null, til: '01.01.2024' },
                                { navn: 'Sykdomsgrad', fra: '100 %', til: '60 %' },
                            ],
                        },
                    ],
                },
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

    test('godtar endringsrader uten fra-verdi', () => {
        const resultat = handlingsvisningSchema.safeParse({
            felter: [
                {
                    type: 'ENDRINGER',
                    tittel: 'Dager endret',
                    grupper: [{ rader: [{ navn: 'Dato', til: '01.01.2024' }] }],
                },
            ],
        });

        expect(resultat.success).toBe(true);
    });

    test('avviser endringer med feil form', () => {
        const resultat = handlingsvisningSchema.safeParse({
            felter: [{ type: 'ENDRINGER', tittel: 'Dager endret', grupper: [{ rader: [{ navn: 'Dato' }] }] }],
        });

        expect(resultat.success).toBe(false);
    });
});
